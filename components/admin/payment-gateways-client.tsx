'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  Wallet,
  Landmark,
  Phone,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
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

interface Gateway {
  id: string
  name: string
  slug: string
  type: 'card' | 'wallet' | 'bank' | 'offline'
  description: string | null
  logo: string | null
  isEnabled: boolean
  isDefault: boolean
  sortOrder: number
}

const TYPE_ICON: Record<Gateway['type'], typeof CreditCard> = {
  card: CreditCard,
  wallet: Wallet,
  bank: Landmark,
  offline: Phone,
}

const EMPTY_FORM = {
  name: '',
  slug: '',
  type: 'card' as Gateway['type'],
  description: '',
  isEnabled: true,
}

export function PaymentGatewaysClient() {
  const router = useRouter()
  const [gateways, setGateways] = useState<Gateway[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadGateways = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/payment-gateways', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setGateways(data.gateways ?? [])
    } catch {
      setError('Failed to load payment gateways.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGateways()
  }, [])

  const toggleEnabled = async (gateway: Gateway) => {
    await fetch(`/api/payment-gateways/${gateway.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isEnabled: !gateway.isEnabled }),
    })
    await loadGateways()
  }

  const makeDefault = async (gateway: Gateway) => {
    await fetch(`/api/payment-gateways/${gateway.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isDefault: true }),
    })
    await loadGateways()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this payment gateway?')) return
    await fetch(`/api/payment-gateways/${id}`, { method: 'DELETE', credentials: 'include' })
    await loadGateways()
  }

  const handleCreate = async () => {
    if (!form.name || !form.slug) {
      setError('Name and slug are required.')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/payment-gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to add payment gateway.')
        return
      }
      setDialogOpen(false)
      setForm(EMPTY_FORM)
      await loadGateways()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Payment Methods &amp; Gateways
          </h1>
          <p className="text-sm text-muted-foreground">
            Enable the gateways customers see at checkout and choose a default provider
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(EMPTY_FORM)
            setError(null)
            setDialogOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Gateway
        </Button>
      </div>

      {error && !dialogOpen && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading payment gateways…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gateways.map((gateway) => {
            const Icon = TYPE_ICON[gateway.type] ?? CreditCard
            return (
              <div
                key={gateway.id}
                className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{gateway.name}</p>
                        {gateway.isDefault && (
                          <Badge className="gap-1">
                            <Star className="w-3 h-3" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {gateway.type}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={gateway.isEnabled}
                    onCheckedChange={() => toggleEnabled(gateway)}
                    aria-label={`Toggle ${gateway.name}`}
                  />
                </div>

                {gateway.description && (
                  <p className="text-sm text-muted-foreground">{gateway.description}</p>
                )}

                <div className="flex gap-2 mt-auto pt-2">
                  {!gateway.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5"
                      onClick={() => makeDefault(gateway)}
                      disabled={!gateway.isEnabled}
                    >
                      <Star className="w-3.5 h-3.5" />
                      Make Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(gateway.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Gateway</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Input
              placeholder="Display name (e.g. Square)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Slug (e.g. square)"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') })
              }
            />
            <Select
              value={form.type}
              onValueChange={(value: Gateway['type']) => setForm({ ...form, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card Gateway</SelectItem>
                <SelectItem value="wallet">Digital Wallet</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="offline">Offline / Manual</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Description shown to customers (optional)"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              API keys and secrets for live gateways are configured via environment
              variables, never stored here.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSaving}>
              {isSaving ? 'Adding…' : 'Add Gateway'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
