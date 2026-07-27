'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  sellerProfiles,
  userRoles,
  fraudFlags,
  auditLog,
  orders,
  payoutRecords,
} from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { initiatePayout } from '@/lib/stripe'

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Not authenticated')

  const role = await db
    .select()
    .from(userRoles)
    .where(and(eq(userRoles.userId, session.user.id), eq(userRoles.role, 'admin')))
    .limit(1)

  if (!role[0]) throw new Error('Not authorized as admin')
  return session.user
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ─── Seller Management ────────────────────────────────────────────────────────

export async function getPendingSellers() {
  await requireAdmin()
  return db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.approvalStatus, 'pending'))
    .orderBy(desc(sellerProfiles.createdAt))
}

export async function getAllSellers() {
  await requireAdmin()
  return db
    .select()
    .from(sellerProfiles)
    .orderBy(desc(sellerProfiles.createdAt))
}

export async function approveSeller(sellerId: string) {
  const admin = await requireAdmin()

  await db
    .update(sellerProfiles)
    .set({ approvalStatus: 'approved', kybStatus: 'verified' })
    .where(eq(sellerProfiles.id, sellerId))

  await db.insert(auditLog).values({
    id: generateId(),
    action: 'seller_approved',
    actor: admin.id,
    resource: 'seller_profile',
    resourceId: sellerId,
    changes: { approvalStatus: 'approved' },
    ipAddress: null,
    userAgent: null,
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function rejectSeller(sellerId: string, reason: string) {
  const admin = await requireAdmin()

  await db
    .update(sellerProfiles)
    .set({ approvalStatus: 'rejected', rejectionReason: reason })
    .where(eq(sellerProfiles.id, sellerId))

  await db.insert(auditLog).values({
    id: generateId(),
    action: 'seller_rejected',
    actor: admin.id,
    resource: 'seller_profile',
    resourceId: sellerId,
    changes: { approvalStatus: 'rejected', rejectionReason: reason },
    ipAddress: null,
    userAgent: null,
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function suspendSeller(sellerId: string, reason: string) {
  const admin = await requireAdmin()

  await db
    .update(sellerProfiles)
    .set({ approvalStatus: 'rejected' })
    .where(eq(sellerProfiles.id, sellerId))

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.id, sellerId))
    .limit(1)

  if (profile[0]) {
    await db
      .update(userRoles)
      .set({ status: 'suspended' })
      .where(eq(userRoles.userId, profile[0].userId))
  }

  await db.insert(auditLog).values({
    id: generateId(),
    action: 'seller_suspended',
    actor: admin.id,
    resource: 'seller_profile',
    resourceId: sellerId,
    changes: { reason },
    ipAddress: null,
    userAgent: null,
  })

  revalidatePath('/admin')
  return { success: true }
}

// ─── Fraud Flags ──────────────────────────────────────────────────────────────

export async function getOpenFraudFlags() {
  await requireAdmin()
  return db
    .select()
    .from(fraudFlags)
    .where(eq(fraudFlags.status, 'open'))
    .orderBy(desc(fraudFlags.createdAt))
}

export async function resolveFraudFlag(flagId: string, resolution: string) {
  const admin = await requireAdmin()

  await db
    .update(fraudFlags)
    .set({ status: 'resolved', resolution, resolvedAt: new Date() })
    .where(eq(fraudFlags.id, flagId))

  await db.insert(auditLog).values({
    id: generateId(),
    action: 'fraud_flag_resolved',
    actor: admin.id,
    resource: 'fraud_flag',
    resourceId: flagId,
    changes: { resolution },
    ipAddress: null,
    userAgent: null,
  })

  revalidatePath('/admin')
  return { success: true }
}

// ─── Orders Overview ──────────────────────────────────────────────────────────

export async function getAllOrders(limit = 100) {
  await requireAdmin()
  return db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
}

// ─── Payout Runs ─────────────────────────────────────────────────────────────

export async function runPayoutForSeller(sellerId: string, amount: number) {
  const admin = await requireAdmin()

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.id, sellerId))
    .limit(1)

  if (!profile[0]) return { error: 'Seller not found' }
  if (!profile[0].stripeConnectId) return { error: 'No Stripe account connected' }

  const result = await initiatePayout({
    connectedAccountId: profile[0].stripeConnectId,
    amount,
    description: `AUAPW payout for seller ${profile[0].businessName}`,
    metadata: { sellerId, adminId: admin.id },
  })

  if (!result.success) return { error: result.error }

  const period = new Date().toISOString().slice(0, 7) // 'YYYY-MM'

  await db.insert(payoutRecords).values({
    id: generateId(),
    sellerId,
    period,
    totalSales: '0',
    commissionDue: '0',
    listingFees: '0',
    transactionFees: '0',
    chargebacks: '0',
    adjustments: '0',
    netPayout: amount.toString(),
    payoutStatus: 'initiated',
    stripePayoutId: result.transferId,
  })

  await db.insert(auditLog).values({
    id: generateId(),
    action: 'payout_initiated',
    actor: admin.id,
    resource: 'payout',
    resourceId: result.transferId ?? generateId(),
    changes: { sellerId, amount },
    ipAddress: null,
    userAgent: null,
  })

  revalidatePath('/admin')
  return { success: true, transferId: result.transferId }
}

export async function getAdminStats() {
  await requireAdmin()

  const allOrders = await db.select().from(orders)
  const allSellers = await db.select().from(sellerProfiles)
  const pendingSellers = allSellers.filter((s) => s.approvalStatus === 'pending')
  const openFlags = await db
    .select()
    .from(fraudFlags)
    .where(eq(fraudFlags.status, 'open'))

  return {
    totalOrders: allOrders.length,
    totalSellers: allSellers.length,
    pendingApprovals: pendingSellers.length,
    openFraudFlags: openFlags.length,
  }
}
