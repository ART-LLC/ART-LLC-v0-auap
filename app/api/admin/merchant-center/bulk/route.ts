import { NextResponse } from 'next/server'
import { inArray } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { catalogProducts as products } from '@/lib/db/schema'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  if (
    process.env.ADMIN_EMAIL &&
    session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()
  )
    return null
  return session.user
}

const priceDisplay = (value: number) => `$${Math.round(value).toLocaleString('en-US')}`

/**
 * Bulk operations for the Merchant Center portal. A single call updates every
 * selected product so pricing, stock, and removals stay consistent across the
 * website catalog and the next Google Merchant sync.
 */
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const ids = Array.isArray(body.ids) ? body.ids.map(String).filter(Boolean) : []
  const action = String(body.action || '')
  if (!ids.length) return NextResponse.json({ error: 'Select at least one product.' }, { status: 400 })

  if (action === 'delete') {
    const removed = await db.delete(products).where(inArray(products.id, ids)).returning({ id: products.id })
    return NextResponse.json({ updated: removed.length, action })
  }

  if (action === 'stock') {
    const inStock = Boolean(body.inStock)
    const updated = await db
      .update(products)
      .set({ inStock, updatedAt: new Date() })
      .where(inArray(products.id, ids))
      .returning({ id: products.id })
    return NextResponse.json({ updated: updated.length, action })
  }

  if (action === 'price') {
    const mode = String(body.mode || 'set')
    const amount = Number(body.amount)
    if (!Number.isFinite(amount)) return NextResponse.json({ error: 'Enter a valid amount.' }, { status: 400 })
    if (mode === 'set' && amount <= 0) return NextResponse.json({ error: 'Set price must be positive.' }, { status: 400 })

    const rows = await db.select().from(products).where(inArray(products.id, ids))
    let updated = 0
    for (const row of rows) {
      const current = Number(row.price) || 0
      let next = current
      if (mode === 'set') next = amount
      else if (mode === 'increase') next = current * (1 + amount / 100)
      else if (mode === 'decrease') next = current * (1 - amount / 100)
      else if (mode === 'add') next = current + amount
      else if (mode === 'subtract') next = current - amount
      next = Math.max(1, Math.round(next))
      await db
        .update(products)
        .set({ price: String(next), priceDisplay: priceDisplay(next), updatedAt: new Date() })
        .where(inArray(products.id, [row.id]))
      updated += 1
    }
    return NextResponse.json({ updated, action, mode })
  }

  return NextResponse.json({ error: 'Unsupported bulk action.' }, { status: 400 })
}
