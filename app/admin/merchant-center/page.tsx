'use client'

import { useState } from 'react'

export default function MerchantCenterPage() {
  const [status, setStatus] = useState<string>('Ready to sync')
  const [busy, setBusy] = useState(false)

  async function sync() {
    setBusy(true)
    setStatus('Syncing in-stock catalog products…')
    try {
      const response = await fetch('/api/admin/merchant-center/sync', { method: 'POST' })
      const result = await response.json()
      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl
        return
      }
      if (!response.ok) throw new Error(result.error)
      setStatus(`${result.synced} products synced${result.failed?.length ? `, ${result.failed.length} failed` : ''}.`)
      if (result.prerequisite) setStatus(`${result.synced} synced. ${result.prerequisite}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Sync failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Catalog operations</p>
          <h1 className="text-balance text-4xl font-bold">Google Merchant Center</h1>
          <p className="leading-6 text-muted-foreground">Sync every in-stock AUAPW catalog product to Merchant Center account 5828832429.</p>
        </header>
        <section className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Product catalog sync</h2>
            <p className="text-sm leading-6 text-muted-foreground">Products are sent server-side with USD pricing, used condition, product links, images, and US targeting.</p>
          </div>
          <button type="button" onClick={sync} disabled={busy} className="w-fit rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? 'Syncing…' : 'Sync catalog now'}
          </button>
          <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{status}</p>
        </section>
      </div>
    </main>
  )
}
