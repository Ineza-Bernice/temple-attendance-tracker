import { createFileRoute } from '@tanstack/react-router';
import { AttendancePage } from '@/features/attendance/pages';
export const Route = createFileRoute('/_authenticated/_admin/attendance')({
 head: () => ({ meta: [
  { title: 'Attendance Log | Moses Generation · Zion Temple' },
  { name: 'description', content: 'Browse permanent Sunday attendance by date, child, week, class, and service.' },
  { property: 'og:title', content: 'Attendance Log | Moses Generation' },
  { property: 'og:description', content: 'Browse permanent Sunday attendance by date, child, week, class, and service.' },
  { property: 'og:type', content: 'website' },
  { name: 'twitter:card', content: 'summary_large_image' },
 ] }), component: AttendancePage,
});
