import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { auth } from '@/lib/auth'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  if (process.env.ADMIN_EMAIL && session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) return null
  return session
}

export async function POST(request: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json()
  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown): id is string => typeof id === 'string' && id.length > 0) : []
  const action = body.action
  if (!ids.length || ids.length > 1000) return NextResponse.json({ error: 'Select between 1 and 1,000 products.' }, { status: 400 })
  if (!['price', 'stock', 'images'].includes(action)) return NextResponse.json({ error: 'Invalid bulk action.' }, { status: 400 })

  if (action === 'price') {
    const mode = body.mode
    const value = Number(body.value)
    if (!['set', 'amount', 'percent'].includes(mode) || !Number.isFinite(value)) return NextResponse.json({ error: 'Invalid price update.' }, { status: 400 })
    const rows = (await pool.query('SELECT id, price FROM catalog_products WHERE id = ANY($1)', [ids])).rows
    for (const row of rows) {
      const next = mode === 'set' ? value : mode === 'amount' ? Number(row.price) + value : Number(row.price) * (1 + value / 100)
      if (!Number.isFinite(next) || next < 0) return NextResponse.json({ error: 'Price cannot be negative.' }, { status: 400 })
      await pool.query('UPDATE catalog_products SET price=$1, "priceDisplay"=$2, "updatedAt"=now() WHERE id=$3', [next.toFixed(2), `$${next.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, row.id])
    }
    return NextResponse.json({ updated: rows.length })
  }

  if (action === 'stock') {
    const inStock = Boolean(body.inStock)
    const result = await pool.query('UPDATE catalog_products SET "inStock"=$1, "updatedAt"=now() WHERE id = ANY($2)', [inStock, ids])
    return NextResponse.json({ updated: result.rowCount ?? 0 })
  }

  const image = typeof body.image === 'string' ? body.image.trim() : ''
  if (image && !/^https?:\/\//i.test(image) && !image.startsWith('/')) return NextResponse.json({ error: 'Image must be a valid URL.' }, { status: 400 })
  const result = image
    ? await pool.query('UPDATE catalog_products SET image=$1, "imageGallery"=jsonb_build_array($1), "updatedAt"=now() WHERE id = ANY($2)', [image, ids])
    : await pool.query('UPDATE catalog_products SET image=\'\', "imageGallery"=\'[]\'::jsonb, "updatedAt"=now() WHERE id = ANY($1)', [ids])
  return NextResponse.json({ updated: result.rowCount ?? 0 })
}
