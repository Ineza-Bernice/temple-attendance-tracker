import { createFileRoute } from '@tanstack/react-router';
import { ChildrenPage } from '@/features/attendance/pages';
export const Route = createFileRoute('/children')({
 head: () => ({ meta: [
  { title: 'Children Register | Moses Generation · Zion Temple' },
  { name: 'description', content: 'Register children and find saved details for the Moses Generation ministry.' },
  { property: 'og:title', content: 'Children Register | Moses Generation' },
  { property: 'og:description', content: 'Register children and find saved details for the Moses Generation ministry.' },
  { property: 'og:type', content: 'website' },
  { name: 'twitter:card', content: 'summary_large_image' },
 ] }), component: ChildrenPage,
});
