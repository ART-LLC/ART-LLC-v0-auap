'use server'

import { db } from '@/lib/db'
import { sellerProfiles, sellerListings, userRoles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

interface CreateSellerProfileInput {
  businessName: string
  businessType: string
  ein: string
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
}

interface CreateSellerListingInput {
  partName: string
  make: string
  model: string
  year?: string
  condition: string
  price: string | number
  quantity: number
  description?: string
  partNumber?: string
  mileage?: number
  images?: string[]
  specs?: Record<string, any>
}

export async function createSellerProfile(input: CreateSellerProfileInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Check if user already has a seller profile
    const existing = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, session.user.id))
      .limit(1)

    if (existing.length > 0) {
      return { error: 'User already has a seller profile', status: 400 }
    }

    // Create role entry for seller
    await db
      .insert(userRoles)
      .values({
        id: `role_${Date.now()}`,
        userId: session.user.id,
        role: 'seller',
        status: 'active',
      })
      .onConflictDoUpdate({
        target: userRoles.userId,
        set: { role: 'seller' },
      })

    // Create seller profile
    const sellerId = `seller_${Date.now()}`
    const profile = await db
      .insert(sellerProfiles)
      .values({
        id: sellerId,
        userId: session.user.id,
        businessName: input.businessName,
        businessType: input.businessType,
        ein: input.ein,
        taxId: input.taxId,
        businessAddress: input.businessAddress,
        businessCity: input.businessCity,
        businessState: input.businessState,
        businessZip: input.businessZip,
        businessPhone: input.businessPhone,
        businessWebsite: input.businessWebsite,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        kycStatus: 'pending',
        kybStatus: 'pending',
        approvalStatus: 'pending',
        commissionPercent: '10',
      })
      .returning()

    return { success: true, data: profile[0] }
  } catch (error) {
    console.error('[v0] Create seller profile error:', error)
    return { error: 'Failed to create seller profile', status: 500 }
  }
}

export async function createSellerListing(input: CreateSellerListingInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Get seller profile
    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, session.user.id))
      .limit(1)

    if (!seller.length) {
      return { error: 'Seller profile not found', status: 404 }
    }

    if (seller[0].approvalStatus !== 'approved') {
      return { error: 'Seller account not approved yet', status: 403 }
    }

    // Create listing
    const listingId = `listing_${Date.now()}`
    const listing = await db
      .insert(sellerListings)
      .values({
        id: listingId,
        sellerId: seller[0].id,
        partName: input.partName,
        make: input.make,
        model: input.model,
        year: input.year,
        condition: input.condition,
        price: input.price.toString(),
        quantity: input.quantity,
        description: input.description,
        partNumber: input.partNumber,
        mileage: input.mileage,
        images: input.images || [],
        specs: input.specs || {},
        listingStatus: 'active',
      })
      .returning()

    return { success: true, data: listing[0] }
  } catch (error) {
    console.error('[v0] Create listing error:', error)
    return { error: 'Failed to create listing', status: 500 }
  }
}

export async function getSellerProfile(userId: string) {
  try {
    const profile = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, userId))
      .limit(1)

    if (!profile.length) {
      return { error: 'Seller profile not found', status: 404 }
    }

    return { success: true, data: profile[0] }
  } catch (error) {
    console.error('[v0] Get seller profile error:', error)
    return { error: 'Failed to fetch seller profile', status: 500 }
  }
}

export async function getSellerListings(sellerId: string) {
  try {
    const listings = await db
      .select()
      .from(sellerListings)
      .where(eq(sellerListings.sellerId, sellerId))

    return { success: true, data: listings }
  } catch (error) {
    console.error('[v0] Get listings error:', error)
    return { error: 'Failed to fetch listings', status: 500 }
  }
}

export async function updateSellerListing(listingId: string, updates: Partial<CreateSellerListingInput>) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Verify ownership
    const listing = await db
      .select()
      .from(sellerListings)
      .where(eq(sellerListings.id, listingId))
      .limit(1)

    if (!listing.length) {
      return { error: 'Listing not found', status: 404 }
    }

    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, listing[0].sellerId))
      .limit(1)

    if (!seller.length || seller[0].userId !== session.user.id) {
      return { error: 'Unauthorized to update this listing', status: 403 }
    }

    const updated = await db
      .update(sellerListings)
      .set({
        ...updates,
      })
      .where(eq(sellerListings.id, listingId))
      .returning()

    return { success: true, data: updated[0] }
  } catch (error) {
    console.error('[v0] Update listing error:', error)
    return { error: 'Failed to update listing', status: 500 }
  }
}

export async function deleteSellerListing(listingId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Verify ownership
    const listing = await db
      .select()
      .from(sellerListings)
      .where(eq(sellerListings.id, listingId))
      .limit(1)

    if (!listing.length) {
      return { error: 'Listing not found', status: 404 }
    }

    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, listing[0].sellerId))
      .limit(1)

    if (!seller.length || seller[0].userId !== session.user.id) {
      return { error: 'Unauthorized to delete this listing', status: 403 }
    }

    await db.delete(sellerListings).where(eq(sellerListings.id, listingId))

    return { success: true }
  } catch (error) {
    console.error('[v0] Delete listing error:', error)
    return { error: 'Failed to delete listing', status: 500 }
  }
}
