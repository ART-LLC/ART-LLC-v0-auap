'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSellerProfile, startStripeOnboarding } from '@/app/actions/seller-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2, CreditCard, CheckCircle, Loader2 } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Business Info', icon: Building2 },
  { id: 2, label: 'Stripe Payout', icon: CreditCard },
  { id: 3, label: 'Under Review', icon: CheckCircle },
]

const BUSINESS_TYPES = [
  { value: 'salvage_yard', label: 'Salvage / Junkyard' },
  { value: 'distributor', label: 'Parts Distributor' },
  { value: 'dealer', label: 'Auto Dealer' },
  { value: 'individual', label: 'Individual / Hobbyist' },
  { value: 'other', label: 'Other' },
]

type Profile = {
  approvalStatus: string | null
  stripeOnboardingComplete: boolean | null
} | null

export function SellerOnboardingWizard({ existingProfile }: { existingProfile: Profile }) {
  const router = useRouter()

  const initialStep = existingProfile
    ? existingProfile.stripeOnboardingComplete
      ? 3
      : 2
    : 1

  const [step, setStep] = useState(initialStep)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1 form state
  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    taxId: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    businessPhone: '',
    businessWebsite: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
  })

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    }
  }

  async function handleStep1() {
    setLoading(true)
    setError(null)
    try {
      const result = await createSellerProfile({
        businessName: form.businessName,
        businessType: form.businessType,
        taxId: form.taxId,
        businessAddress: form.businessAddress,
        businessCity: form.businessCity,
        businessState: form.businessState,
        businessZip: form.businessZip,
        businessPhone: form.businessPhone,
        businessWebsite: form.businessWebsite || undefined,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        description: form.description || undefined,
      })
      if ('error' in result && result.error) {
        setError(result.error as string)
      } else {
        setStep(2)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleStripeConnect() {
    setLoading(true)
    setError(null)
    try {
      const result = await startStripeOnboarding()
      if ('error' in result && result.error) {
        setError(result.error as string)
      } else if ('url' in result && result.url) {
        window.location.href = result.url
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Step indicators */}
      <div className="flex border-b border-border">
        {STEPS.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-wide uppercase transition-colors ${
              step === id
                ? 'text-primary border-b-2 border-primary'
                : step > id
                ? 'text-foreground/40'
                : 'text-foreground/30'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {error && (
          <div className="mb-5 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive font-semibold">
            {error}
          </div>
        )}

        {/* Step 1 — Business Info */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input id="businessName" placeholder="ACME Auto Parts" {...field('businessName')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select
                  value={form.businessType}
                  onValueChange={(v) => setForm((f) => ({ ...f, businessType: v }))}
                >
                  <SelectTrigger id="businessType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="taxId">Tax ID / EIN *</Label>
                <Input id="taxId" placeholder="12-3456789" {...field('taxId')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessPhone">Business Phone *</Label>
                <Input id="businessPhone" placeholder="(888) 000-0000" {...field('businessPhone')} />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="businessAddress">Street Address *</Label>
                <Input id="businessAddress" placeholder="123 Auto Blvd" {...field('businessAddress')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessCity">City *</Label>
                <Input id="businessCity" placeholder="Detroit" {...field('businessCity')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessState">State *</Label>
                <Input id="businessState" placeholder="MI" maxLength={2} {...field('businessState')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessZip">ZIP Code *</Label>
                <Input id="businessZip" placeholder="48201" {...field('businessZip')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessWebsite">Website</Label>
                <Input id="businessWebsite" placeholder="https://example.com" {...field('businessWebsite')} />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-3">
                Primary Contact
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input id="contactName" placeholder="John Smith" {...field('contactName')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input id="contactEmail" type="email" placeholder="john@example.com" {...field('contactEmail')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contactPhone">Phone *</Label>
                  <Input id="contactPhone" placeholder="(888) 000-0000" {...field('contactPhone')} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your business and the parts you sell..."
                rows={3}
                {...field('description')}
              />
            </div>

            <Button
              onClick={handleStep1}
              disabled={
                loading ||
                !form.businessName ||
                !form.businessType ||
                !form.taxId ||
                !form.businessAddress ||
                !form.businessCity ||
                !form.businessState ||
                !form.businessZip ||
                !form.businessPhone ||
                !form.contactName ||
                !form.contactEmail ||
                !form.contactPhone
              }
              className="w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Continue to Payout Setup
            </Button>
          </div>
        )}

        {/* Step 2 — Stripe Connect */}
        {step === 2 && (
          <div className="flex flex-col items-center gap-6 text-center py-4">
            <CreditCard className="w-12 h-12 text-primary" />
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">
                Connect Your Payout Account
              </h2>
              <p className="text-sm text-foreground/60 mt-2 max-w-sm">
                We use Stripe to securely process payments and send you payouts.
                This takes about 5 minutes.
              </p>
            </div>
            <div className="w-full bg-muted/30 rounded-xl p-4 text-left flex flex-col gap-2">
              {[
                'Secure bank-level encryption',
                'Direct deposits to your bank account',
                'Automatic weekly or monthly payouts',
                'Full payout history in your dashboard',
              ].map((item) => (
                <p key={item} className="text-sm text-foreground/70 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  {item}
                </p>
              ))}
            </div>
            <Button onClick={handleStripeConnect} disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Set Up Payouts with Stripe
            </Button>
          </div>
        )}

        {/* Step 3 — Under Review */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-6 text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">
                Application Submitted
              </h2>
              <p className="text-sm text-foreground/60 mt-2 max-w-sm">
                Your seller application is under review. Our team will approve
                your account within 1 business day. You&apos;ll be notified by email.
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push('/seller/dashboard')} className="w-full">
              View Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
