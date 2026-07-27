import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sellerProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SellerSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, session.user.id))
    .limit(1)

  if (!profile[0]) redirect('/seller/onboarding')

  const p = profile[0]

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">Settings</h1>

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {/* Business Info */}
        <div className="px-5 py-4">
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50 mb-3">Business</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-foreground/40 font-semibold">Name</p>
              <p className="font-semibold text-foreground">{p.businessName}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/40 font-semibold">Type</p>
              <p className="font-semibold text-foreground capitalize">{p.businessType.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/40 font-semibold">Phone</p>
              <p className="font-semibold text-foreground">{p.businessPhone}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/40 font-semibold">Website</p>
              <p className="font-semibold text-foreground">{p.businessWebsite ?? '—'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-foreground/40 font-semibold">Address</p>
              <p className="font-semibold text-foreground">
                {p.businessAddress}, {p.businessCity}, {p.businessState} {p.businessZip}
              </p>
            </div>
          </div>
        </div>

        {/* Fee Plan */}
        <div className="px-5 py-4">
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50 mb-3">Fee Plan</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-foreground/40 font-semibold">Commission</p>
              <p className="font-semibold text-foreground">{p.commissionPercent}%</p>
            </div>
            <div>
              <p className="text-xs text-foreground/40 font-semibold">Flat Fee</p>
              <p className="font-semibold text-foreground">${p.flatTransactionFee ?? '0.00'}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/40 font-semibold">Monthly Listing</p>
              <p className="font-semibold text-foreground">${p.monthlyListingFee ?? '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="px-5 py-4">
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50 mb-3">Verification</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              { label: 'KYC', value: p.kycStatus },
              { label: 'KYB', value: p.kybStatus },
              { label: 'Account', value: p.approvalStatus },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-foreground/40 font-semibold">{label}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${
                  value === 'verified' || value === 'approved' ? 'bg-green-500/15 text-green-400' :
                  value === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                  'bg-destructive/15 text-destructive'
                }`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stripe */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-foreground/50 mb-1">Stripe Payouts</p>
            <p className="text-sm font-semibold text-foreground">
              {p.stripeOnboardingComplete ? 'Connected' : 'Not connected'}
            </p>
          </div>
          {!p.stripeOnboardingComplete && (
            <Button asChild variant="outline" size="sm">
              <Link href="/seller/onboarding">Connect</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
