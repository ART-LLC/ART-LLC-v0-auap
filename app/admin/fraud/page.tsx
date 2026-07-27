import { getOpenFraudFlags } from '@/app/actions/admin-actions'
import { FraudFlagRow } from '@/components/admin/fraud-flag-row'

export default async function AdminFraudPage() {
  const flags = await getOpenFraudFlags()

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">
        Fraud Flags
        {flags.length > 0 && (
          <span className="ml-2 text-base font-bold text-destructive">({flags.length} open)</span>
        )}
      </h1>

      {flags.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-foreground/40 font-semibold">No open fraud flags.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Type</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden md:table-cell">Description</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Risk</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Created</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flags.map((flag) => (
                <FraudFlagRow key={flag.id} flag={flag} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
