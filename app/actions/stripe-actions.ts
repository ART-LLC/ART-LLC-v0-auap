'use server'

import { db } from '@/lib/db'
import { sellerProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { createStripeConnectAccount, generateStripeOnboardingLink } from '@/lib/stripe'

export async function initializeStripeConnect(sellerId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Get seller profile
    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    // Verify user owns this seller profile
    if (seller[0].userId !== session.user.id) {
      return { error: 'Unauthorized', status: 403 }
    }

    // If already has Stripe account, return it
    if (seller[0].stripeConnectId) {
      return { success: true, accountId: seller[0].stripeConnectId }
    }

    // Create Stripe Connect account
    const result = await createStripeConnectAccount({
      email: seller[0].contactEmail,
      businessName: seller[0].businessName,
      businessType: seller[0].businessType,
      businessAddress: seller[0].businessAddress,
      businessCity: seller[0].businessCity,
      businessState: seller[0].businessState,
      businessZip: seller[0].businessZip,
      taxId: seller[0].taxId,
    })

    if (!result.success) {
      return { error: result.error, status: 500 }
    }

    // Save Stripe account ID
    await db
      .update(sellerProfiles)
      .set({
        stripeConnectId: result.accountId,
        updatedAt: new Date(),
      })
      .where(eq(sellerProfiles.id, sellerId))

    return { success: true, accountId: result.accountId }
  } catch (error) {
    console.error('[v0] Initialize Stripe Connect error:', error)
    return { error: 'Failed to initialize Stripe Connect', status: 500 }
  }
}

export async function getStripeOnboardingUrl(
  sellerId: string,
  baseUrl: string
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Get seller profile
    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    // Verify user owns this seller profile
    if (seller[0].userId !== session.user.id) {
      return { error: 'Unauthorized', status: 403 }
    }

    // Must have Stripe account first
    if (!seller[0].stripeConnectId) {
      return { error: 'Stripe Connect account not initialized', status: 400 }
    }

    // Generate onboarding link
    const result = await generateStripeOnboardingLink(
      seller[0].stripeConnectId,
      `${baseUrl}/seller/stripe/refresh`,
      `${baseUrl}/seller/stripe/success`
    )

    if (!result.success) {
      return { error: result.error, status: 500 }
    }

    return { success: true, url: result.url }
  } catch (error) {
    console.error('[v0] Get onboarding URL error:', error)
    return { error: 'Failed to get onboarding URL', status: 500 }
  }
}

export async function confirmStripeOnboarding(sellerId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Get seller profile
    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    // Verify user owns this seller profile
    if (seller[0].userId !== session.user.id) {
      return { error: 'Unauthorized', status: 403 }
    }

    // Mark as completed
    const updated = await db
      .update(sellerProfiles)
      .set({
        stripeOnboardingComplete: true,
        updatedAt: new Date(),
      })
      .where(eq(sellerProfiles.id, sellerId))
      .returning()

    return { success: true, data: updated[0] }
  } catch (error) {
    console.error('[v0] Confirm onboarding error:', error)
    return { error: 'Failed to confirm onboarding', status: 500 }
  }
}
