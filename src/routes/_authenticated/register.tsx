import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageHeading, RegistrationForm } from '@/features/attendance/shared';

export const Route = createFileRoute('/_authenticated/register')({
  head: () => ({ meta: [
    { title: 'Register a Child | Moses Generation · Zion Temple' },
    { name: 'description', content: 'Register a new child for the Moses Generation children’s ministry.' },
    { property: 'og:title', content: 'Register a Child | Moses Generation' },
    { property: 'og:description', content: 'Register a new child for the Moses Generation children’s ministry.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  return <><PageHeading title="Register a child" description="Welcome a new member to the family." /><section className="form-section max-w-2xl"><RegistrationForm onDone={() => navigate({ to: '/check-in' })} /></section></>;
}
