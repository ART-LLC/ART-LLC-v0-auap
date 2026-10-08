import "server-only"
import { pool } from "@/lib/db"

/**
 * Real sales and follow-up numbers for the admin dashboard and the daily
 * report email, read straight from public.orders and public.leads (the tables
 * the checkout and quote forms write to). Days are counted in the business's
 * own time zone so "today" matches the phone line's day.
 */

export const BUSINESS_TIME_ZONE = "America/Chicago"

// Statuses where the customer has actually paid. "confirmed" and the reserve
// statuses are still waiting on payment, so they count as orders, not revenue.
const PAID_STATUSES = ["paid", "shipped", "delivered"]
const OPEN_QUOTE_STATUSES = ["new", "contacted", "quoted"]
const STALE_HOURS = 24

export interface PeriodTotals {
  orders: number
  paidOrders: number
  revenue: number
  quotes: number
}

export interface DailyPoint extends PeriodTotals {
  day: string
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string | null
  status: string
  amount: number
  createdAt: string
}

export interface DashboardMetrics {
  generatedAt: string
  timeZone: string
  today: PeriodTotals
  yesterday: PeriodTotals
  last7: PeriodTotals
  last30: PeriodTotals & { averageOrderValue: number; quoteWinRate: number | null }
  lifetime: { orders: number; revenue: number; quotes: number }
  actions: {
    newQuotes: number
    staleNewQuotes: number
    openQuotes: number
    pendingOrders: number
    stalePendingOrders: number
    reservedOrders: number
    unpaidConfirmedOrders: number
  }
  daily: DailyPoint[]
  topMakes: { make: string; count: number }[]
  recentOrders: RecentOrder[]
}

const n = (v: unknown) => {
  const x = Number(v)
  return Number.isFinite(x) ? x : 0
}

/** Midnight in the business time zone, `daysAgo` days back, as an SQL expression. */
const dayStart = (daysAgo: number) =>
  `(date_trunc('day', now() AT TIME ZONE '${BUSINESS_TIME_ZONE}') - interval '${daysAgo} days') AT TIME ZONE '${BUSINESS_TIME_ZONE}'`

