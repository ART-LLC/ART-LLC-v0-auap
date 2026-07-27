'use client'

import { useState } from 'react'
import { resolveFraudFlag } from '@/app/actions/admin-actions'
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
import { CheckCircle, Loader2 } from 'lucide-react'

type FraudFlag = {
  id: string
  flagType: string
  riskScore: number
  description: string
  status: string | null
  createdAt: Date
}

export function FraudFlagRow({ flag }: { flag: FraudFlag }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resolution, setResolution] = useState('')

  async function handleResolve() {
    if (!resolution.trim()) return
    setLoading(true)
    try {
      await resolveFraudFlag(flag.id, resolution)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const riskColor =
    flag.riskScore >= 75
      ? 'text-destructive'
      : flag.riskScore >= 40
      ? 'text-yellow-400'
      : 'text-foreground/60'

  return (
    <>
      <tr className="border-b border-border last:border-0 hover:bg-muted/10">
        <td className="px-4 py-3">
          <p className="font-semibold text-foreground text-xs capitalize">
            {flag.flagType.replace(/_/g, ' ')}
          </p>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <p className="text-foreground/60 text-xs line-clamp-1">{flag.description}</p>
        </td>
        <td className="px-4 py-3 text-right">
          <span className={`font-black text-lg ${riskColor}`}>{flag.riskScore}</span>
          <span className="text-foreground/30 text-xs">/100</span>
        </td>
        <td className="px-4 py-3 text-right text-foreground/40 text-xs hidden sm:table-cell">
          {new Date(flag.createdAt).toLocaleDateString()}
        </td>
        <td className="px-4 py-3 text-right">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setResolution(''); setOpen(true) }}
            className="text-green-500 hover:text-green-500 hover:bg-green-500/10"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
        </td>
      </tr>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Resolve Fraud Flag</DialogTitle>
          </DialogHeader>
          <div className="py-2 flex flex-col gap-3">
            <div className="text-xs text-foreground/60 bg-muted/20 rounded-lg p-3">
              <p className="font-bold capitalize mb-1">{flag.flagType.replace(/_/g, ' ')}</p>
              <p>{flag.description}</p>
            </div>
            <Label htmlFor="resolution">Resolution Notes *</Label>
            <Textarea
              id="resolution"
              placeholder="Describe how this was resolved..."
              rows={3}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleResolve} disabled={loading || !resolution.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
