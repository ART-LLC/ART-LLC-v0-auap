'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  Wallet,
  Landmark,
  Link2,
  Phone,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  Star,
  Pencil,
  KeyRound,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type GatewayType = 'card' | 'wallet' | 'bank' | 'link' | 'offline'

interface GatewayConfig {
  apiKey?: string
  merchantId?: string
  environment?: 'sandbox' | 'production'
  paymentLinkUrl?: string
  instructions?: string
  hasApiSecret?: boolean
}

interface Gateway {
  id: string
  name: string
  slug: string
  type: GatewayType
  description: string | null
  logo: string | null
  isEnabled: boolean
  isDefault: boolean
  sortOrder: number
  config: GatewayConfig
}

const TYPE_ICON: Record<GatewayType, typeof CreditCard> = {
  card: CreditCard,
  wallet: Wallet,
  bank: Landmark,
  link: Link2,
  offline: Phone,
}

const TYPE_LABEL: Record<GatewayType, string> = {
  card: 'Card Gateway',
  wallet: 'Digital Wallet',
  bank: 'Bank / Wire Transfer',
  link: 'Payment Link / EPS',
  offline: 'Offline / Manual',
}

const EXAMPLES: Record<GatewayType, string> = {
  card: 'e.g. Authorize.Net, Stripe, Square',
  wallet: 'e.g. PayPal, Google Pay, Apple Pay, Venmo',
  bank: 'e.g. Wire Transfer, ACH, Zelle',
  link: 'e.g. Stripe Payment Link, PayPal.me, EPS hosted checkout',
  offline: 'e.g. Pay by Phone, Cash on Pickup',
}

const EMPTY_FORM = {
  name: '',
  slug: '',
  type: 'card' as GatewayType,
  description: '',
  isEnabled: true,
  apiKey: '',
  apiSecret: '',
  merchantId: '',
  environment: 'sandbox' as 'sandbox' | 'production',
  paymentLinkUrl: '',
  instructions: '',
}

