import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userRoles } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import Link from 'next/link'
import { LayoutDashboard, Users, ShoppingBag, AlertTriangle, DollarSign, ChevronRight } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/sellers', label: 'Sellers', icon: Users },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/fraud', label: 'Fraud Flags', icon: AlertTriangle },
  { href: '/admin/payouts', label: 'Payouts', icon: DollarSign },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const role = await db
    .select()
    .from(userRoles)
    .where(and(eq(userRoles.userId, session.user.id), eq(userRoles.role, 'admin')))
    .limit(1)

  if (!role[0]) redirect('/')

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="text-xs font-black tracking-[0.2em] uppercase text-primary">
            AUAPW
          </Link>
          <p className="text-[0.65rem] text-foreground/50 mt-0.5 font-semibold tracking-wide uppercase">
            Admin Console
          </p>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors group"
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-border">
          <p className="text-[0.65rem] text-foreground/40 truncate">{session.user.email}</p>
          <p className="text-[0.6rem] text-primary font-black uppercase tracking-wide mt-0.5">Admin</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
