create type public.app_role as enum ('admin','teacher');
create type public.tribe as enum ('Reuben','Simeon','Levi','Judah','Dan','Naphtali','Gad','Asher','Issachar','Zebulun','Joseph','Benjamin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id)
$$;
create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;
grant execute on function public.admin_exists() to anon, authenticated;

create policy "Own profile or admin reads" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Own profile update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "Own role or admin reads" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- Signup: first account becomes admin; later accounts only when created by an admin (app_metadata), as teacher.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  assigned public.app_role;
begin
  perform pg_advisory_xact_lock(424242);
  if not exists (select 1 from public.user_roles where role = 'admin') then
    assigned := 'admin';
  elsif coalesce(new.raw_app_meta_data->>'created_by_admin','') = 'true' then
    assigned := coalesce(nullif(new.raw_app_meta_data->>'staff_role',''),'teacher')::public.app_role;
  else
    raise exception 'Sign-up is closed. Ask an administrator for an account.';
  end if;
  insert into public.profiles (id, full_name, email)
    values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email);
  insert into public.user_roles (user_id, role) values (new.id, assigned);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create sequence public.child_code_seq;
create table public.children (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('MG-' || lpad(nextval('public.child_code_seq')::text, 3, '0')),
  full_name text not null check (char_length(full_name) between 1 and 100),
  parent_name text check (parent_name is null or char_length(parent_name) <= 100),
  family public.tribe,
  dob date,
  phone text check (phone is null or char_length(phone) <= 30),
  class_name text not null default '3-5 Years' check (class_name in ('3-5 Years','6-8 Years','9-12 Years')),
  registered_on date not null default current_date,
  created_by uuid,
  created_at timestamptz not null default now()
);
grant usage on sequence public.child_code_seq to authenticated;
grant select, insert, update, delete on public.children to authenticated;
grant all on public.children to service_role;
alter table public.children enable row level security;
create policy "Staff read children" on public.children for select to authenticated using (public.is_staff(auth.uid()));
create policy "Staff register children" on public.children for insert to authenticated
  with check (public.is_staff(auth.uid()) and created_by = auth.uid());
create policy "Admins update children" on public.children for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins delete children" on public.children for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  service_date date not null,
  week smallint not null check (week between 1 and 5),
  service smallint not null check (service between 1 and 3),
  checked_in_at timestamptz not null default now(),
  checked_in_by uuid,
  unique (child_id, service_date, service)
);
grant select, insert, delete on public.attendance to authenticated;
grant all on public.attendance to service_role;
alter table public.attendance enable row level security;
create policy "Admins read all attendance" on public.attendance for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Teachers read recent attendance" on public.attendance for select to authenticated
  using (public.is_staff(auth.uid()) and service_date >= current_date - 7);
create policy "Staff check in" on public.attendance for insert to authenticated
  with check (public.is_staff(auth.uid()) and checked_in_by = auth.uid());
create policy "Admins delete attendance" on public.attendance for delete to authenticated using (public.has_role(auth.uid(),'admin'));