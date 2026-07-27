import { getAllSellers } from '@/app/actions/admin-actions'
import { SellerApprovalRow } from '@/components/admin/seller-approval-row'

export default async function AdminSellersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const params = await searchParams
  const sellers = await getAllSellers()

  const filtered =
    params.filter === 'pending'
      ? sellers.filter((s) => s.approvalStatus === 'pending')
      : sellers

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Sellers</h1>
        <div className="flex gap-2 text-xs font-bold">
          <a
            href="/admin/sellers"
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              !params.filter ? 'bg-primary/15 border-primary/30 text-primary' : 'border-border text-foreground/50 hover:text-foreground'
            }`}
          >
            All ({sellers.length})
          </a>
          <a
            href="/admin/sellers?filter=pending"
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              params.filter === 'pending' ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' : 'border-border text-foreground/50 hover:text-foreground'
            }`}
          >
            Pending ({sellers.filter((s) => s.approvalStatus === 'pending').length})
          </a>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-foreground/40 font-semibold">No sellers found.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Business</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Type</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">KYB</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((seller) => (
                <SellerApprovalRow key={seller.id} seller={seller} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
