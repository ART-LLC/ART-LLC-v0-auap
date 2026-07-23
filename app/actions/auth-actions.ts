'use server'

import { hashPassword, generateVerificationToken } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/send-verification-email'

// Simulate database - in real app would use Neon
const mockUsers = new Map()
const mockVerifications = new Map()
const mockSessions = new Map()

interface SignUpData {
  email: string
  password: string
  name: string
}

export async function signUpAction(data: SignUpData) {
  const { email, password, name } = data

  // Validate input
  if (!email || !password || !name) {
    throw new Error('Missing required fields')
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  // Check if user exists
  if (mockUsers.has(email)) {
    throw new Error('Email already registered')
  }

  try {
    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const user = {
      id: userId,
      email,
      name,
      password_hash: passwordHash,
      email_verified: false,
      created_at: new Date(),
    }

    mockUsers.set(email, user)

    // Generate verification token
    const verificationToken = generateVerificationToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    mockVerifications.set(verificationToken, {
      user_id: userId,
      email,
      token: verificationToken,
      expires_at: expiresAt,
      created_at: new Date(),
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return {
      success: true,
      message: 'Signup successful. Please check your email to verify your account.',
      email,
    }
  } catch (error) {
    console.error('[v0] Signup error:', error)
    throw new Error(error instanceof Error ? error.message : 'Signup failed')
  }
}

interface VerifyEmailData {
  token: string
}

export async function verifyEmailAction(data: VerifyEmailData) {
  const { token } = data

  if (!token) {
    throw new Error('Invalid verification token')
  }

  try {
    const verification = mockVerifications.get(token)

    if (!verification) {
      throw new Error('Invalid or expired verification token')
    }

    // Check if token expired
    if (new Date() > verification.expires_at) {
      mockVerifications.delete(token)
      throw new Error('Verification token has expired')
    }

    // Mark user as verified
    const user = mockUsers.get(verification.email)
    if (user) {
      user.email_verified = true
      user.email_verified_at = new Date()
      mockUsers.set(verification.email, user)
    }

    // Remove verification token
    mockVerifications.delete(token)

    return {
      success: true,
      message: 'Email verified successfully. You can now sign in.',
    }
  } catch (error) {
    console.error('[v0] Email verification error:', error)
    throw new Error(error instanceof Error ? error.message : 'Verification failed')
  }
}

interface SignInData {
  email: string
  password: string
}

export async function signInAction(data: SignInData) {
  const { email, password } = data

  if (!email || !password) {
    throw new Error('Missing email or password')
  }

  try {
    const user = mockUsers.get(email)

    if (!user) {
      throw new Error('User not found')
    }

    // Verify password
    const passwordHash = await hashPassword(password)
    if (passwordHash !== user.password_hash) {
      throw new Error('Invalid password')
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new Error('Please verify your email first')
    }

    // Create session token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    mockSessions.set(sessionToken, {
      user_id: user.id,
      email: user.email,
      name: user.name,
      token: sessionToken,
      expires_at: expiresAt,
      created_at: new Date(),
    })

    return {
      success: true,
      message: 'Sign in successful',
      sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  } catch (error) {
    console.error('[v0] Sign in error:', error)
    throw new Error(error instanceof Error ? error.message : 'Sign in failed')
  }
}
