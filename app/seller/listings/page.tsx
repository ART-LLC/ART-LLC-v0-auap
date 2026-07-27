import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sellerProfiles, sellerListings } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ListingActions } from '@/components/seller/listing-actions'

export default async function SellerListingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, session.user.id))
    .limit(1)

  if (!profile[0]) redirect('/seller/onboarding')

  const listings = await db
    .select()
    .from(sellerListings)
    .where(eq(sellerListings.sellerId, profile[0].id))
    .orderBy(desc(sellerListings.createdAt))

  const isApproved = profile[0].approvalStatus === 'approved'

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Listings</h1>
        {isApproved && (
          <Button asChild>
            <Link href="/seller/listings/new">+ New Listing</Link>
          </Button>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-foreground/40 font-semibold mb-3">
            {isApproved ? 'No listings yet. Create your first one.' : 'Account must be approved to create listings.'}
          </p>
          {isApproved && (
            <Button asChild variant="outline">
              <Link href="/seller/listings/new">Create Listing</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Part</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden md:table-cell">Vehicle</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden md:table-cell">Condition</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Price</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{l.partName}</p>
                    {l.sku && <p className="text-[0.65rem] text-foreground/40 mt-0.5">{l.sku}</p>}
                  </td>
                  <td className="px-4 py-3 text-foreground/60 hidden md:table-cell">
                    {l.year} {l.make} {l.model}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="capitalize text-foreground/70">{l.condition}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">${l.price}</td>
                  <td className="px-4 py-3 text-right text-foreground/60 hidden sm:table-cell">{l.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${
                      l.listingStatus === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-muted text-foreground/50'
                    }`}>
                      {l.listingStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ListingActions listingId={l.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
