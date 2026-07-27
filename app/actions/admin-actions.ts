'use server'

import { db } from '@/lib/db'
import {
  sellerProfiles,
  userRoles,
  fraudFlags,
  payoutRecords,
  auditLog,
} from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const role = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, session.user.id))
    .limit(1)

  if (!role.length || role[0].role !== 'admin') {
    throw new Error('Admin access required')
  }

  return session.user.id
}

async function logAuditAction(
  adminId: string,
  action: string,
  resource: string,
  resourceId: string,
  changes?: any
) {
  await db.insert(auditLog).values({
    id: `audit_${Date.now()}`,
    action,
    actor: adminId,
    resource,
    resourceId,
    changes: changes || {},
    createdAt: new Date(),
  })
}

export async function approveSeller(sellerId: string, notes?: string) {
  try {
    const adminId = await requireAdmin()

    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    const updated = await db
      .update(sellerProfiles)
      .set({
        approvalStatus: 'approved',
        updatedAt: new Date(),
      })
      .where(eq(sellerProfiles.id, sellerId))
      .returning()

    await logAuditAction(
      adminId,
      'approve_seller',
      'seller',
      sellerId,
      { notes, previousStatus: seller[0].approvalStatus }
    )

    return { success: true, data: updated[0] }
  } catch (error) {
    console.error('[v0] Approve seller error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to approve seller', status: 500 }
  }
}

export async function rejectSeller(sellerId: string, reason: string) {
  try {
    const adminId = await requireAdmin()

    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    const updated = await db
      .update(sellerProfiles)
      .set({
        approvalStatus: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(sellerProfiles.id, sellerId))
      .returning()

    await logAuditAction(
      adminId,
      'reject_seller',
      'seller',
      sellerId,
      { reason, previousStatus: seller[0].approvalStatus }
    )

    return { success: true, data: updated[0] }
  } catch (error) {
    console.error('[v0] Reject seller error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to reject seller', status: 500 }
  }
}

export async function suspendSeller(sellerId: string, reason: string) {
  try {
    const adminId = await requireAdmin()

    // Get the user ID for this seller
    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    // Update user role status
    await db
      .update(userRoles)
      .set({ status: 'suspended' })
      .where(eq(userRoles.userId, seller[0].userId))

    await logAuditAction(
      adminId,
      'suspend_seller',
      'seller',
      sellerId,
      { reason }
    )

    return { success: true }
  } catch (error) {
    console.error('[v0] Suspend seller error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to suspend seller', status: 500 }
  }
}

export async function createFraudFlag(input: {
  flagType: string
  riskScore: number
  userId?: string
  sellerId?: string
  orderId?: string
  description: string
}) {
  try {
    const adminId = await requireAdmin()

    const flag = await db
      .insert(fraudFlags)
      .values({
        id: `fraud_${Date.now()}`,
        ...input,
        status: 'open',
        createdAt: new Date(),
      })
      .returning()

    await logAuditAction(
      adminId,
      'create_fraud_flag',
      'fraud_flag',
      flag[0].id,
      input
    )

    return { success: true, data: flag[0] }
  } catch (error) {
    console.error('[v0] Create fraud flag error:', error)
    return { error: 'Failed to create fraud flag', status: 500 }
  }
}

export async function resolveFraudFlag(flagId: string, resolution: string) {
  try {
    const adminId = await requireAdmin()

    const updated = await db
      .update(fraudFlags)
      .set({
        status: 'resolved',
        resolution,
        resolvedAt: new Date(),
      })
      .where(eq(fraudFlags.id, flagId))
      .returning()

    await logAuditAction(
      adminId,
      'resolve_fraud_flag',
      'fraud_flag',
      flagId,
      { resolution }
    )

    return { success: true, data: updated[0] }
  } catch (error) {
    console.error('[v0] Resolve fraud flag error:', error)
    return { error: 'Failed to resolve fraud flag', status: 500 }
  }
}

export async function getPendingSellerApprovals() {
  try {
    await requireAdmin()

    const pending = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.approvalStatus, 'pending'))

    return { success: true, data: pending }
  } catch (error) {
    console.error('[v0] Get pending approvals error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch pending approvals', status: 500 }
  }
}

export async function getFraudFlags(status?: string) {
  try {
    await requireAdmin()

    let query: any = db.select().from(fraudFlags)

    if (status) {
      query = query.where(eq(fraudFlags.status, status))
    }

    const flags = await query

    return { success: true, data: flags }
  } catch (error) {
    console.error('[v0] Get fraud flags error:', error)
    return { error: 'Failed to fetch fraud flags', status: 500 }
  }
}

export async function getAuditLog(resourceId?: string, limit: number = 100) {
  try {
    await requireAdmin()

    let query: any = db.select().from(auditLog)

    if (resourceId) {
      query = query.where(eq(auditLog.resourceId, resourceId))
    }

    const logs = await query.limit(limit)

    return { success: true, data: logs }
  } catch (error) {
    console.error('[v0] Get audit log error:', error)
    return { error: 'Failed to fetch audit log', status: 500 }
  }
}
