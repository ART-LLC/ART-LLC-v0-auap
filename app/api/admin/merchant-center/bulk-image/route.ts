import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { eq, inArray } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { catalogProducts } from '@/lib/db/schema'

async function allowed() {
  const session = await auth.api.getSession({ headers: await headers() })
  return Boolean(session?.user && (!process.env.ADMIN_EMAIL || session.user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()))
}

export async function PATCH(request: Request) {
  if (!await allowed()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { ids, image } = await request.json()
  if (!Array.isArray(ids) || !ids.length || typeof image !== 'string') return NextResponse.json({ error: 'Select products and provide an image URL.' }, { status: 400 })
  await db.update(catalogProducts).set({ image, updatedAt: new Date() }).where(inArray(catalogProducts.id, ids.filter((id: unknown): id is string => typeof id === 'string')))
  return NextResponse.json({ updated: ids.length })
}
