'use client'

import { useState } from 'react'
import { approveSeller, rejectSeller, suspendSeller } from '@/app/actions/admin-actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Ban, Loader2, ExternalLink } from 'lucide-react'

type Seller = {
  id: string
  businessName: string
  businessType: string
  contactName: string
  contactEmail: string
  kybStatus: string | null
  approvalStatus: string | null
  rejectionReason: string | null
  stripeOnboardingComplete: boolean | null
  createdAt: Date
}

export function SellerApprovalRow({ seller }: { seller: Seller }) {
  const [loading, setLoading] = useState<'approve' | 'reject' | 'suspend' | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [reason, setReason] = useState('')

  async function handleApprove() {
    setLoading('approve')
    try {
      await approveSeller(seller.id)
    } finally {
      setLoading(null)
    }
  }

  async function handleReject() {
    if (!reason.trim()) return
    setLoading('reject')
    try {
      await rejectSeller(seller.id, reason)
      setRejectOpen(false)
    } finally {
      setLoading(null)
    }
  }

  async function handleSuspend() {
    if (!reason.trim()) return
    setLoading('suspend')
    try {
      await suspendSeller(seller.id, reason)
      setSuspendOpen(false)
    } finally {
      setLoading(null)
    }
  }

  const statusColor =
    seller.approvalStatus === 'approved'
      ? 'bg-green-500/15 text-green-400'
      : seller.approvalStatus === 'pending'
      ? 'bg-yellow-500/15 text-yellow-400'
      : 'bg-destructive/15 text-destructive'

  return (
    <>
      <tr className="border-b border-border last:border-0 hover:bg-muted/10">
        <td className="px-4 py-3">
          <p className="font-semibold text-foreground">{seller.businessName}</p>
          <p className="text-[0.65rem] text-foreground/40 mt-0.5">
            {new Date(seller.createdAt).toLocaleDateString()}
          </p>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <p className="text-foreground/70 text-xs">{seller.contactName}</p>
          <p className="text-foreground/40 text-[0.65rem]">{seller.contactEmail}</p>
        </td>
        <td className="px-4 py-3 hidden sm:table-cell">
          <span className="capitalize text-foreground/60 text-xs">{seller.businessType.replace('_', ' ')}</span>
        </td>
        <td className="px-4 py-3 text-right">
          <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${
            seller.kybStatus === 'verified' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
          }`}>
            {seller.kybStatus}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${statusColor}`}>
            {seller.approvalStatus}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            {seller.approvalStatus === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleApprove}
                  disabled={loading !== null}
                  className="text-green-500 hover:text-green-500 hover:bg-green-500/10"
                  title="Approve"
                >
                  {loading === 'approve' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setReason(''); setRejectOpen(true) }}
                  disabled={loading !== null}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Reject"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            )}
            {seller.approvalStatus === 'approved' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setReason(''); setSuspendOpen(true) }}
                disabled={loading !== null}
                className="text-yellow-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                title="Suspend"
              >
                <Ban className="w-4 h-4" />
              </Button>
            )}
          </div>
        </td>
      </tr>

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject Seller Application</DialogTitle>
          </DialogHeader>
          <div className="py-2 flex flex-col gap-3">
            <Label htmlFor="reject-reason">Reason for Rejection *</Label>
            <Textarea
              id="reject-reason"
              placeholder="Please explain why this application is being rejected..."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={loading !== null}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={loading !== null || !reason.trim()}
            >
              {loading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend dialog */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Suspend Seller</DialogTitle>
          </DialogHeader>
          <div className="py-2 flex flex-col gap-3">
            <Label htmlFor="suspend-reason">Reason for Suspension *</Label>
            <Textarea
              id="suspend-reason"
              placeholder="Please explain why this seller is being suspended..."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendOpen(false)} disabled={loading !== null}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={loading !== null || !reason.trim()}
            >
              {loading === 'suspend' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
