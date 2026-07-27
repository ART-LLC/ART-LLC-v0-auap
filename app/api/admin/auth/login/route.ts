import { NextRequest, NextResponse } from 'next/server'
import { validateAdminCredentials, generateAdminToken } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Email and password required' },
        { status: 400 }
      )
    }

    // Validate credentials
    const validation = await validateAdminCredentials(username, password)

    if (!validation.valid) {
      // Log failed attempt for security
      console.log(
        `[v0] Failed admin login attempt for: ${username} at ${new Date().toISOString()}`
      )

      return NextResponse.json(
        { message: validation.message },
        { status: 401 }
      )
    }

    // Generate session token
    const token = generateAdminToken('admin_001')

    console.log(`[v0] Admin login successful for: ${username}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: {
          email: username,
          role: 'admin',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Admin login error:', error)

    return NextResponse.json(
      { message: 'Authentication error' },
      { status: 500 }
    )
  }
}
