import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sellerProfiles, orderFulfillment, orders } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { FulfillOrderButton } from '@/components/seller/fulfill-order-button'

export default async function SellerOrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, session.user.id))
    .limit(1)

  if (!profile[0]) redirect('/seller/onboarding')

  const fulfillments = await db
    .select()
    .from(orderFulfillment)
    .where(eq(orderFulfillment.sellerId, profile[0].id))
    .orderBy(desc(orderFulfillment.createdAt))

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">Orders</h1>

      {fulfillments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-foreground/40 font-semibold">No orders yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Carrier</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden md:table-cell">Tracking</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fulfillments.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                  <td className="px-4 py-3 font-mono text-xs text-foreground/70">{f.orderId.slice(0, 12)}…</td>
                  <td className="px-4 py-3 text-foreground/60 capitalize hidden sm:table-cell">{f.carrier ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground/50 hidden md:table-cell">{f.trackingNumber ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${
                      f.fulfillmentStatus === 'delivered' ? 'bg-green-500/15 text-green-400' :
                      f.fulfillmentStatus === 'shipped' ? 'bg-blue-500/15 text-blue-400' :
                      'bg-yellow-500/15 text-yellow-400'
                    }`}>
                      {f.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {f.fulfillmentStatus === 'pending' && (
                      <FulfillOrderButton orderId={f.orderId} />
                    )}
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
