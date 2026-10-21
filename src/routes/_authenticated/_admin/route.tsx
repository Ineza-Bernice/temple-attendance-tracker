import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { meQuery } from '@/features/attendance/auth';

export const Route = createFileRoute('/_authenticated/_admin')({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQuery);
    if (me?.role !== 'admin') throw redirect({ to: '/' });
  },
  component: () => <Outlet />,
});
