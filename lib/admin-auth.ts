// Admin credentials - use environment variables in production
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_EMAIL || 'admin@auapw.com',
  password: process.env.ADMIN_PASSWORD || 'AUAPWAdmin123!', // DEFAULT - CHANGE IN PRODUCTION
}

/**
 * Validate admin login credentials
 */
export async function validateAdminCredentials(
  username: string,
  password: string
): Promise<{ valid: boolean; message: string }> {
  try {
    if (!username || !password) {
      return { valid: false, message: 'Username and password required' }
    }

    // Validate credentials against environment variables
    if (username !== ADMIN_CREDENTIALS.username) {
      return { valid: false, message: 'Invalid credentials' }
    }

    if (password !== ADMIN_CREDENTIALS.password) {
      return { valid: false, message: 'Invalid credentials' }
    }

    return { valid: true, message: 'Login successful' }
  } catch (error) {
    console.error('[v0] Admin auth error:', error)
    return { valid: false, message: 'Authentication error' }
  }
}

/**
 * Generate admin session token
 */
export function generateAdminToken(adminId: string): string {
  // In production: use JWT with proper signing
  const token = Buffer.from(
    JSON.stringify({
      adminId,
      timestamp: Date.now(),
      role: 'admin',
    })
  ).toString('base64')

  return token
}

/**
 * Verify admin token
 */
export function verifyAdminToken(token: string): {
  valid: boolean
  adminId?: string
} {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())

    // In production: validate JWT signature and expiration
    if (decoded.role !== 'admin') {
      return { valid: false }
    }

    return { valid: true, adminId: decoded.adminId }
  } catch (error) {
    return { valid: false }
  }
}
