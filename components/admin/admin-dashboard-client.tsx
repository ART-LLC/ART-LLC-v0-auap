'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  DollarSign,
  LogOut,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Trophy,
} from 'lucide-react'
import type { DashboardMetrics } from '@/lib/admin-metrics'
import type { FeedAlert } from '@/lib/merchant-health'

type KpiResponse = DashboardMetrics & {
  feed: {
    lastGoogleFetch: string | null
    snapshotDay: string | null
    eligible: number | null
    total: number | null
    alerts: FeedAlert[]
  }
}

const REFRESH_MS = 60_000

const fetcher = async (url: string): Promise<KpiResponse> => {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store' })
  if (res.status === 401) {
    throw new Error('unauthorized')
  }
  if (!res.ok) throw new Error(`Failed to load KPIs: ${res.status}`)
  return res.json()
}

function money(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const count = (n: number) => n.toLocaleString('en-US')
const plural = (n: number, word: string) => `${count(n)} ${word}${n === 1 ? '' : 's'}`

export function AdminDashboardClient({ adminEmail }: { adminEmail: string }) {
  const router = useRouter()
  const [data, setData] = useState<KpiResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      setData(await fetcher('/api/admin/kpis'))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, REFRESH_MS)
    return () => clearInterval(interval)
  }, [load])

  // Redirect to login if unauthorized
  useEffect(() => {
    if (error?.message === 'unauthorized') {
      router.push('/admin/login')
    }
  }, [error, router])

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin/login')
    router.refresh()
  }

  const alerts: FeedAlert[] = data
    ? [
        ...data.feed.alerts,
        ...(data.actions.staleNewQuotes > 0
          ? [
              {
                level: 'warning' as const,
                message: `${plural(data.actions.staleNewQuotes, 'quote request')} waiting over 24 hours for a call-back.`,
              },
            ]
          : []),
        ...(data.actions.stalePendingOrders > 0
          ? [
              {
                level: 'warning' as const,
                message: `${plural(data.actions.stalePendingOrders, 'order')} still pending after 24 hours.`,
              },
            ]
          : []),
      ]
    : []

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-full px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground text-balance">
              AUAPW Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Logged in as: <span className="font-semibold">{adminEmail}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-muted/70 rounded-lg transition-colors"
              aria-label="Refresh KPIs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-full px-6 py-8">
        {error && error.message !== 'unauthorized' && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-6 text-sm">
            Failed to load live KPIs. The dashboard will retry automatically.
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Live numbers from orders and quote requests
            {data
              ? ` — updated ${new Date(data.generatedAt).toLocaleTimeString()}, days counted in ${data.timeZone.replace('_', ' ')} time`
              : ''}
          </p>
          {isLoading && !data && <p className="text-sm text-muted-foreground">Loading…</p>}
        </div>

        {alerts.length > 0 && (
          <section
            aria-labelledby="alerts-heading"
            className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
          >
            <h2 id="alerts-heading" className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Needs attention
            </h2>
            <ul className="flex flex-col gap-1 text-sm">
              {alerts.map((a) => (
                <li
                  key={a.message}
                  className={a.level === 'critical' ? 'text-destructive' : 'text-foreground'}
                >
                  {a.message}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Primary KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <KpiCard
            label="Paid revenue today"
            value={data ? money(data.today.revenue) : '—'}
            detail={data ? `${plural(data.today.orders, 'order')} placed today` : undefined}
            icon={<DollarSign className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Last 7 days"
            value={data ? money(data.last7.revenue) : '—'}
            detail={data ? `${plural(data.last7.orders, 'order')} · ${plural(data.last7.quotes, 'quote')}` : undefined}
            icon={<CalendarDays className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Last 30 days"
            value={data ? money(data.last30.revenue) : '—'}
            detail={
              data
                ? `Avg paid order ${data.last30.paidOrders ? money(data.last30.averageOrderValue) : '—'}`
                : undefined
            }
            icon={<ShoppingCart className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Quote requests today"
            value={data ? count(data.today.quotes) : '—'}
            detail={data ? `${count(data.yesterday.quotes)} yesterday · ${count(data.last30.quotes)} in 30 days` : undefined}
            icon={<ClipboardList className="w-5 h-5 text-primary" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            label="Quote win rate (30 days)"
            value={data ? (data.last30.quoteWinRate === null ? '—' : `${Math.round(data.last30.quoteWinRate * 100)}%`) : '—'}
            detail="Won ÷ (won + lost)"
            icon={<Trophy className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Open quotes"
            value={data ? count(data.actions.openQuotes) : '—'}
            detail={data ? `${count(data.actions.newQuotes)} not yet contacted` : undefined}
            href="/admin/quotes?status=new"
            icon={<ClipboardList className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Orders to confirm"
            value={data ? count(data.actions.pendingOrders + data.actions.reservedOrders) : '—'}
            detail={
              data
                ? `${count(data.actions.pendingOrders)} pending · ${count(data.actions.reservedOrders)} reserved · ${count(data.actions.unpaidConfirmedOrders)} unpaid`
                : undefined
            }
            href="/admin/orders?status=pending"
            icon={<ShoppingCart className="w-5 h-5 text-primary" />}
          />
          <KpiCard
            label="Products in Google feed"
            value={data?.feed.eligible != null ? count(data.feed.eligible) : '—'}
            detail={
              data
                ? data.feed.lastGoogleFetch
                  ? `Google fetched ${new Date(data.feed.lastGoogleFetch).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`
                  : 'Google has not fetched the feed yet'
                : undefined
            }
            href="/admin/merchant"
            icon={<ShoppingBag className="w-5 h-5 text-primary" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <section aria-labelledby="trend-heading" className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
            <h2 id="trend-heading" className="text-lg font-semibold text-foreground mb-4">
              Last 14 days
            </h2>
            {data ? <DailyChart daily={data.daily} /> : <p className="text-sm text-muted-foreground">Loading…</p>}
          </section>

          <section aria-labelledby="makes-heading" className="bg-card border border-border rounded-lg p-6">
            <h2 id="makes-heading" className="text-lg font-semibold text-foreground mb-1">
              Most requested makes
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">Quote requests, last 30 days</p>
            {data && data.topMakes.length === 0 && <p className="text-sm text-muted-foreground">No quote requests yet.</p>}
            <ul className="space-y-2 text-sm">
              {data?.topMakes.map((m) => (
                <li key={m.make} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 truncate text-foreground">{m.make}</span>
                  <span className="h-2 flex-1 rounded-full bg-muted" aria-hidden="true">
                    <span
                      className="block h-2 rounded-full bg-primary"
                      style={{ width: `${(m.count / data.topMakes[0].count) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 text-right font-semibold tabular-nums text-foreground">{m.count}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section aria-labelledby="lifetime-heading" className="bg-card border border-border rounded-lg p-6">
            <h2 id="lifetime-heading" className="text-lg font-semibold text-foreground mb-4">
              All time
            </h2>
            <ul className="space-y-3 text-sm">
              <OpRow label="Paid revenue" value={data ? money(data.lifetime.revenue) : '—'} />
              <OpRow label="Orders" value={data ? count(data.lifetime.orders) : '—'} />
              <OpRow label="Quote requests" value={data ? count(data.lifetime.quotes) : '—'} />
            </ul>
          </section>

          <section aria-labelledby="recent-heading" className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="recent-heading" className="text-lg font-semibold text-foreground">
                Recent orders
              </h2>
              <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                All orders
              </Link>
            </div>
            {data && data.recentOrders.length === 0 && (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}
            <div className="divide-y divide-border">
              {data?.recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders?q=${encodeURIComponent(o.orderNumber)}`}
                  className="grid grid-cols-2 gap-x-3 py-3 text-sm hover:bg-muted/40 sm:grid-cols-4"
                >
                  <span className="font-mono text-foreground">{o.orderNumber}</span>
                  <span className="truncate text-muted-foreground">{o.customerName || 'Guest'}</span>
                  <span className="text-muted-foreground capitalize">{o.status.replace(/_/g, ' ')}</span>
                  <span className="text-right font-semibold text-foreground">{money(o.amount)}</span>
                </Link>
              ))}
              {!data && (
                <p className="py-3 text-sm text-muted-foreground">Loading orders…</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function DailyChart({ daily }: { daily: KpiResponse['daily'] }) {
  const maxRevenue = Math.max(...daily.map((d) => d.revenue), 1)
  const maxQuotes = Math.max(...daily.map((d) => d.quotes), 1)
  const label = (day: string) =>
    new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

  return (
    <div>
      <div className="flex h-40 items-end gap-1" aria-hidden="true">
        {daily.map((d) => (
          <div
            key={d.day}
            className="flex h-full flex-1 items-end justify-center gap-0.5"
            title={`${label(d.day)}: ${money(d.revenue)} paid · ${plural(d.orders, 'order')} · ${plural(d.quotes, 'quote')}`}
          >
            <span className="w-1/2 rounded-t bg-primary" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
            <span className="w-1/3 rounded-t bg-sky-500/70" style={{ height: `${(d.quotes / maxQuotes) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 text-[10px] text-muted-foreground" aria-hidden="true">
        {daily.map((d, i) => (
          <span key={d.day} className="flex-1 text-center">
            {i % 2 === 0 ? label(d.day) : ''}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground" aria-hidden="true">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Paid revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-500/70" /> Quote requests
        </span>
      </div>
      <table className="sr-only">
        <caption>Paid revenue, orders and quote requests per day</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Paid revenue</th>
            <th scope="col">Orders</th>
            <th scope="col">Quote requests</th>
          </tr>
        </thead>
        <tbody>
          {daily.map((d) => (
            <tr key={d.day}>
              <td>{label(d.day)}</td>
              <td>{money(d.revenue)}</td>
              <td>{d.orders}</td>
              <td>{d.quotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function KpiCard({
  label,
  value,
  detail,
  href,
  icon,
}: {
  label: string
  value: string
  detail?: string
  href?: string
  icon: React.ReactNode
}) {
  const body = (
    <>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
    </>
  )
  return href ? (
    <Link href={href} className="block bg-card border border-border rounded-lg p-6 transition-colors hover:border-primary">
      {body}
    </Link>
  ) : (
    <div className="bg-card border border-border rounded-lg p-6">{body}</div>
  )
}

function OpRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </li>
  )
}
