import { getAllSellers } from '@/app/actions/admin-actions'
import { db } from '@/lib/db'
import { payoutRecords } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { RunPayoutButton } from '@/components/admin/run-payout-button'

export default async function AdminPayoutsPage() {
  const sellers = await getAllSellers()
  const approvedSellers = sellers.filter(
    (s) => s.approvalStatus === 'approved' && s.stripeOnboardingComplete
  )

  const recentPayouts = await db
    .select()
    .from(payoutRecords)
    .orderBy(desc(payoutRecords.createdAt))
    .limit(50)

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">Payouts</h1>

      {/* Run payout section */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground/50 mb-4">
          Manual Payout Run
        </h2>
        {approvedSellers.length === 0 ? (
          <p className="text-sm text-foreground/40">No approved sellers with Stripe connected.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {approvedSellers.map((seller) => (
              <div key={seller.id} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-semibold text-foreground">{seller.businessName}</p>
                  <p className="text-xs text-foreground/40">{seller.contactEmail}</p>
                </div>
                <RunPayoutButton sellerId={seller.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout history */}
      <h2 className="text-sm font-black uppercase tracking-wide text-foreground/50 mb-3">
        Payout History
      </h2>
      {recentPayouts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-foreground/40 font-semibold">No payouts yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Seller ID</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Period</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Net Payout</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayouts.map((po) => (
                <tr key={po.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                  <td className="px-4 py-3 font-mono text-xs text-foreground/60">{po.sellerId.slice(0, 14)}…</td>
                  <td className="px-4 py-3 text-foreground/60 hidden sm:table-cell">{po.period}</td>
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
