'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { completeStripeOnboarding } from '@/app/actions/seller-actions'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OnboardingCompletePage() {
  const router = useRouter()

  useEffect(() => {
    completeStripeOnboarding()
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <CheckCircle className="w-14 h-14 text-green-500" />
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Stripe Setup Complete
        </h1>
        <p className="text-sm text-foreground/60">
          Your payment account has been connected. Your seller profile is now
          under review and will be approved within 1 business day.
        </p>
        <Button onClick={() => router.push('/seller/dashboard')} className="w-full">
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
