import { createFileRoute } from '@tanstack/react-router';
import { Overview } from '@/features/attendance/overview';
export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Ministry Overview | Moses Generation · Zion Temple' },
    { name: 'description', content: 'Moses Generation children’s ministry attendance overview, Sunday services, and class registrations at Zion Temple.' },
    { property: 'og:title', content: 'Moses Generation | Zion Temple' },
    { property: 'og:description', content: 'Every child matters. Track Sunday check-ins, classes, and ministry attendance.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Overview,
});
