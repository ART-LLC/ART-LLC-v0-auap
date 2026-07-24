import { NextRequest, NextResponse } from 'next/server'

const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const trimmedEmail = email.trim().toLowerCase()

    // Basic email validation
    if (!VALID_EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if email domain is disposable (simple check)
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com']
    const domain = trimmedEmail.split('@')[1]
    
    if (disposableDomains.includes(domain)) {
      return NextResponse.json({ error: 'Please use a valid business or personal email' }, { status: 400 })
    }

    // In production, you could:
    // 1. Send a verification email with a code
    // 2. Store the email in a database with verification status
    // 3. Set a session/cookie for the verified email
    // For now, we'll just validate and return success

    return NextResponse.json({
      success: true,
      email: trimmedEmail,
      verified: true,
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
