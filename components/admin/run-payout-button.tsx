'use client'

import { useState } from 'react'
import { runPayoutForSeller } from '@/app/actions/admin-actions'
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
import { Loader2, DollarSign } from 'lucide-react'

export function RunPayoutButton({ sellerId }: { sellerId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handlePayout() {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) return
    setLoading(true)
    setError(null)
    try {
      const result = await runPayoutForSeller(sellerId, numAmount)
      if ('error' in result && result.error) {
        setError(result.error as string)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          setAmount('')
        }, 1500)
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
        <DollarSign className="w-3.5 h-3.5 mr-1" />
        Pay Out
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Run Payout</DialogTitle>
          </DialogHeader>
          <div className="py-2 flex flex-col gap-3">
            {error && <p className="text-sm text-destructive font-semibold">{error}</p>}
            {success && <p className="text-sm text-green-500 font-semibold">Payout initiated!</p>}
            <Label htmlFor="payout-amount">Amount (USD)</Label>
            <Input
              id="payout-amount"
              type="number"
              step="0.01"
              min="1"
              placeholder="500.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handlePayout} disabled={loading || !amount || parseFloat(amount) <= 0}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Send Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
