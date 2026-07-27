import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sellerProfiles, sellerListings, payoutRecords, orderFulfillment } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { Package, ShoppingBag, DollarSign, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SellerDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, session.user.id))
    .limit(1)

  if (!profile[0]) redirect('/seller/onboarding')

  const p = profile[0]

  const listings = await db
    .select()
    .from(sellerListings)
    .where(eq(sellerListings.sellerId, p.id))
    .orderBy(desc(sellerListings.createdAt))
    .limit(5)

  const payouts = await db
    .select()
    .from(payoutRecords)
    .where(eq(payoutRecords.sellerId, p.id))
    .orderBy(desc(payoutRecords.createdAt))
    .limit(3)

  const pendingOrders = await db
    .select()
    .from(orderFulfillment)
    .where(eq(orderFulfillment.sellerId, p.id))

  const totalListings = await db
    .select()
    .from(sellerListings)
    .where(eq(sellerListings.sellerId, p.id))

  const stats = [
    { label: 'Active Listings', value: totalListings.filter(l => l.listingStatus === 'active').length, icon: Package, href: '/seller/listings' },
    { label: 'Orders', value: pendingOrders.length, icon: ShoppingBag, href: '/seller/orders' },
    { label: 'Payouts', value: payouts.length, icon: DollarSign, href: '/seller/payouts' },
    { label: 'Rating', value: p.rating ? `${p.rating}/5` : 'N/A', icon: Clock, href: '#' },
  ]

  const isApproved = p.approvalStatus === 'approved'
  const isPending = p.approvalStatus === 'pending'

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      {/* Status banner */}
      {!isApproved && (
        <div className={`mb-6 flex items-start gap-3 rounded-xl px-4 py-3 border ${
          isPending
            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            : 'bg-destructive/10 border-destructive/30 text-destructive'
        }`}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold">
              {isPending ? 'Account Under Review' : 'Account Rejected'}
            </p>
            <p className="text-xs mt-0.5 opacity-80">
              {isPending
                ? 'Your seller account is pending admin approval. You cannot list parts until approved.'
                : `Your account was rejected. Reason: ${p.rejectionReason ?? 'No reason provided.'}`}
            </p>
            {!p.stripeOnboardingComplete && isPending && (
              <Link href="/seller/onboarding" className="text-xs underline mt-1 block">
                Complete Stripe setup
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {p.businessName}
          </h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            {p.businessType.replace('_', ' ')} &middot; {p.approvalStatus}
          </p>
        </div>
        {isApproved && (
          <Button asChild>
            <Link href="/seller/listings/new">+ New Listing</Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
          >
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-2xl font-black text-foreground">{value}</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-wide text-foreground/50">{label}</span>
          </Link>
        ))}
      </div>

      {/* Recent listings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase tracking-wide text-foreground/70">
            Recent Listings
          </h2>
          <Link href="/seller/listings" className="text-xs text-primary hover:underline font-semibold">
            View all
          </Link>
        </div>
        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-foreground/40 font-semibold">No listings yet.</p>
            {isApproved && (
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/seller/listings/new">Create your first listing</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground/50">Part</th>
                  <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Make / Model</th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground/50">Price</th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Qty</th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground/50">Status</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                    <td className="px-4 py-2.5 font-semibold text-foreground">{l.partName}</td>
                    <td className="px-4 py-2.5 text-foreground/60 hidden sm:table-cell">{l.make} {l.model}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-foreground">${l.price}</td>
                    <td className="px-4 py-2.5 text-right text-foreground/60 hidden sm:table-cell">{l.quantity}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${
                        l.listingStatus === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-muted text-foreground/50'
                      }`}>
                        {l.listingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent payouts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase tracking-wide text-foreground/70">
            Recent Payouts
          </h2>
          <Link href="/seller/payouts" className="text-xs text-primary hover:underline font-semibold">
            View all
          </Link>
        </div>
        {payouts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm text-foreground/40 font-semibold">No payouts yet.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground/50">Period</th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground/50">Net Payout</th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground/50">Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((po) => (
                  <tr key={po.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-semibold text-foreground">{po.period}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-foreground">${po.netPayout}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${
                        po.payoutStatus === 'completed' ? 'bg-green-500/15 text-green-400' :
                        po.payoutStatus === 'initiated' ? 'bg-blue-500/15 text-blue-400' :
                        'bg-muted text-foreground/50'
                      }`}>
                        {po.payoutStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
