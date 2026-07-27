import { getAllOrders } from '@/app/actions/admin-actions'

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">
        Orders
        <span className="ml-2 text-base font-bold text-foreground/40">({orders.length})</span>
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-foreground/40 font-semibold">No orders yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Order #</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50 hidden sm:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Total</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Payment</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/50">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-foreground/50 text-xs hidden sm:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">${order.total}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${
                      order.paymentStatus === 'paid' ? 'bg-green-500/15 text-green-400' :
                      order.paymentStatus === 'refunded' ? 'bg-blue-500/15 text-blue-400' :
                      'bg-yellow-500/15 text-yellow-400'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wide ${
                      order.status === 'delivered' ? 'bg-green-500/15 text-green-400' :
                      order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400' :
                      order.status === 'cancelled' ? 'bg-destructive/15 text-destructive' :
                      'bg-muted text-foreground/50'
                    }`}>
                      {order.status}
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
