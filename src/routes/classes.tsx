import { createFileRoute } from '@tanstack/react-router';
import { ChildrenPage } from '@/features/attendance/pages';
export const Route = createFileRoute('/classes')({
 head: () => ({ meta: [
  { title: 'Our Classes | Moses Generation · Zion Temple' },
  { name: 'description', content: 'Children and attendance history for the 3–5, 6–8, and 9–12 year classes.' },
  { property: 'og:title', content: 'Our Classes | Moses Generation' },
  { property: 'og:description', content: 'Children and attendance history for the 3–5, 6–8, and 9–12 year classes.' },
  { property: 'og:type', content: 'website' },
  { name: 'twitter:card', content: 'summary_large_image' },
 ] }), component: () => <ChildrenPage classView />,
});
