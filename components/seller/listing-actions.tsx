'use client'

import { useState } from 'react'
import { deleteListing } from '@/app/actions/seller-actions'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'

export function ListingActions({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Deactivate this listing?')) return
    setLoading(true)
    try {
      await deleteListing(listingId)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </Button>
  )
}
