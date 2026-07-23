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
import { Eye, Package, Truck, Check } from 'lucide-react'

const SAMPLE_ORDERS = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    date: '2024-07-20',
    total: 2599.99,
    status: 'pending',
    items: 2,
    payment: 'unpaid',
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    date: '2024-07-19',
    total: 1899.99,
    status: 'processing',
    items: 1,
    payment: 'paid',
  },
  {
    id: 'ORD-003',
    customer: 'Michael Brown',
    date: '2024-07-18',
    total: 3299.98,
    status: 'shipped',
    items: 3,
    payment: 'paid',
  },
  {
    id: 'ORD-004',
    customer: 'Emily Davis',
    date: '2024-07-17',
    total: 1299.99,
    status: 'delivered',
    items: 1,
    payment: 'paid',
  },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-600',
  processing: 'bg-blue-500/20 text-blue-600',
  shipped: 'bg-purple-500/20 text-purple-600',
  delivered: 'bg-green-500/20 text-green-600',
  cancelled: 'bg-red-500/20 text-red-600',
}

const PAYMENT_COLORS: Record<string, string> = {
  paid: 'bg-green-500/20 text-green-600',
  unpaid: 'bg-red-500/20 text-red-600',
  pending: 'bg-yellow-500/20 text-yellow-600',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(SAMPLE_ORDERS)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
          <Button size="sm">New Order</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2">Pending</p>
          <p className="text-2xl font-bold">{orders.filter((o) => o.status === 'pending').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2">Shipped</p>
          <p className="text-2xl font-bold">{orders.filter((o) => o.status === 'shipped').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2">Revenue</p>
          <p className="text-2xl font-bold">
            ${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell className="font-semibold">${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={STATUS_COLORS[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={PAYMENT_COLORS[order.payment]}>
                    {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                  )}
                  {order.status === 'processing' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                    >
                      <Truck className="h-4 w-4" />
                    </Button>
                  )}
                  {order.status === 'shipped' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
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
