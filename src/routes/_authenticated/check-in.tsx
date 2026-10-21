import { createFileRoute } from '@tanstack/react-router';
import { CheckInPage } from '@/features/attendance/pages';
export const Route = createFileRoute('/_authenticated/check-in')({
 head: () => ({ meta: [
  { title: 'Sunday Check-in | Moses Generation · Zion Temple' },
  { name: 'description', content: 'Find registered children and record attendance for Sunday services at Zion Temple.' },
  { property: 'og:title', content: 'Sunday Check-in | Moses Generation' },
  { property: 'og:description', content: 'Find registered children and record attendance for Sunday services at Zion Temple.' },
  { property: 'og:type', content: 'website' },
  { name: 'twitter:card', content: 'summary_large_image' },
 ] }), component: CheckInPage,
});
