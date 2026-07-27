import { getAdminStats } from '@/app/actions/admin-actions'
import { Users, ShoppingBag, AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, href: '/admin/orders', color: 'text-blue-400' },
    { label: 'Total Sellers', value: stats.totalSellers, icon: Users, href: '/admin/sellers', color: 'text-primary' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, href: '/admin/sellers?filter=pending', color: 'text-yellow-400' },
    { label: 'Open Fraud Flags', value: stats.openFraudFlags, icon: AlertTriangle, href: '/admin/fraud', color: 'text-destructive' },
  ]

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">Admin Overview</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
          >
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-2xl font-black text-foreground">{value}</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-wide text-foreground/50">{label}</span>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground/50 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/sellers?filter=pending">Review Pending Sellers</Link>
          </Button>
          <Button asChild variant="destructive" size="sm">
            <Link href="/admin/fraud">Review Fraud Flags</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/payouts">Run Payouts</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
