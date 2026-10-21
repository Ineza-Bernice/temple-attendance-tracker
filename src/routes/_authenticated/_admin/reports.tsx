import { createFileRoute } from '@tanstack/react-router';
import { ReportsPage } from '@/features/attendance/pages';
export const Route = createFileRoute('/_authenticated/_admin/reports')({
 head: () => ({ meta: [
  { title: 'Monthly Reports | Moses Generation · Zion Temple' },
  { name: 'description', content: 'Monthly class and individual attendance summaries for Moses Generation.' },
  { property: 'og:title', content: 'Monthly Reports | Moses Generation' },
  { property: 'og:description', content: 'Monthly class and individual attendance summaries for Moses Generation.' },
  { property: 'og:type', content: 'website' },
  { name: 'twitter:card', content: 'summary_large_image' },
 ] }), component: ReportsPage,
});
