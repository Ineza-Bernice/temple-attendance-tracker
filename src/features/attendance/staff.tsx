import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { listStaff, createStaff } from './staff.functions';
import { PageHeading, EmptyState } from './shared';

export function StaffPage() {
  const qc = useQueryClient();
  const list = useServerFn(listStaff);
  const create = useServerFn(createStaff);
  const staff = useQuery({ queryKey: ['staff'], queryFn: () => list() });
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'teacher' as 'admin' | 'teacher' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setBusy(true);
    try {
      await create({ data: form });
      toast.success(`${form.fullName} can now sign in.`);
      setForm({ fullName: '', email: '', password: '', role: 'teacher' });
      await qc.invalidateQueries({ queryKey: ['staff'] });
    } catch (err) { setError(err instanceof Error ? err.message : 'The account could not be created.'); }
    finally { setBusy(false); }
  }

  return <><PageHeading title="Staff accounts" description="Add teachers so they can register children and check them in." />
    <div className="checkin-layout">
      <section className="form-section"><h2 className="section-title"><UserPlus />Add a staff member</h2>
        <form onSubmit={submit}><div className="form-grid">
          <div className="field form-full"><label htmlFor="s-name">Full name</label><input id="s-name" className="form-input" required maxLength={100} value={form.fullName} onChange={set('fullName')} /></div>
          <div className="field form-full"><label htmlFor="s-email">Email</label><input id="s-email" type="email" className="form-input" required value={form.email} onChange={set('email')} /></div>
          <div className="field"><label htmlFor="s-pass">Temporary password</label><input id="s-pass" type="text" className="form-input" required minLength={8} value={form.password} onChange={set('password')} /></div>
          <div className="field"><label htmlFor="s-role">Role</label><select id="s-role" className="form-input" value={form.role} onChange={set('role')}><option value="teacher">Teacher</option><option value="admin">Administrator</option></select></div>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button className="w-full mt-6" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</Button></form>
      </section>
      <section className="panel self-start"><div className="panel-header pb-5"><div><h2>Team</h2><p>{staff.data?.length ?? 0} accounts</p></div></div>
        {staff.isLoading ? <p className="p-4 text-sm text-muted-foreground">Loading…</p> : staff.data?.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{staff.data.map(s => <tr key={s.id}><td>{s.full_name || '—'}</td><td>{s.email}</td><td><span className="class-badge">{s.role === 'admin' ? 'Administrator' : 'Teacher'}</span></td></tr>)}</tbody></table></div> : <EmptyState text="No staff yet." />}
      </section>
    </div></>;
}
