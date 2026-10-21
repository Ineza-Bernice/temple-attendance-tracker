import { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/auth')({
  head: () => ({ meta: [
    { title: 'Staff Sign In | Moses Generation · Zion Temple' },
    { name: 'description', content: 'Sign in to the Moses Generation children’s ministry attendance workspace.' },
    { property: 'og:title', content: 'Staff Sign In | Moses Generation' },
    { property: 'og:description', content: 'Sign in to the Zion Temple children’s ministry workspace.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [setup, setSetup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: '/', replace: true }); });
    supabase.rpc('admin_exists').then(({ data }) => setSetup(data === false));
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg(''); setBusy(true);
    if (setup) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: name } } });
      setBusy(false);
      if (error) return setMsg(error.message);
      if (data.session) return navigate({ to: '/', replace: true });
      setSetup(false);
      return setMsg('Check your email to confirm your administrator account, then sign in.');
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg('Email or password is incorrect.');
    navigate({ to: '/', replace: true });
  }

  return <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <form onSubmit={submit} className="form-section w-full max-w-sm">
      <div className="mb-6 text-center"><div className="text-xs tracking-widest text-muted-foreground">ZION TEMPLE</div><h1 className="text-2xl font-bold mt-1">Moses Generation</h1><p className="text-sm text-muted-foreground mt-1">{setup ? 'Create the first administrator account' : 'Staff sign in'}</p></div>
      <div className="space-y-4">
        {setup && <div className="field"><label htmlFor="a-name">Full name</label><input id="a-name" className="form-input" required maxLength={100} value={name} onChange={e => setName(e.target.value)} /></div>}
        <div className="field"><label htmlFor="a-email">Email</label><input id="a-email" type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="field"><label htmlFor="a-pass">Password</label><input id="a-pass" type="password" className="form-input" required minLength={setup ? 8 : 1} value={password} onChange={e => setPassword(e.target.value)} /></div>
      </div>
      {msg && <p className="form-error mt-4" role="alert">{msg}</p>}
      <Button className="w-full mt-6" type="submit" disabled={busy}>{busy ? 'Please wait…' : setup ? 'Create administrator' : 'Sign in'}</Button>
      {!setup && <p className="text-xs text-muted-foreground mt-4 text-center">No account? Ask a ministry administrator to add you.</p>}
    </form>
  </div>;
}