export function PaymentGatewaysClient() {
  const router = useRouter()
  const [gateways, setGateways] = useState<Gateway[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [hadApiSecret, setHadApiSecret] = useState(false)
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

  const openAddDialog = () => {
    setEditingId(null)
    setHadApiSecret(false)
    setForm(EMPTY_FORM)
    setError(null)
    setDialogOpen(true)
  }

  const openEditDialog = (gateway: Gateway) => {
    setEditingId(gateway.id)
    setHadApiSecret(Boolean(gateway.config?.hasApiSecret))
    setForm({
      name: gateway.name,
      slug: gateway.slug,
      type: gateway.type,
      description: gateway.description ?? '',
      isEnabled: gateway.isEnabled,
      apiKey: gateway.config?.apiKey ?? '',
      apiSecret: '',
      merchantId: gateway.config?.merchantId ?? '',
      environment: gateway.config?.environment ?? 'sandbox',
      paymentLinkUrl: gateway.config?.paymentLinkUrl ?? '',
      instructions: gateway.config?.instructions ?? '',
    })
    setError(null)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      setError('Name and slug are required.')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch(
        editingId ? `/api/payment-gateways/${editingId}` : '/api/payment-gateways',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to save payment gateway.')
        return
      }
      setDialogOpen(false)
      setForm(EMPTY_FORM)
      setEditingId(null)
      await loadGateways()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const needsCredentials = form.type === 'card' || form.type === 'wallet'
  const needsPaymentLink = form.type === 'link'
  const needsInstructions = form.type === 'bank' || form.type === 'offline' || form.type === 'link'

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Payment Methods &amp; Gateways
          </h1>
          <p className="text-sm text-muted-foreground">
            Enable the gateways customers see at checkout, choose a default provider, and
            configure each one&apos;s API keys or payment link
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
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
            const configured =
              Boolean(gateway.config?.apiKey) ||
              Boolean(gateway.config?.hasApiSecret) ||
              Boolean(gateway.config?.paymentLinkUrl)
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
                        {TYPE_LABEL[gateway.type] ?? gateway.type}
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

                {configured ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {gateway.config?.paymentLinkUrl ? 'Payment link configured' : 'API credentials configured'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <KeyRound className="w-3.5 h-3.5" />
                    No API key, secret, or link set yet
                  </span>
                )}

                <div className="flex gap-2 mt-auto pt-2">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEditDialog(gateway)}>
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
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
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Payment Gateway' : 'Add Payment Gateway'}</DialogTitle>
            <DialogDescription>
              Configure how this method appears at checkout and, if needed, its API
              credentials or hosted payment link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="space-y-1.5">
              <Label htmlFor="gw-name">Display name</Label>
              <Input
                id="gw-name"
                placeholder="e.g. Authorize.Net"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gw-slug">Slug</Label>
              <Input
                id="gw-slug"
                placeholder="e.g. authorize_net"
                value={form.slug}
                disabled={Boolean(editingId)}
                onChange={(e) =>
                  setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gw-type">Method type</Label>
              <Select
                value={form.type}
                onValueChange={(value: GatewayType) => setForm({ ...form, type: value })}
              >
                <SelectTrigger id="gw-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TYPE_LABEL) as GatewayType[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABEL[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{EXAMPLES[form.type]}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gw-description">Customer-facing description</Label>
              <Textarea
                id="gw-description"
                placeholder="Shown to shoppers at checkout (optional)"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {needsCredentials && (
              <div className="space-y-3 rounded-lg border border-border p-3">
                <p className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  API Credentials
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="gw-apikey">API Login ID / Publishable Key</Label>
                    <Input
                      id="gw-apikey"
                      placeholder="e.g. API Login ID or pk_live_…"
                      value={form.apiKey}
                      onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gw-apisecret">Transaction Key / Secret Key</Label>
                    <Input
                      id="gw-apisecret"
                      type="password"
                      placeholder={hadApiSecret ? 'Unchanged (leave blank to keep)' : 'e.g. sk_live_… or Transaction Key'}
                      value={form.apiSecret}
                      onChange={(e) => setForm({ ...form, apiSecret: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gw-merchantid">Merchant / Client ID</Label>
                    <Input
                      id="gw-merchantid"
                      placeholder="Optional"
                      value={form.merchantId}
                      onChange={(e) => setForm({ ...form, merchantId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gw-env">Environment</Label>
                    <Select
                      value={form.environment}
                      onValueChange={(value: 'sandbox' | 'production') =>
                        setForm({ ...form, environment: value })
                      }
                    >
                      <SelectTrigger id="gw-env">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox / Test</SelectItem>
                        <SelectItem value="production">Production / Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {needsPaymentLink && (
              <div className="space-y-1.5">
                <Label htmlFor="gw-link">Hosted payment link URL</Label>
                <Input
                  id="gw-link"
                  placeholder="e.g. https://pay.example.com/your-store or a PayPal.me link"
                  value={form.paymentLinkUrl}
                  onChange={(e) => setForm({ ...form, paymentLinkUrl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Customers are sent to this link to complete payment (EPS pages, Stripe
                  Payment Links, PayPal.me, etc.).
                </p>
              </div>
            )}

            {needsInstructions && (
              <div className="space-y-1.5">
                <Label htmlFor="gw-instructions">Customer instructions</Label>
                <Textarea
                  id="gw-instructions"
                  placeholder="e.g. wire/bank transfer details, or what happens after checkout"
                  rows={3}
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                />
              </div>
            )}

            <p className="text-xs text-muted-foreground border-t border-border pt-3">
              Secret keys are never redisplayed after saving — leave the secret field blank
              when editing to keep the existing value. For production use, prefer gateway
              credentials that support IP allow-listing or restricted/limited-scope keys.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Gateway'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
