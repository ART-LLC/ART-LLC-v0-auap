'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'

type Product = {
  id: string; name: string; category: string; price: string; sku: string; inStock: boolean
  mileage: string; condition: string; warranty: string; description: string; fits: string
  updatedAt: string
}

const emptyForm = { id: '', name: '', category: 'Engines', price: '', sku: '', inStock: true, mileage: '', condition: 'Used', warranty: '', description: '', fits: '' }

export default function MerchantCenterPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('Loading catalog…')
  const [busy, setBusy] = useState(false)
  const [query, setQuery] = useState('')

  async function load() {
    const response = await fetch('/api/admin/merchant-center/catalog')
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Unable to load catalog')
    setProducts(result.products)
    setStatus(`${result.products.length} products in portal catalog`)
  }

  useEffect(() => { load().catch((error) => setStatus(error.message)) }, [])

  const filtered = useMemo(() => products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query])

  function edit(product: Product) { setForm({ ...emptyForm, ...product, price: String(product.price) }) }

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true)
    try {
      const response = await fetch('/api/admin/merchant-center/catalog', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const result = await response.json(); if (!response.ok) throw new Error(result.error)
      await load(); setForm(emptyForm); setStatus(`Saved ${result.product.name}. Website catalog is updated.`)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Save failed') } finally { setBusy(false) }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This removes it from the portal catalog and the next Google sync.`)) return
    setBusy(true)
    try {
      const response = await fetch('/api/admin/merchant-center/catalog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      const result = await response.json(); if (!response.ok) throw new Error(result.error)
      await load(); setStatus(`Deleted ${name}. Run sync to remove it from Google Merchant Center.`)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Delete failed') } finally { setBusy(false) }
  }

  async function sync() {
    setBusy(true); setStatus('Reconciling portal catalog with Google Merchant Center…')
    try {
      const response = await fetch('/api/admin/merchant-center/sync', { method: 'POST' }); const result = await response.json()
      if (result.authorizationUrl) { setStatus('Authorize Google in the new tab, then sync again.'); window.open(result.authorizationUrl, '_blank', 'noopener,noreferrer'); return }
      if (!response.ok) throw new Error(result.error)
      setStatus(`${result.synced} products synced${result.failed?.length ? `, ${result.failed.length} failed` : ''}.`)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Sync failed') } finally { setBusy(false) }
  }

  const input = (key: keyof typeof emptyForm, label: string, type = 'text') => <label className="flex flex-col gap-1 text-sm"><span className="text-muted-foreground">{label}</span><input required={['name', 'price', 'sku'].includes(key)} type={type} value={String(form[key])} onChange={(event) => setForm({ ...form, [key]: type === 'checkbox' ? event.target.checked : event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" /></label>

  return <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-8">
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Catalog operations</p><h1 className="mt-2 text-balance text-4xl font-bold">Merchant Center portal</h1><p className="mt-2 max-w-2xl leading-6 text-muted-foreground">Manage the full website catalog, canonical parts URLs, and Google Merchant Center account 5828832429 from one source of truth.</p></div><button type="button" onClick={sync} disabled={busy} className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? 'Working…' : 'Sync catalog to Google'}</button></header>
    <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{status}</p>
    <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={save} className="flex h-fit flex-col gap-4 rounded-lg border border-border bg-card p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{form.id ? 'Edit product' : 'Select a product'}</h2>{form.id && <button type="button" onClick={() => setForm(emptyForm)} className="text-xs text-muted-foreground underline">Cancel</button>}</div>{input('name', 'Product name')}{input('category', 'Category')}{input('price', 'Price', 'number')}{input('sku', 'SKU')}{input('mileage', 'Mileage')}{input('condition', 'Condition')}{input('warranty', 'Warranty')}{input('fits', 'Fits')}{input('description', 'Description')}<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.inStock} onChange={(event) => setForm({ ...form, inStock: event.target.checked })} /> In stock / publishable</label><button disabled={busy || !form.id} className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">Save product changes</button></form>
      <div className="flex flex-col gap-4"><input aria-label="Search catalog" placeholder="Search by product, SKU, or category" value={query} onChange={(event) => setQuery(event.target.value)} className="rounded-md border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" /><div className="overflow-x-auto rounded-lg border border-border bg-card"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-4">Product</th><th className="p-4">SKU</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id} className="border-b border-border last:border-0"><td className="p-4"><div className="font-semibold">{product.name}</div><div className="mt-1 text-xs text-muted-foreground">/parts/{product.category.toLowerCase()}/{product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}</div></td><td className="p-4 font-mono text-xs">{product.sku}</td><td className="p-4">${Number(product.price).toLocaleString()}</td><td className="p-4"><span className={product.inStock ? 'text-emerald-500' : 'text-muted-foreground'}>{product.inStock ? 'In stock' : 'Out of stock'}</span></td><td className="p-4"><div className="flex gap-3"><button type="button" onClick={() => edit(product)} className="text-primary underline">Edit</button><button type="button" onClick={() => remove(product.id, product.name)} className="text-destructive underline">Delete</button></div></td></tr>)}</tbody></table></div></div>
    </section>
  </div></main>
}
