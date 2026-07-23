'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

interface DailyMetrics {
  date: string
  total_orders: number
  total_revenue: number
  approval_rate: number
  fraud_rate: number
  chargeback_rate: number
  customer_satisfaction: number
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DailyMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [todaysData, setTodaysData] = useState<any>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/admin/metrics')
        const data = await res.json()
        setMetrics(data.history || [])
        setTodaysData(data.today)
      } catch (error) {
        console.error('[v0] Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const kpis = [
    {
      label: 'Daily Revenue',
      value: todaysData?.total_revenue ? `$${(todaysData.total_revenue / 100).toFixed(2)}` : '$0.00',
      change: '+12%',
    },
    {
      label: 'Orders',
      value: todaysData?.total_orders || 0,
      change: '+5%',
    },
    {
      label: 'Avg Order Value',
      value: todaysData?.average_order_value ? `$${(todaysData.average_order_value / 100).toFixed(2)}` : '$0.00',
      change: '+3%',
    },
    {
      label: 'Approval Rate',
      value: `${todaysData?.approval_rate || 100}%`,
      change: 'Stable',
    },
    {
      label: 'Fraud Rate',
      value: `${todaysData?.fraud_rate || 0}%`,
      change: '-2%',
    },
    {
      label: 'Chargeback Rate',
      value: `${todaysData?.chargeback_rate || 0}%`,
      change: 'Stable',
    },
    {
      label: 'Refund Rate',
      value: `${todaysData?.refund_rate || 0}%`,
      change: '-1%',
    },
    {
      label: 'Customer Satisfaction',
      value: `${todaysData?.customer_satisfaction || 0}%`,
      change: '+2%',
    },
  ]

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-[58px] flex items-center justify-center">
          <div className="text-foreground/70">Loading admin dashboard...</div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[58px]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Operations Dashboard</h1>
            <p className="text-foreground/70">Real-time KPIs and business metrics</p>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground/70">{kpi.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-2">{kpi.value}</div>
                  <p className="text-xs text-green-600">{kpi.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts & Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="fraud">Fraud & Risk</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {metrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis dataKey="date" stroke="#808080" />
                          <YAxis stroke="#808080" />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="total_revenue" stroke="#10b981" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-foreground/50 text-center py-8">No data available</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Orders Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {metrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis dataKey="date" stroke="#808080" />
                          <YAxis stroke="#808080" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="total_orders" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-foreground/50 text-center py-8">No data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="mt-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Payment Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {metrics.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={metrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                        <XAxis dataKey="date" stroke="#808080" />
                        <YAxis stroke="#808080" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="successful_payments" fill="#10b981" />
                        <Bar dataKey="failed_payments" fill="#ef4444" />
                        <Bar dataKey="refunds" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-foreground/50 text-center py-8">No data available</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fraud & Risk Tab */}
            <TabsContent value="fraud" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Fraud Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {metrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis dataKey="date" stroke="#808080" />
                          <YAxis stroke="#808080" />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="fraud_rate" stroke="#ef4444" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-foreground/50 text-center py-8">No data available</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Chargeback Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {metrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis dataKey="date" stroke="#808080" />
                          <YAxis stroke="#808080" />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="chargeback_rate" stroke="#f59e0b" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-foreground/50 text-center py-8">No data available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Operations Tab */}
            <TabsContent value="operations" className="mt-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Operational Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  {metrics.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={metrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                        <XAxis dataKey="date" stroke="#808080" />
                        <YAxis stroke="#808080" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="customer_satisfaction" stroke="#8b5cf6" />
                        <Line type="monotone" dataKey="approval_rate" stroke="#06b6d4" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-foreground/50 text-center py-8">No data available</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}
