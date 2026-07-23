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
import { MessageSquare, Clock, CheckCircle } from 'lucide-react'

const SAMPLE_TICKETS = [
  {
    id: 'TKT-001',
    number: '#1001',
    customer: 'John Smith',
    subject: 'Engine not starting after installation',
    category: 'Product Defect',
    priority: 'high',
    status: 'open',
    created: '2024-07-20 09:30',
    lastResponse: '2 hours ago',
    responseTime: 120,
  },
  {
    id: 'TKT-002',
    number: '#1002',
    customer: 'Sarah Johnson',
    subject: 'Request return for transmission',
    category: 'Return Request',
    priority: 'medium',
    status: 'in_progress',
    created: '2024-07-19 14:15',
    lastResponse: '4 hours ago',
    responseTime: 45,
  },
  {
    id: 'TKT-003',
    number: '#1003',
    customer: 'Michael Brown',
    subject: 'Warranty claim for alternator',
    category: 'Warranty Claim',
    priority: 'high',
    status: 'resolved',
    created: '2024-07-18 11:00',
    lastResponse: '1 day ago',
    responseTime: 180,
  },
]

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-blue-500/20 text-blue-600',
  medium: 'bg-yellow-500/20 text-yellow-600',
  high: 'bg-red-500/20 text-red-600',
  urgent: 'bg-orange-500/20 text-orange-600',
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-yellow-500/20 text-yellow-600',
  in_progress: 'bg-blue-500/20 text-blue-600',
  resolved: 'bg-green-500/20 text-green-600',
  closed: 'bg-gray-500/20 text-gray-600',
}

export default function SupportPage() {
  const [tickets, setTickets] = useState(SAMPLE_TICKETS)

  const avgResponseTime =
    tickets.reduce((sum, t) => sum + t.responseTime, 0) / tickets.length
  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress')
    .length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Support Tickets</h2>
        <p className="text-foreground/70">Manage customer support requests</p>
      </div>

      {/* Support Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Total Tickets
          </p>
          <p className="text-2xl font-bold">{tickets.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            Open
          </p>
          <p className="text-2xl font-bold text-yellow-600">{openTickets}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Resolved
          </p>
          <p className="text-2xl font-bold text-green-600">
            {tickets.filter((t) => t.status === 'resolved').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2">Avg Response Time</p>
          <p className="text-2xl font-bold">{avgResponseTime.toFixed(0)} min</p>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono text-sm">{ticket.number}</TableCell>
                <TableCell>{ticket.customer}</TableCell>
                <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                <TableCell className="text-sm">{ticket.category}</TableCell>
                <TableCell>
                  <Badge className={PRIORITY_COLORS[ticket.priority]}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_COLORS[ticket.status]}>
                    {ticket.status.replace('_', ' ').charAt(0).toUpperCase() +
                      ticket.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-foreground/60">{ticket.created}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
