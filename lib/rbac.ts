import { db } from '@/lib/db'
import { userRoles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type Role = 'buyer' | 'seller' | 'admin'
export type UserStatus = 'active' | 'suspended' | 'banned'

export interface UserRoleData {
  userId: string
  role: Role
  status: UserStatus
}

/**
 * Get user's role and status
 */
export async function getUserRole(userId: string): Promise<UserRoleData | null> {
  try {
    const roleRecord = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId))
      .limit(1)

    if (!roleRecord.length) {
      // Default to buyer if no role exists
      return {
        userId,
        role: 'buyer',
        status: 'active',
      }
    }

    return {
      userId,
      role: roleRecord[0].role as Role,
      status: roleRecord[0].status as UserStatus,
    }
  } catch (error) {
    console.error('[v0] Get user role error:', error)
    return null
  }
}

/**
 * Check if user has a specific role
 */
export async function hasRole(userId: string, requiredRole: Role): Promise<boolean> {
  const roleData = await getUserRole(userId)
  if (!roleData) return false
  return roleData.role === requiredRole
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, 'admin')
}

/**
 * Check if user is seller
 */
export async function isSeller(userId: string): Promise<boolean> {
  return hasRole(userId, 'seller')
}

/**
 * Check if user is buyer (default role)
 */
export async function isBuyer(userId: string): Promise<boolean> {
  return hasRole(userId, 'buyer')
}

/**
 * Check if user is active (not suspended or banned)
 */
export async function isUserActive(userId: string): Promise<boolean> {
  const roleData = await getUserRole(userId)
  if (!roleData) return false
  return roleData.status === 'active'
}

/**
 * Check if user has any of the given roles
 */
export async function hasAnyRole(userId: string, roles: Role[]): Promise<boolean> {
  const roleData = await getUserRole(userId)
  if (!roleData) return false
  return roles.includes(roleData.role)
}

/**
 * Require user to have specific role, throw if not
 */
export async function requireRole(userId: string, requiredRole: Role): Promise<void> {
  const has = await hasRole(userId, requiredRole)
  if (!has) {
    throw new Error(`User does not have required role: ${requiredRole}`)
  }
}

/**
 * Require user to be active, throw if not
 */
export async function requireActive(userId: string): Promise<void> {
  const active = await isUserActive(userId)
  if (!active) {
    throw new Error('User account is not active')
  }
}

/**
 * Middleware helper: check multiple conditions
 */
export async function checkAccess(
  userId: string,
  options: {
    requireRoles?: Role[]
    requireActive?: boolean
  }
): Promise<{ hasAccess: boolean; reason?: string }> {
  if (options.requireActive) {
    const active = await isUserActive(userId)
    if (!active) {
      return { hasAccess: false, reason: 'User account is not active' }
    }
  }

  if (options.requireRoles && options.requireRoles.length > 0) {
    const has = await hasAnyRole(userId, options.requireRoles)
    if (!has) {
      return {
        hasAccess: false,
        reason: `User does not have required roles: ${options.requireRoles.join(', ')}`,
      }
    }
  }

  return { hasAccess: true }
}
