'use client'

import { useEffect, useState } from 'react'
import { getPendingSellerApprovals, approveSeller, rejectSeller } from '@/app/actions/admin-actions'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface PendingSeller {
  id: string
  businessName: string
  businessType: string
  contactEmail: string
  contactName: string
  businessCity: string
  businessState: string
  kycStatus: string
  kybStatus: string
  createdAt: Date
}

export default function ApprovalsDashboard() {
  const [sellers, setSellers] = useState<PendingSeller[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSeller, setSelectedSeller] = useState<PendingSeller | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadPendingSellers()
  }, [])

  const loadPendingSellers = async () => {
    setLoading(true)
    try {
      const result = await getPendingSellerApprovals()
      if (result.success) {
        setSellers(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (sellerId: string) => {
    setActionLoading(true)
    try {
      const result = await approveSeller(sellerId)
      if (result.success) {
        setSellers((prev) => prev.filter((s) => s.id !== sellerId))
        setSelectedSeller(null)
      } else {
        alert(result.error || 'Failed to approve seller')
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (sellerId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    setActionLoading(true)
    try {
      const result = await rejectSeller(sellerId, rejectionReason)
      if (result.success) {
        setSellers((prev) => prev.filter((s) => s.id !== sellerId))
        setSelectedSeller(null)
        setRejectionReason('')
      } else {
        alert(result.error || 'Failed to reject seller')
      }
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Seller Approvals</h1>
          <p className="text-foreground/60 mt-2">
            {sellers.length} pending seller applications
          </p>
        </div>

        {sellers.length === 0 ? (
          <div className="bg-card p-8 rounded-lg border border-border text-center">
            <p className="text-foreground/60">No pending sellers to review</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Seller List */}
            <div className="lg:col-span-2 space-y-3">
              {sellers.map((seller) => (
                <div
                  key={seller.id}
                  onClick={() => setSelectedSeller(seller)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedSeller?.id === seller.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{seller.businessName}</h3>
                      <p className="text-sm text-foreground/60">{seller.contactName}</p>
                      <p className="text-sm text-foreground/60">
                        {seller.businessCity}, {seller.businessState}
                      </p>
                    </div>
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>

                  <div className="mt-3 flex gap-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded ${
                        seller.kycStatus === 'verified'
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-yellow-500/20 text-yellow-600'
                      }`}
                    >
                      KYC: {seller.kycStatus}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        seller.kybStatus === 'verified'
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-yellow-500/20 text-yellow-600'
                      }`}
                    >
                      KYB: {seller.kybStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-1">
              {selectedSeller ? (
                <div className="bg-card p-6 rounded-lg border border-border sticky top-4">
                  <h2 className="text-lg font-semibold mb-4">Details</h2>

                  <div className="space-y-4 text-sm mb-6">
                    <div>
                      <p className="text-foreground/60">Business Name</p>
                      <p className="font-medium">{selectedSeller.businessName}</p>
                    </div>

                    <div>
                      <p className="text-foreground/60">Type</p>
                      <p className="font-medium capitalize">
                        {selectedSeller.businessType.replace('_', ' ')}
                      </p>
                    </div>

                    <div>
                      <p className="text-foreground/60">Contact</p>
                      <p className="font-medium">{selectedSeller.contactName}</p>
                      <p className="text-xs">{selectedSeller.contactEmail}</p>
                    </div>

                    <div>
                      <p className="text-foreground/60">Location</p>
                      <p className="font-medium">
                        {selectedSeller.businessCity}, {selectedSeller.businessState}
                      </p>
                    </div>

                    <div>
                      <p className="text-foreground/60">Applied</p>
                      <p className="font-medium">
                        {new Date(selectedSeller.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {rejectionReason && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Rejection Reason
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                        rows={3}
                        placeholder="Explain why this application is rejected..."
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(selectedSeller.id)}
                      disabled={actionLoading || rejectionReason !== ''}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>

                    {!rejectionReason ? (
                      <button
                        onClick={() => setRejectionReason('')}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(selectedSeller.id)}
                        disabled={actionLoading}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
                      >
                        Confirm Reject
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-card p-6 rounded-lg border border-border text-center text-foreground/60">
                  Select a seller to review
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
