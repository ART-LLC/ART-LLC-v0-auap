import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { and, eq, inArray } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { catalogProducts } from '@/lib/db/schema'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  if (process.env.ADMIN_EMAIL && session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) return null
  return session
}

export async function PATCH(request: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json()
  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown): id is string => typeof id === 'string') : []
  const mode = body.mode === 'percent' || body.mode === 'amount' ? body.mode : 'set'
  const value = Number(body.value)
  if (!ids.length || !Number.isFinite(value) || (mode === 'percent' && value < -100)) return NextResponse.json({ error: 'Choose products and enter a valid price operation.' }, { status: 400 })
  const products = await db.select({ id: catalogProducts.id, price: catalogProducts.price }).from(catalogProducts).where(inArray(catalogProducts.id, ids))
  for (const product of products) {
    const currentPrice = Number(product.price)
    const nextPrice = mode === 'percent' ? currentPrice * (1 + value / 100) : mode === 'amount' ? currentPrice + value : value
    if (!Number.isFinite(nextPrice) || nextPrice < 0) return NextResponse.json({ error: 'Price cannot be negative.' }, { status: 400 })
    await db.update(catalogProducts).set({ price: String(nextPrice), priceDisplay: `$${nextPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, updatedAt: new Date() }).where(eq(catalogProducts.id, product.id))
  }
  return NextResponse.json({ updated: products.length })
}
