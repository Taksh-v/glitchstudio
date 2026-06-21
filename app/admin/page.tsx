import { AdminLogin } from '@/components/admin-login'
import { AdminDashboard } from '@/components/admin-dashboard'
import { isAdminAuthed } from '@/lib/admin'
import { getOrders } from '@/app/actions/orders'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'GlitchStudio // Ops',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  if (!(await isAdminAuthed())) {
    return <AdminLogin />
  }
  const orders = await getOrders()
  return <AdminDashboard orders={orders} />
}
