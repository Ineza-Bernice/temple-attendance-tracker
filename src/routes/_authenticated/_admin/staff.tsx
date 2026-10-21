import { createFileRoute } from '@tanstack/react-router';
import { StaffPage } from '@/features/attendance/staff';

export const Route = createFileRoute('/_authenticated/_admin/staff')({
  head: () => ({ meta: [
    { title: 'Staff Accounts | Moses Generation · Zion Temple' },
    { name: 'description', content: 'Administrators add teachers and manage staff access for Moses Generation.' },
    { property: 'og:title', content: 'Staff Accounts | Moses Generation' },
    { property: 'og:description', content: 'Administrators add teachers and manage staff access.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: StaffPage,
});
