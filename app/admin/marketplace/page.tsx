import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminMarketplaceDashboard } from '@/components/admin/admin-marketplace-dashboard'
import { getAdminSession } from '@/lib/admin-auth'

export const metadata: Metadata = {
  title: 'Marketplace Admin | AUAPW',
  description: 'Monitor marketplace health and manage sellers',
}

export const dynamic = 'force-dynamic'

export default async function AdminMarketplacePage() {
  if (!(await getAdminSession())) redirect('/admin/login')

  return (
    <main className="min-h-screen bg-background">
      <AdminMarketplaceDashboard />
    </main>
  )
}
