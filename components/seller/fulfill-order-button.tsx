'use client'

import { useState } from 'react'
import { fulfillOrder } from '@/app/actions/seller-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Truck } from 'lucide-react'

const CARRIERS = ['ups', 'fedex', 'usps', 'other']

export function FulfillOrderButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')

  async function handleFulfill() {
    if (!trackingNumber || !carrier) return
    setLoading(true)
    setError(null)
    try {
      const result = await fulfillOrder(orderId, { trackingNumber, carrier })
      if ('error' in result && result.error) {
        setError(result.error as string)
      } else {
        setOpen(false)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Truck className="w-3.5 h-3.5 mr-1.5" />
        Ship
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark Order as Shipped</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            {error && (
              <p className="text-sm text-destructive font-semibold">{error}</p>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carrier">Carrier</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  {CARRIERS.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                placeholder="1Z999AA10123456784"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleFulfill} disabled={loading || !trackingNumber || !carrier}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Mark Shipped
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
