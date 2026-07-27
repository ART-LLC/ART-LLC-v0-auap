import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'

export interface KPIData {
  dailyRevenue: number
  totalOrders: number
  averageOrderValue: number
  approvalRate: number
  fraudRate: number
  chargebackRate: number
  refundRate: number
  customerSatisfaction: number
  avgResponseTime: number
  avgShippingTime: number
  inventoryTurnover: number
  topSellingCategories: { category: string; sales: number }[]
  topCustomers: { name: string; orders: number; spent: number }[]
  recentOrders: { orderNumber: string; customer: string; amount: number; status: string }[]
}

/**
 * Fetch KPI data from database
 * In production: integrate with analytics database and real-time queries
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    const tokenVerification = verifyAdminToken(token)
    
    if (!tokenVerification.valid) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'today' // today, week, month, year

    // Mock KPI data - replace with real database queries
    const kpis = generateMockKPIs(period)

    return NextResponse.json({
      success: true,
      period,
      data: kpis,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] KPI API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
      { status: 500 }
    )
  }
}

/**
 * Generate mock KPI data
 * Replace with real queries to your database
 */
function generateMockKPIs(period: string): KPIData {
  const baseMultiplier = period === 'today' ? 1 : 
                        period === 'week' ? 7 :
                        period === 'month' ? 30 : 365

  return {
    dailyRevenue: 12450.50 * baseMultiplier,
    totalOrders: Math.floor(287 * baseMultiplier),
    averageOrderValue: 433.76,
    approvalRate: 94.2 + Math.random() * 2,
    fraudRate: 2.1 - Math.random() * 0.5,
    chargebackRate: 0.8 - Math.random() * 0.2,
    refundRate: 3.5 + Math.random() * 1,
    customerSatisfaction: 4.7,
    avgResponseTime: 2.4,
    avgShippingTime: 2.8,
    inventoryTurnover: 12.5,
    topSellingCategories: [
      { category: 'Engines', sales: 2450 },
      { category: 'Transmissions', sales: 1890 },
      { category: 'Electronics', sales: 1450 },
      { category: 'Suspension', sales: 980 },
      { category: 'Doors & Windows', sales: 760 },
    ],
    topCustomers: [
      { name: 'John Mechanic Shop', orders: 45, spent: 12450 },
      { name: 'Quick Fix Garage', orders: 38, spent: 11200 },
      { name: 'Auto Repair Co', orders: 32, spent: 9800 },
      { name: 'Parts Direct LLC', orders: 28, spent: 8600 },
      { name: 'Collision Center Inc', orders: 24, spent: 7200 },
    ],
    recentOrders: [
      { orderNumber: 'AUA-2024-0001', customer: 'John Doe', amount: 2450, status: 'shipped' },
      { orderNumber: 'AUA-2024-0002', customer: 'Jane Smith', amount: 1890, status: 'processing' },
      { orderNumber: 'AUA-2024-0003', customer: 'Bob Johnson', amount: 3200, status: 'confirmed' },
      { orderNumber: 'AUA-2024-0004', customer: 'Alice Brown', amount: 1450, status: 'pending' },
      { orderNumber: 'AUA-2024-0005', customer: 'Charlie Wilson', amount: 980, status: 'shipped' },
    ],
  }
}
