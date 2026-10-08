import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

/**
 * Admin authentication backend.
 *
 * Credentials are sourced from environment variables. Sessions are stateless,
 * HMAC-signed tokens (signed with BETTER_AUTH_SECRET) with an expiry, stored in
 * an httpOnly cookie so they are never exposed to client-side JavaScript.
 *
 * There is deliberately no fallback password: ADMIN_PASSWORD must be set or
 * admin login stays disabled. A fallback signing secret is only used outside
 * production, because a known secret lets anyone forge an admin session.
 */

export const ADMIN_COOKIE = 'auapw_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 8 // 8 hours

function getSecret(): string | null {
  const secret = process.env.BETTER_AUTH_SECRET || process.env.ADMIN_SESSION_SECRET
  if (secret) return secret
  return process.env.NODE_ENV === 'production' ? null : 'auapw-dev-only-secret-change-me'
}

function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'auapworld@gmail.com',
    password: process.env.ADMIN_PASSWORD || '',
  }
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

// Hash both sides first so the comparison takes the same time whatever the
// input lengths are (timingSafeEqual itself requires equal-length buffers).
function safeEqual(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

/**
 * Validate admin login credentials against configured environment variables.
 */
export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<{ valid: boolean; message: string }> {
  if (!email || !password) {
    return { valid: false, message: 'Email and password required' }
  }

  const creds = getAdminCredentials()
  if (!creds.password || !getSecret()) {
    console.error('[v0] Admin login is disabled: set ADMIN_PASSWORD and BETTER_AUTH_SECRET')
    return { valid: false, message: 'Admin login is not configured on the server' }
  }

  const emailOk = safeEqual(email.trim().toLowerCase(), creds.email.toLowerCase())
  const passwordOk = safeEqual(password, creds.password)

  if (!emailOk || !passwordOk) {
    return { valid: false, message: 'Invalid email or password' }
  }

  return { valid: true, message: 'Login successful' }
}

/**
 * Generate a stateless, signed admin session token.
 * Format: base64url(payload).signature
 */
export function generateAdminToken(adminEmail: string): string {
  const secret = getSecret()
  if (!secret) throw new Error('Admin session secret is not configured')
  const payload = {
    email: adminEmail,
    role: 'admin',
    exp: Date.now() + SESSION_TTL_MS,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = sign(encoded, secret)
  return `${encoded}.${signature}`
}

/**
 * Verify a signed admin session token.
 */
export function verifyAdminToken(token: string | undefined): {
  valid: boolean
  email?: string
} {
  const secret = getSecret()
  if (!secret || !token || !token.includes('.')) return { valid: false }

  const [encoded, signature] = token.split('.')
  const expected = sign(encoded, secret)

  if (!safeEqual(signature, expected)) return { valid: false }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString())
    if (payload.role !== 'admin') return { valid: false }
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      return { valid: false }
    }
    return { valid: true, email: payload.email }
  } catch {
    return { valid: false }
  }
}

/**
 * Read and verify the admin session from the request cookies (server-side).
 */
export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  const result = verifyAdminToken(token)
  if (!result.valid || !result.email) return null
  return { email: result.email }
}

export const ADMIN_SESSION_MAX_AGE = SESSION_TTL_MS / 1000