async function periodTotals(fromDaysAgo: number, toDaysAgo: number | null): Promise<PeriodTotals> {
  const upper = toDaysAgo === null ? "now()" : dayStart(toDaysAgo)
  const [orders, leads] = await Promise.all([
    pool.query(
      `SELECT count(*) FILTER (WHERE status <> 'cancelled')::int AS orders,
              count(*) FILTER (WHERE status = ANY($1))::int AS paid_orders,
              coalesce(sum(totalamount) FILTER (WHERE status = ANY($1)), 0) AS revenue
         FROM public.orders
        WHERE createdat >= ${dayStart(fromDaysAgo)} AND createdat < ${upper}`,
      [PAID_STATUSES],
    ),
    pool.query(
      `SELECT count(*)::int AS quotes FROM public.leads
        WHERE created_at >= ${dayStart(fromDaysAgo)} AND created_at < ${upper}`,
    ),
  ])
  return {
    orders: n(orders.rows[0]?.orders),
    paidOrders: n(orders.rows[0]?.paid_orders),
    revenue: n(orders.rows[0]?.revenue),
    quotes: n(leads.rows[0]?.quotes),
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [today, yesterday, last7, last30, lifetime, quoteOutcomes, actions, daily, topMakes, recent] =
    await Promise.all([
      periodTotals(0, null),
      periodTotals(1, 0),
      periodTotals(6, null),
      periodTotals(29, null),
      pool.query(
        `SELECT (SELECT count(*) FROM public.orders WHERE status <> 'cancelled')::int AS orders,
                (SELECT coalesce(sum(totalamount), 0) FROM public.orders WHERE status = ANY($1)) AS revenue,
                (SELECT count(*) FROM public.leads)::int AS quotes`,
        [PAID_STATUSES],
      ),
      pool.query(
        `SELECT count(*) FILTER (WHERE status = 'won')::int AS won,
                count(*) FILTER (WHERE status = 'lost')::int AS lost
           FROM public.leads WHERE created_at >= ${dayStart(29)}`,
      ),
      pool.query(
        `SELECT
           (SELECT count(*) FROM public.leads WHERE status = 'new')::int AS new_quotes,
           (SELECT count(*) FROM public.leads
             WHERE status = 'new' AND created_at < now() - interval '${STALE_HOURS} hours')::int AS stale_new_quotes,
           (SELECT count(*) FROM public.leads WHERE status = ANY($1))::int AS open_quotes,
           (SELECT count(*) FROM public.orders WHERE status = 'pending')::int AS pending_orders,
           (SELECT count(*) FROM public.orders
             WHERE status = 'pending' AND createdat < now() - interval '${STALE_HOURS} hours')::int AS stale_pending_orders,
           (SELECT count(*) FROM public.orders WHERE status = 'reserved_pending_fitment')::int AS reserved_orders,
           (SELECT count(*) FROM public.orders WHERE status = 'confirmed')::int AS unpaid_confirmed_orders`,
        [OPEN_QUOTE_STATUSES],
      ),
      pool.query(
        `WITH days AS (
           SELECT generate_series(
             date_trunc('day', now() AT TIME ZONE '${BUSINESS_TIME_ZONE}') - interval '13 days',
             date_trunc('day', now() AT TIME ZONE '${BUSINESS_TIME_ZONE}'),
             interval '1 day'
           ) AS day
         ),
         o AS (
           SELECT date_trunc('day', createdat::timestamptz AT TIME ZONE '${BUSINESS_TIME_ZONE}') AS day,
                  count(*) FILTER (WHERE status <> 'cancelled')::int AS orders,
                  count(*) FILTER (WHERE status = ANY($1))::int AS paid_orders,
                  coalesce(sum(totalamount) FILTER (WHERE status = ANY($1)), 0) AS revenue
             FROM public.orders WHERE createdat >= ${dayStart(13)} GROUP BY 1
         ),
         l AS (
           SELECT date_trunc('day', created_at::timestamptz AT TIME ZONE '${BUSINESS_TIME_ZONE}') AS day,
                  count(*)::int AS quotes
             FROM public.leads WHERE created_at >= ${dayStart(13)} GROUP BY 1
         )
         SELECT to_char(days.day, 'YYYY-MM-DD') AS day,
                coalesce(o.orders, 0) AS orders, coalesce(o.paid_orders, 0) AS paid_orders,
                coalesce(o.revenue, 0) AS revenue, coalesce(l.quotes, 0) AS quotes
           FROM days LEFT JOIN o ON o.day = days.day LEFT JOIN l ON l.day = days.day
          ORDER BY days.day`,
        [PAID_STATUSES],
      ),
      pool.query(
        `SELECT initcap(lower(trim(make))) AS make, count(*)::int AS count
           FROM public.leads
          WHERE created_at >= ${dayStart(29)} AND coalesce(trim(make), '') <> ''
          GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT 8`,
      ),
      pool.query(
        `SELECT id, ordernumber, customer_name, status, totalamount, createdat
           FROM public.orders ORDER BY createdat DESC LIMIT 8`,
      ),
    ])

  const won = n(quoteOutcomes.rows[0]?.won)
  const lost = n(quoteOutcomes.rows[0]?.lost)
  const a = actions.rows[0] ?? {}

  return {
    generatedAt: new Date().toISOString(),
    timeZone: BUSINESS_TIME_ZONE,
    today,
    yesterday,
    last7,
    last30: {
      ...last30,
      averageOrderValue: last30.paidOrders > 0 ? last30.revenue / last30.paidOrders : 0,
      quoteWinRate: won + lost > 0 ? won / (won + lost) : null,
    },
    lifetime: {
      orders: n(lifetime.rows[0]?.orders),
      revenue: n(lifetime.rows[0]?.revenue),
      quotes: n(lifetime.rows[0]?.quotes),
    },
    actions: {
      newQuotes: n(a.new_quotes),
      staleNewQuotes: n(a.stale_new_quotes),
      openQuotes: n(a.open_quotes),
      pendingOrders: n(a.pending_orders),
      stalePendingOrders: n(a.stale_pending_orders),
      reservedOrders: n(a.reserved_orders),
      unpaidConfirmedOrders: n(a.unpaid_confirmed_orders),
    },
    daily: daily.rows.map((r) => ({
      day: String(r.day),
      orders: n(r.orders),
      paidOrders: n(r.paid_orders),
      revenue: n(r.revenue),
      quotes: n(r.quotes),
    })),
    topMakes: topMakes.rows.map((r) => ({ make: String(r.make), count: n(r.count) })),
    recentOrders: recent.rows.map((r) => ({
      id: String(r.id),
      orderNumber: String(r.ordernumber),
      customerName: (r.customer_name as string) ?? null,
      status: String(r.status ?? "pending"),
      amount: n(r.totalamount),
      createdAt: r.createdat instanceof Date ? r.createdat.toISOString() : String(r.createdat),
    })),
  }
}
