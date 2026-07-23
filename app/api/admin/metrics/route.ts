import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get today's metrics
    const today = new Date().toISOString().split('T')[0]
    
    // For now, return mock data since we just created the schema
    const mockTodaysData = {
      date: today,
      total_orders: 147,
      total_revenue: 45230,
      successful_payments: 142,
      failed_payments: 5,
      refunds: 3,
      chargebacks: 0,
      high_risk_orders: 8,
      fraud_orders: 1,
      new_customers: 23,
      average_order_value: 30768,
      approval_rate: 96.6,
      fraud_rate: 0.68,
      chargeback_rate: 0,
      refund_rate: 2.04,
      avg_response_time: 2,
      avg_shipping_time: 2,
      customer_satisfaction: 4.7,
      inventory_turnover: 12.5,
    }

    // Get historical metrics (mock data for demo)
    const mockHistory = [
      { date: '2026-07-20', total_orders: 132, total_revenue: 41200, approval_rate: 95.5, fraud_rate: 1.2, chargeback_rate: 0, customer_satisfaction: 4.6 },
      { date: '2026-07-21', total_orders: 139, total_revenue: 43500, approval_rate: 96.0, fraud_rate: 0.8, chargeback_rate: 0, customer_satisfaction: 4.65 },
      { date: '2026-07-22', total_orders: 145, total_revenue: 45100, approval_rate: 96.5, fraud_rate: 0.7, chargeback_rate: 0, customer_satisfaction: 4.68 },
      { date: '2026-07-23', total_orders: 151, total_revenue: 47300, approval_rate: 97.0, fraud_rate: 0.6, chargeback_rate: 0, customer_satisfaction: 4.7 },
      { ...mockTodaysData, date: today },
    ]

    return NextResponse.json({
      today: mockTodaysData,
      history: mockHistory,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Metrics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
