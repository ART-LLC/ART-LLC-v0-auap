'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  sellerProfiles,
  sellerListings,
  userRoles,
  payoutRecords,
  auditLog,
  orders,
  orderFulfillment,
} from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import {
  createStripeConnectAccount,
  generateStripeOnboardingLink,
} from '@/lib/stripe'

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function requireSeller() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Not authenticated')

  const role = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, session.user.id))
    .limit(1)

  if (!role[0] || !['seller', 'admin'].includes(role[0].role)) {
    throw new Error('Not authorized as seller')
  }
  return session.user
}

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Not authenticated')
  return session.user
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ─── Seller Onboarding ────────────────────────────────────────────────────────

export async function createSellerProfile(data: {
  businessName: string
  businessType: string
  taxId: string
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  businessPhone: string
  businessWebsite?: string
  contactName: string
  contactEmail: string
  contactPhone: string
  description?: string
}) {
  const user = await requireSession()

  const existing = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)

  if (existing[0]) {
    return { error: 'Seller profile already exists' }
  }

  const id = generateId()

  await db.insert(sellerProfiles).values({
    id,
    userId: user.id,
    ...data,
    kycStatus: 'pending',
    kybStatus: 'pending',
    approvalStatus: 'pending',
  })

  // Upsert role to seller
  const existingRole = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, user.id))
    .limit(1)

  if (existingRole[0]) {
    await db
      .update(userRoles)
      .set({ role: 'seller' })
      .where(eq(userRoles.userId, user.id))
  } else {
    await db.insert(userRoles).values({
      id: generateId(),
      userId: user.id,
      role: 'seller',
      status: 'active',
    })
  }

  await db.insert(auditLog).values({
    id: generateId(),
    action: 'seller_profile_created',
    actor: user.id,
    resource: 'seller_profile',
    resourceId: id,
    changes: null,
    ipAddress: null,
    userAgent: null,
  })

  revalidatePath('/seller')
  return { success: true, sellerId: id }
}

export async function getSellerProfile() {
  const user = await requireSession()
  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)
  return profile[0] ?? null
}

export async function startStripeOnboarding() {
  const user = await requireSeller()

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)

  if (!profile[0]) return { error: 'No seller profile found' }

  const p = profile[0]

  // Create Stripe Connect account if not already done
  let stripeAccountId = p.stripeConnectId
  if (!stripeAccountId) {
    const result = await createStripeConnectAccount({
      email: user.email,
      businessName: p.businessName,
      businessType: p.businessType,
      businessAddress: p.businessAddress,
      businessCity: p.businessCity,
      businessState: p.businessState,
      businessZip: p.businessZip,
      taxId: p.taxId,
    })
    if (!result.success) return { error: result.error }
    stripeAccountId = result.accountId!

    await db
      .update(sellerProfiles)
      .set({ stripeConnectId: stripeAccountId })
      .where(eq(sellerProfiles.userId, user.id))
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const link = await generateStripeOnboardingLink(
    stripeAccountId,
    `${origin}/seller/onboarding?refresh=true`,
    `${origin}/seller/onboarding/complete`
  )

  if (!link.success) return { error: link.error }
  return { success: true, url: link.url }
}

export async function completeStripeOnboarding() {
  const user = await requireSeller()

  await db
    .update(sellerProfiles)
    .set({ stripeOnboardingComplete: true })
    .where(eq(sellerProfiles.userId, user.id))

  revalidatePath('/seller')
  return { success: true }
}

// ─── Listings CRUD ────────────────────────────────────────────────────────────

export async function createListing(data: {
  partName: string
  partNumber?: string
  make: string
  model: string
  year?: string
  mileage?: number
  condition: string
  description?: string
  quantity: number
  price: number
  images?: string[]
  specs?: Record<string, string>
}) {
  const user = await requireSeller()

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)

  if (!profile[0]) return { error: 'No seller profile found' }
  if (profile[0].approvalStatus !== 'approved') {
    return { error: 'Seller account must be approved before listing parts' }
  }

  const id = generateId()
  const sku = `SKU-${Date.now()}`

  await db.insert(sellerListings).values({
    id,
    sellerId: profile[0].id,
    partName: data.partName,
    partNumber: data.partNumber,
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    condition: data.condition,
    description: data.description,
    quantity: data.quantity,
    price: data.price.toString(),
    sku,
    images: data.images ?? [],
    specs: data.specs ?? {},
    listingStatus: 'active',
  })

  revalidatePath('/seller/dashboard')
  return { success: true, listingId: id }
}

