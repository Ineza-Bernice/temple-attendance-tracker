import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

export type Role = 'admin' | 'teacher';
export type Me = { id: string; email: string; name: string; role: Role | null };

export async function fetchMe(): Promise<Me | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: roles }, { data: profile }] = await Promise.all([
    supabase.from('user_roles').select('role').eq('user_id', user.id),
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
  ]);
  const list = (roles ?? []).map(r => r.role);
  const role: Role | null = list.includes('admin') ? 'admin' : list.includes('teacher') ? 'teacher' : null;
  return { id: user.id, email: user.email ?? '', name: profile?.full_name || user.email || 'Staff member', role };
}
export const meQuery = { queryKey: ['me'], queryFn: fetchMe, staleTime: 60_000 };
export function useMe() { return useQuery(meQuery); }

export function useSignOut() {
  const qc = useQueryClient(); const navigate = useNavigate();
  return async () => { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); navigate({ to: '/auth', replace: true }); };
}
