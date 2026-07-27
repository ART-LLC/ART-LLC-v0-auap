import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Settings, ChevronRight } from 'lucide-react'

const NAV = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/listings', label: 'Listings', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/seller/payouts', label: 'Payouts', icon: DollarSign },
  { href: '/seller/settings', label: 'Settings', icon: Settings },
]

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="text-xs font-black tracking-[0.2em] uppercase text-primary">
            AUAPW
          </Link>
          <p className="text-[0.65rem] text-foreground/50 mt-0.5 font-semibold tracking-wide uppercase">
            Seller Portal
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
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
