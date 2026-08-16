import { NextResponse } from 'next/server'
import { and, asc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { PRODUCTS_CATALOG } from '@/lib/products-catalog'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  if (process.env.ADMIN_EMAIL && session.user.email !== process.env.ADMIN_EMAIL) return null
  return session.user
}

async function seedIfEmpty() {
  const existing = await db.select({ id: products.id }).from(products).limit(1)
  if (existing.length) return
  await db.insert(products).values(PRODUCTS_CATALOG.map((product) => ({
    id: String(product.id), name: product.name, category: product.category,
    price: String(product.price), priceDisplay: product.priceDisplay, mileage: product.mileage,
    condition: product.condition, warranty: product.warranty, rating: String(product.rating),
    reviews: product.reviews, image: product.image, description: product.description,
    fits: product.fits, sku: product.sku, inStock: product.inStock,
  })))
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await seedIfEmpty()
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
  }).where(eq(products.id, id)).returning()
  return updated ? NextResponse.json({ product: updated }) : NextResponse.json({ error: 'Product not found' }, { status: 404 })
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  const [deleted] = await db.delete(products).where(eq(products.id, String(id))).returning({ id: products.id })
  return deleted ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: 'Product not found' }, { status: 404 })
}
