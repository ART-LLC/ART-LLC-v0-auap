import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sellerProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { SellerOnboardingWizard } from '@/components/seller/onboarding-wizard'

export default async function SellerOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ refresh?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, session.user.id))
    .limit(1)

  const params = await searchParams

  // If profile exists and approved, send to dashboard
  if (profile[0]?.approvalStatus === 'approved' && !params.refresh) {
    redirect('/seller/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Become a Seller on AUAPW
          </h1>
          <p className="text-sm text-foreground/60 mt-2">
            List your inventory and reach thousands of buyers nationwide.
          </p>
        </div>
        <SellerOnboardingWizard existingProfile={profile[0] ?? null} />
      </div>
    </div>
  )
}
