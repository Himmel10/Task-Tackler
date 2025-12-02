import { AdminDashboard } from '@/components/AdminDashboard';

// Mark admin routes as dynamic to prevent static prerendering
export const dynamic = 'force-dynamic';

export default function Admin() {
  return <AdminDashboard />;
}
