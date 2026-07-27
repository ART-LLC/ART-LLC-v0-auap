import { NextResponse } from 'next/server'
import { desc, gte, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  orders,
  fraudFlags,
  rmaRequests,
  sellerReviews,
  user,
} from '@/lib/db/schema'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

function num(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export async function GET() {
  // Protect the endpoint — admin session required (httpOnly cookie)
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    // --- Order metrics (today) ---
    const [orderAgg] = await db
      .select({
        count: sql<number>`count(*)`,
        revenue: sql<number>`coalesce(sum(${orders.total}), 0)`,
        paidCount: sql<number>`count(*) filter (where ${orders.paymentStatus} = 'paid')`,
        refundedCount: sql<number>`count(*) filter (where ${orders.status} = 'refunded')`,
      })
      .from(orders)
      .where(gte(orders.createdAt, startOfDay))

    const totalOrders = num(orderAgg?.count)
    const dailyRevenue = num(orderAgg?.revenue)
    const paidCount = num(orderAgg?.paidCount)
    const refundedCount = num(orderAgg?.refundedCount)
    const averageOrderValue = totalOrders > 0 ? dailyRevenue / totalOrders : 0
    const approvalRate = totalOrders > 0 ? (paidCount / totalOrders) * 100 : 0
    const refundRate = totalOrders > 0 ? (refundedCount / totalOrders) * 100 : 0

    // --- Lifetime order count (for fraud / chargeback rates) ---
    const [lifetimeOrders] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
    const lifetimeOrderCount = num(lifetimeOrders?.count)

    // --- Fraud metrics ---
    const [fraudAgg] = await db
      .select({
        open: sql<number>`count(*) filter (where ${fraudFlags.status} = 'open')`,
        chargebacks: sql<number>`count(*) filter (where ${fraudFlags.flagType} = 'high_chargeback_rate')`,
      })
      .from(fraudFlags)

    const openFraud = num(fraudAgg?.open)
    const chargebacks = num(fraudAgg?.chargebacks)
    const fraudRate =
      lifetimeOrderCount > 0 ? (openFraud / lifetimeOrderCount) * 100 : 0
    const chargebackRate =
      lifetimeOrderCount > 0 ? (chargebacks / lifetimeOrderCount) * 100 : 0

    // --- Customer satisfaction (avg seller review rating) ---
    const [reviewAgg] = await db
      .select({
        avg: sql<number>`coalesce(avg(${sellerReviews.rating}), 0)`,
        count: sql<number>`count(*)`,
      })
      .from(sellerReviews)
    const customerSatisfaction = num(reviewAgg?.avg)

    // --- Returns / RMA ---
    const [rmaAgg] = await db
      .select({
        pending: sql<number>`count(*) filter (where ${rmaRequests.status} = 'pending')`,
      })
      .from(rmaRequests)
    const pendingReturns = num(rmaAgg?.pending)

    // --- Customers ---
    const [customerAgg] = await db
      .select({
        total: sql<number>`count(*)`,
        newToday: sql<number>`count(*) filter (where ${user.createdAt} >= ${startOfDay.toISOString()})`,
      })
      .from(user)

    // --- Recent orders ---
    const recentOrders = await db
      .select({
        orderNumber: orders.orderNumber,
        amount: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(8)

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      kpis: {
        dailyRevenue,
        totalOrders,
        averageOrderValue,
        approvalRate,
        fraudRate,
        chargebackRate,
        refundRate,
        customerSatisfaction,
        // Operational metrics without a live data source yet default to 0
        avgResponseTime: 0,
        avgShippingTime: 0,
        inventoryTurnover: 0,
      },
      operations: {
        openFraudFlags: openFraud,
        pendingReturns,
        totalReviews: num(reviewAgg?.count),
        totalCustomers: num(customerAgg?.total),
        newCustomersToday: num(customerAgg?.newToday),
        lifetimeOrders: lifetimeOrderCount,
      },
      recentOrders: recentOrders.map((o) => ({
        orderNumber: o.orderNumber,
        amount: num(o.amount),
        status: o.status ?? 'pending',
      })),
    })
  } catch (error) {
    console.error('[v0] KPI query error:', error)
    return NextResponse.json(
      { message: 'Failed to compute KPIs' },
      { status: 500 }
    )
  }
}
