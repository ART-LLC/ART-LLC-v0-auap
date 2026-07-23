'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const SAMPLE_FLAGGED_ORDERS = [
  {
    id: 'ORD-FRD-001',
    customer: 'Unknown User',
    email: 'test@example.com',
    amount: 2599.99,
    riskScore: 85,
    riskLevel: 'high',
    flags: ['New customer', 'High-value order', 'IP mismatch'],
    timestamp: '2024-07-20 14:32',
    status: 'pending_review',
  },
  {
    id: 'ORD-FRD-002',
    customer: 'John Doe',
    email: 'john@example.com',
    amount: 1299.99,
    riskScore: 45,
    riskLevel: 'medium',
    flags: ['Unusual pattern', 'Multiple cards'],
    timestamp: '2024-07-20 13:15',
    status: 'approved',
  },
  {
    id: 'ORD-FRD-003',
    customer: 'Bot Activity',
    email: 'bot@spam.com',
    amount: 5999.98,
    riskScore: 95,
    riskLevel: 'critical',
    flags: ['Multiple rapid orders', 'Proxy detected', 'Stolen card'],
    timestamp: '2024-07-20 12:00',
    status: 'declined',
  },
]

const RISK_COLORS: Record<string, string> = {
  low: 'bg-green-500/20 text-green-600',
  medium: 'bg-yellow-500/20 text-yellow-600',
  high: 'bg-orange-500/20 text-orange-600',
  critical: 'bg-red-500/20 text-red-600',
}

export default function FraudPage() {
  const [orders, setOrders] = useState(SAMPLE_FLAGGED_ORDERS)

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    )
  }

  const highRiskCount = orders.filter(
    (o) => o.riskLevel === 'high' || o.riskLevel === 'critical'
  ).length
  const pendingReview = orders.filter((o) => o.status === 'pending_review').length
  const totalBlocked = orders.filter((o) => o.status === 'declined').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Fraud & Risk Monitoring</h2>
        <p className="text-foreground/70">Review flagged orders and manage fraud prevention</p>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            High Risk
          </p>
          <p className="text-2xl font-bold text-red-600">{highRiskCount}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingReview}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Approved
          </p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.status === 'approved').length}
          </p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-orange-500" />
            Declined
          </p>
          <p className="text-2xl font-bold text-orange-600">{totalBlocked}</p>
        </div>
      </div>

      {/* Flagged Orders Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-xs text-foreground/50">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell className="font-bold">${order.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-background rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          order.riskScore > 75
                            ? 'bg-red-500'
                            : order.riskScore > 50
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${order.riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{order.riskScore}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {order.flags.slice(0, 2).map((flag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                    {order.flags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{order.flags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground/60">{order.timestamp}</TableCell>
                <TableCell>
                  <Badge className={RISK_COLORS[order.riskLevel]}>
                    {order.riskLevel.charAt(0).toUpperCase() + order.riskLevel.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  {order.status === 'pending_review' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateOrderStatus(order.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => updateOrderStatus(order.id, 'declined')}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {order.status !== 'pending_review' && (
                    <Badge
                      className={
                        order.status === 'approved'
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-red-500/20 text-red-600'
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
