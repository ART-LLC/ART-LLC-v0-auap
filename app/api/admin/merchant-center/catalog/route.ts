import { NextResponse } from 'next/server'
import { asc, eq, inArray } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { catalogProducts as products } from '@/lib/db/schema'
import { getCatalogProducts } from '@/lib/catalog-source'

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

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  // Seeds the products table from static data on first read.
  await getCatalogProducts()
  const rows = await db.select().from(products).orderBy(asc(products.category), asc(products.name))
  return NextResponse.json({ products: rows })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json()
  if (!body.name || !body.category || !body.sku || Number(body.price) <= 0) return NextResponse.json({ error: 'Name, category, SKU, and a positive price are required.' }, { status: 400 })
  const [created] = await db.insert(products).values({
    id: crypto.randomUUID(), name: String(body.name).trim(), category: String(body.category).trim(), price: String(body.price),
    priceDisplay: `$${Number(body.price).toLocaleString('en-US')}`, mileage: String(body.mileage || ''), condition: String(body.condition || 'Used'), warranty: String(body.warranty || ''),
    rating: '0', reviews: 0, image: String(body.image || '/images/placeholder-product.jpg'), description: String(body.description || ''), fits: String(body.fits || ''), sku: String(body.sku).trim(), inStock: Boolean(body.inStock),
    brand: String(body.brand || 'Unknown').trim(), imageGallery: Array.isArray(body.imageGallery) ? body.imageGallery.map(String) : [],
  }).returning()
  return NextResponse.json({ product: created }, { status: 201 })
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json()
  const id = String(body.id || '')
  if (!id || !body.name || !body.category || !body.sku || Number(body.price) <= 0) {
    return NextResponse.json({ error: 'Name, category, SKU, and a positive price are required.' }, { status: 400 })
  }
  const [updated] = await db.update(products).set({
    name: String(body.name).trim(), category: String(body.category).trim(), price: String(body.price),
    priceDisplay: `$${Number(body.price).toLocaleString('en-US')}`, mileage: String(body.mileage || ''),
    condition: String(body.condition || ''), warranty: String(body.warranty || ''),
    description: String(body.description || ''), fits: String(body.fits || ''), sku: String(body.sku).trim(),
    inStock: Boolean(body.inStock), updatedAt: new Date(),
    ...(body.brand !== undefined ? { brand: String(body.brand || 'Unknown').trim() } : {}),
    ...(Array.isArray(body.imageGallery) ? { imageGallery: body.imageGallery.map(String) } : {}),
  }).where(eq(products.id, id)).returning()
  return updated ? NextResponse.json({ product: updated }) : NextResponse.json({ error: 'Product not found' }, { status: 404 })
}

// Bulk price update for multiple selected products at once.
export async function PUT(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json()
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : []
  const mode = String(body.mode || 'set')
  const value = Number(body.value)
  if (!ids.length) return NextResponse.json({ error: 'Select at least one product.' }, { status: 400 })
  if (!Number.isFinite(value)) return NextResponse.json({ error: 'Enter a valid number.' }, { status: 400 })
  if (mode === 'set' && value <= 0) return NextResponse.json({ error: 'Set price must be greater than zero.' }, { status: 400 })

  const rows = await db.select().from(products).where(inArray(products.id, ids))
  let updated = 0
  for (const row of rows) {
    const current = Number(row.price)
    let next = current
    if (mode === 'set') next = value
    else if (mode === 'increase') next = current * (1 + value / 100)
    else if (mode === 'decrease') next = current * (1 - value / 100)
    next = Math.max(0.01, Math.round(next * 100) / 100)
    await db.update(products).set({
      price: String(next), priceDisplay: `$${Number(next).toLocaleString('en-US')}`, updatedAt: new Date(),
    }).where(eq(products.id, row.id))
    updated += 1
  }
  return NextResponse.json({ updated })
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  const [deleted] = await db.delete(products).where(eq(products.id, String(id))).returning({ id: products.id })
  return deleted ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: 'Product not found' }, { status: 404 })
}
