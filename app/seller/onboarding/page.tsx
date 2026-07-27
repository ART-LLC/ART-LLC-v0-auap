'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSellerProfile } from '@/app/actions/seller-actions'
import { initializeStripeConnect } from '@/app/actions/stripe-actions'

export default function SellerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'salvage_yard',
    ein: '',
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
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await createSellerProfile(formData)

      if (result.error) {
        setError(result.error)
        return
      }

      setSuccess('Profile created! Moving to Stripe setup...')
      // Store seller ID and move to next step
      localStorage.setItem('sellerId', result.data.id)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  const handleStripeSetup = async () => {
    setError('')
    setLoading(true)

    try {
      const sellerId = localStorage.getItem('sellerId')
      if (!sellerId) {
        setError('Seller ID not found')
        return
      }

      const result = await initializeStripeConnect(sellerId)

      if (result.error) {
        setError(result.error)
        return
      }

      setSuccess('Stripe account created! Redirecting to onboarding...')
      // In a real app, we'd get the onboarding URL and redirect
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup Stripe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Become a Seller</h1>

        {/* Progress indicator */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded ${
                s <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded text-green-600">
            {success}
          </div>
        )}

        {/* Step 1: Business Information */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Business Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  >
                    <option value="salvage_yard">Salvage Yard</option>
                    <option value="distributor">Distributor</option>
                    <option value="individual">Individual Seller</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    EIN (Employer ID) *
                  </label>
                  <input
                    type="text"
                    name="ein"
                    value={formData.ein}
                    onChange={handleInputChange}
                    placeholder="XX-XXXXXXX"
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tax ID *
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="businessCity"
                    value={formData.businessCity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    name="businessState"
                    value={formData.businessState}
                    onChange={handleInputChange}
                    placeholder="NY"
                    maxLength={2}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ZIP *</label>
                  <input
                    type="text"
                    name="businessZip"
                    value={formData.businessZip}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    name="businessWebsite"
                    value={formData.businessWebsite}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Continue to Stripe Setup'}
            </button>
          </form>
        )}

        {/* Step 2: Stripe Setup */}
        {step === 2 && (
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Payment Processing Setup</h2>
            <p className="text-foreground/70 mb-6">
              We use Stripe Connect to securely handle payments and payouts. Click below to complete your payment setup.
            </p>

            <button
              onClick={handleStripeSetup}
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-white rounded disabled:opacity-50 font-medium"
            >
              {loading ? 'Setting Up Stripe...' : 'Setup Stripe Connect'}
            </button>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Onboarding Complete!</h2>
            <p className="text-foreground/70 mb-6">
              Your seller account is being reviewed. You&apos;ll receive an email once it&apos;s approved.
            </p>

            <button
              onClick={() => router.push('/seller/dashboard')}
              className="w-full px-4 py-3 bg-primary text-white rounded font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
