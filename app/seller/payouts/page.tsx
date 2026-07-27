import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sellerProfiles, payoutRecords } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export default async function SellerPayoutsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, session.user.id))
    .limit(1)

  if (!profile[0]) redirect('/seller/onboarding')

  const payouts = await db
    .select()
    .from(payoutRecords)
    .where(eq(payoutRecords.sellerId, profile[0].id))
    .orderBy(desc(payoutRecords.createdAt))

  const totalPaid = payouts
    .filter((p) => p.payoutStatus === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.netPayout ?? '0'), 0)

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">Payouts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-1">Total Paid Out</p>
          <p className="text-2xl font-black text-foreground">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-1">Commission Rate</p>
          <p className="text-2xl font-black text-foreground">{profile[0].commissionPercent ?? 10}%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-1">Stripe Connected</p>
          <p className="text-2xl font-black text-foreground">
            {profile[0].stripeOnboardingComplete ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      {!profile[0].stripeOnboardingComplete && (
        <div className="mb-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30 px-4 py-3">
          <p className="text-sm font-bold text-yellow-400">Stripe account not connected.</p>
          <p className="text-xs text-yellow-400/80 mt-0.5">
            Complete your Stripe setup to receive payouts.
          </p>
        </div>
      )}

      {payouts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-foreground/40 font-semibold">No payouts yet.</p>
          <p className="text-xs text-foreground/30 mt-1">
            Payouts are processed after orders are fulfilled and cleared.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Period</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Sales</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Commission</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Net Payout</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((po) => (
                <tr key={po.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                  <td className="px-4 py-3 font-semibold text-foreground">{po.period}</td>
                  <td className="px-4 py-3 text-right text-foreground/60 hidden sm:table-cell">${po.totalSales}</td>
                  <td className="px-4 py-3 text-right text-foreground/60 hidden sm:table-cell">${po.commissionDue}</td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">${po.netPayout}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${
                      po.payoutStatus === 'completed' ? 'bg-green-500/15 text-green-400' :
                      po.payoutStatus === 'initiated' ? 'bg-blue-500/15 text-blue-400' :
                      'bg-yellow-500/15 text-yellow-400'
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
  )
}
