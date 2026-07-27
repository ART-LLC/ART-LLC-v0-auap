'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  LogOut,
  Users,
  Package,
  Clock
} from 'lucide-react'

interface KPIData {
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
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [kpis, setKpis] = useState<KPIData>({
    dailyRevenue: 12450.50,
    totalOrders: 287,
    averageOrderValue: 433.76,
    approvalRate: 94.2,
    fraudRate: 2.1,
    chargebackRate: 0.8,
    refundRate: 3.5,
    customerSatisfaction: 4.7,
    avgResponseTime: 2.4,
    avgShippingTime: 2.8,
  })

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken')
    const adminEmail = localStorage.getItem('adminEmail')

    if (!token || !adminEmail) {
      router.push('/admin/login')
      return
    }

    setIsAuthenticated(true)
    setIsLoading(false)

    // In production: fetch real KPI data from backend
    // Simulate data refresh every 30 seconds
    const interval = setInterval(() => {
      setKpis((prev) => ({
        ...prev,
        dailyRevenue: prev.dailyRevenue + Math.random() * 1000 - 500,
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 5),
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const adminEmail = localStorage.getItem('adminEmail')

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AUAPW Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Logged in as: <span className="font-semibold">{adminEmail}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-full px-6 py-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Daily Revenue */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Daily Revenue</p>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${kpis.dailyRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-green-500 mt-1">+12.5% vs yesterday</p>
          </div>

          {/* Total Orders */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.totalOrders}</p>
            <p className="text-xs text-blue-500 mt-1">+8 orders today</p>
          </div>

          {/* Average Order Value */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">AOV</p>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${kpis.averageOrderValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-purple-500 mt-1">+2.3% vs avg</p>
          </div>

          {/* Approval Rate */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.approvalRate.toFixed(1)}%</p>
            <p className="text-xs text-green-500 mt-1">Good performance</p>
          </div>

          {/* Fraud Rate */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Fraud Rate</p>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{kpis.fraudRate.toFixed(1)}%</p>
            <p className="text-xs text-orange-500 mt-1">Within limits</p>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Chargeback Rate */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm font-medium text-muted-foreground">Chargeback Rate</p>
            </div>
            <p className="text-xl font-bold text-foreground">{kpis.chargebackRate.toFixed(2)}%</p>
          </div>

          {/* Refund Rate */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              <p className="text-sm font-medium text-muted-foreground">Refund Rate</p>
            </div>
            <p className="text-xl font-bold text-foreground">{kpis.refundRate.toFixed(1)}%</p>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-cyan-500" />
              <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
            </div>
            <p className="text-xl font-bold text-foreground">{kpis.customerSatisfaction.toFixed(1)}/5.0</p>
          </div>

          {/* Avg Response Time */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <p className="text-sm font-medium text-muted-foreground">Response Time</p>
            </div>
            <p className="text-xl font-bold text-foreground">{kpis.avgResponseTime.toFixed(1)}h</p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors">
              View Pending Approvals
            </button>
            <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors">
              Manage Sellers
            </button>
            <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors">
              View Fraud Alerts
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
