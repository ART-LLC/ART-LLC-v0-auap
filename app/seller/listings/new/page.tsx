import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sellerProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NewListingForm } from '@/components/seller/new-listing-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewListingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, session.user.id))
    .limit(1)

  if (!profile[0]) redirect('/seller/onboarding')
  if (profile[0].approvalStatus !== 'approved') redirect('/seller/dashboard')

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <Link
        href="/seller/listings"
        className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground font-semibold mb-6 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Back to Listings
      </Link>
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">
        New Listing
      </h1>
      <NewListingForm />
    </div>
  )
}
