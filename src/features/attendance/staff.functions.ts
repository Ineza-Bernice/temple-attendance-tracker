import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (error || !data) throw new Error('Only administrators can manage staff.');
}

export const listStaff = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      context.supabase.from('profiles').select('id, full_name, email, created_at').order('created_at'),
      context.supabase.from('user_roles').select('user_id, role'),
    ]);
    return (profiles ?? []).map((p: any) => ({ ...p, role: (roles ?? []).find((r: any) => r.user_id === p.id)?.role ?? 'teacher' })) as { id: string; full_name: string; email: string | null; created_at: string; role: 'admin' | 'teacher' }[];
  });

const staffInput = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  role: z.enum(['admin', 'teacher']),
});

export const createStaff = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => staffInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email, password: data.password, email_confirm: true,
      user_metadata: { full_name: data.fullName },
      app_metadata: { created_by_admin: 'true', staff_role: data.role },
    });
    if (error) throw new Error(error.message.includes('already') ? 'An account with this email already exists.' : 'The account could not be created.');
    return { ok: true };
  });
