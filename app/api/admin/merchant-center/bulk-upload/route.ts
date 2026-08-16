import { put } from '@vercel/blob'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
  if (!session?.user || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const files = (await request.formData()).getAll('files').filter((file): file is File => file instanceof File)
  if (!files.length) return NextResponse.json({ error: 'Choose one or more image files.' }, { status: 400 })
  if (files.length > 100) return NextResponse.json({ error: 'Upload up to 100 images at a time.' }, { status: 400 })
  const urls: string[] = []
  for (const file of files) {
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) continue
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-')
    const blob = await put(`catalog/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`, file, { access: 'public' })
    urls.push(blob.url)
  }
  return NextResponse.json({ urls, uploaded: urls.length })
}
