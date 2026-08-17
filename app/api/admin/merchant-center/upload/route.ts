import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
  if (!session?.user || (adminEmail && session.user.email.toLowerCase() !== adminEmail)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await request.formData()
  // Accept a single "file" or multiple "files" so the portal can upload one
  // image or a whole gallery in one request.
  const files = [...formData.getAll('files'), formData.get('file')].filter(
    (value): value is File => value instanceof File,
  )
  if (!files.length) return NextResponse.json({ error: 'Image file is required' }, { status: 400 })

  const urls: string[] = []
  for (const file of files) {
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Images must be 5MB or smaller' }, { status: 400 })
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-')
    const blob = await put(`catalog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`, file, { access: 'public' })
    urls.push(blob.url)
  }

  return NextResponse.json({ url: urls[0], urls })
}
