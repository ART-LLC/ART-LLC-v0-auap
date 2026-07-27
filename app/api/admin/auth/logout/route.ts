import { NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/admin-auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 0,
  })
  return response
}