export async function updateListing(
  listingId: string,
  data: Partial<{
    partName: string
    partNumber: string
    make: string
    model: string
    year: string
    mileage: number
    condition: string
    description: string
    quantity: number
    price: number
    listingStatus: string
    images: string[]
    specs: Record<string, string>
  }>
) {
  const user = await requireSeller()

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)

  if (!profile[0]) return { error: 'No seller profile found' }

  const listing = await db
    .select()
    .from(sellerListings)
    .where(
      and(
        eq(sellerListings.id, listingId),
        eq(sellerListings.sellerId, profile[0].id)
      )
    )
    .limit(1)

  if (!listing[0]) return { error: 'Listing not found' }

  const updateData: Record<string, unknown> = { ...data }
  if (data.price !== undefined) updateData.price = data.price.toString()

  await db
    .update(sellerListings)
    .set(updateData)
    .where(eq(sellerListings.id, listingId))

  revalidatePath('/seller/dashboard')
  return { success: true }
}

export async function deleteListing(listingId: string) {
  const user = await requireSeller()

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)

  if (!profile[0]) return { error: 'No seller profile found' }

  await db
    .update(sellerListings)
    .set({ listingStatus: 'inactive' })
    .where(
      and(
        eq(sellerListings.id, listingId),
        eq(sellerListings.sellerId, profile[0].id)
      )
    )

  revalidatePath('/seller/dashboard')
  return { success: true }
}

export async function getSellerListings() {
  const user = await requireSeller()

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)

  if (!profile[0]) return []

  return db
    .select()
    .from(sellerListings)
    .where(
      and(
        eq(sellerListings.sellerId, profile[0].id),
        eq(sellerListings.listingStatus, 'active')
      )
    )
    .orderBy(desc(sellerListings.createdAt))
}

// ─── Orders for sellers ───────────────────────────────────────────────────────

export async function getSellerOrders() {
  const user = await requireSeller()

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)

  if (!profile[0]) return []

  // Return orders that have a fulfillment record tied to this seller
  const fulfillments = await db
    .select()
    .from(orderFulfillment)
    .where(eq(orderFulfillment.sellerId, profile[0].id))

  if (!fulfillments.length) return []

  const orderIds = fulfillments.map((f) => f.orderId)

  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))

  return allOrders.filter((o) => orderIds.includes(o.id))
}

export async function fulfillOrder(orderId: string, data: {
  trackingNumber: string
  carrier: string
  notes?: string
}) {
  const user = await requireSeller()

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)

  if (!profile[0]) return { error: 'No seller profile found' }

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order[0]) return { error: 'Order not found' }

  const existing = await db
    .select()
    .from(orderFulfillment)
    .where(eq(orderFulfillment.orderId, orderId))
    .limit(1)

  if (existing[0]) {
    await db
      .update(orderFulfillment)
      .set({
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        notes: data.notes,
        fulfillmentStatus: 'shipped',
        shippedAt: new Date(),
      })
      .where(eq(orderFulfillment.orderId, orderId))
  } else {
    await db.insert(orderFulfillment).values({
      id: generateId(),
      orderId,
      sellerId: profile[0].id,
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      notes: data.notes,
      fulfillmentStatus: 'shipped',
      shippedAt: new Date(),
    })
  }

  await db
    .update(orders)
    .set({ status: 'shipped' })
    .where(eq(orders.id, orderId))

  revalidatePath('/seller/dashboard')
  return { success: true }
}

// ─── Payouts ──────────────────────────────────────────────────────────────────

export async function getSellerPayouts() {
  const user = await requireSeller()

  const profile = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.userId, user.id))
    .limit(1)

  if (!profile[0]) return []

  return db
    .select()
    .from(payoutRecords)
    .where(eq(payoutRecords.sellerId, profile[0].id))
    .orderBy(desc(payoutRecords.createdAt))
}
