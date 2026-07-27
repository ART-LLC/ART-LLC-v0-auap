'use server'

import { db } from '@/lib/db'
import {
  orders,
  orderItems,
  ledgerEntries,
  fraudFlags,
  sellerListings,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { recordLedgerEntry } from './financial-actions'

export interface CreateOrderInput {
  items: Array<{
    listingId: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    country: string
  }
  billingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    country: string
  }
  stripeTokenId: string
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Validate items exist and are in stock
    let totalAmount = 0
    const itemDetails = []

    for (const item of input.items) {
      const listing = await db
        .select()
        .from(sellerListings)
        .where(eq(sellerListings.id, item.listingId))
        .limit(1)

      if (!listing.length) {
        return { error: `Item ${item.listingId} not found`, status: 404 }
      }

      if (listing[0].quantity < item.quantity) {
        return {
          error: `Insufficient inventory for ${listing[0].partName}`,
          status: 400,
        }
      }

      totalAmount += item.price * item.quantity
      itemDetails.push({
        ...item,
        listing: listing[0],
      })
    }

    // Create fraud flag for high-value orders (TODO: implement velocity checks)
    if (totalAmount > 5000) {
      await db.insert(fraudFlags).values({
        id: `fraud_${Date.now()}`,
        flagType: 'manual_review',
        riskScore: 40,
        userId: session.user.id,
        description: `High-value order: $${totalAmount.toFixed(2)}`,
        status: 'open',
      })
    }

    // Create order
    const orderId = `order_${Date.now()}`
    const order = await db
      .insert(orders)
      .values({
        id: orderId,
        userId: session.user.id,
        orderNumber: `ORD-${Date.now()}`,
        status: 'pending',
        subtotal: totalAmount.toString(),
        tax: '0',
        shipping: '0',
        total: totalAmount.toString(),
        shippingAddress: JSON.stringify(input.shippingAddress),
        billingAddress: input.billingAddress
          ? JSON.stringify(input.billingAddress)
          : undefined,
        paymentStatus: 'pending',
      })
      .returning()

    // Create order items
    for (const item of itemDetails) {
      await db.insert(orderItems).values({
        id: `item_${Date.now()}_${Math.random()}`,
        orderId,
        productId: item.listingId,
        quantity: item.quantity,
        unitPrice: item.price.toString(),
        lineTotal: (item.price * item.quantity).toString(),
      })

      // Reduce inventory
      await db
        .update(sellerListings)
        .set({
          quantity: item.listing.quantity - item.quantity,
        })
        .where(eq(sellerListings.id, item.listingId))
    }

    // TODO: Process Stripe payment here
    // const paymentResult = await processPayment({
    //   amount: totalAmount,
    //   currency: 'usd',
    //   source: input.stripeTokenId,
    //   description: `Payment for order ${orderId}`,
    //   metadata: { orderId },
    // })

    return {
      success: true,
      data: {
        order: order[0],
        items: itemDetails,
        totalAmount,
      },
    }
  } catch (error) {
    console.error('[v0] Create order error:', error)
    return { error: 'Failed to create order', status: 500 }
  }
}

export async function confirmOrderPayment(
  orderId: string,
  stripeChargeId: string,
  amount: number
) {
  try {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    if (!order.length) {
      return { error: 'Order not found', status: 404 }
    }

    // Update order status
    const updated = await db
      .update(orders)
      .set({
        status: 'confirmed',
      })
      .where(eq(orders.id, orderId))
      .returning()

    // Record ledger entries for payment
    // Debit from buyer (reduction in account balance)
    await recordLedgerEntry({
      txnId: stripeChargeId,
      txnType: 'sale',
      accountType: 'buyer',
      accountId: order[0].userId,
      debit: amount,
      description: `Payment for order ${orderId}`,
      metadata: { orderId, chargeId: stripeChargeId },
    })

    // Credit to platform (will be distributed to sellers via payouts)
    await recordLedgerEntry({
      txnId: stripeChargeId,
      txnType: 'sale',
      accountType: 'platform',
      accountId: 'platform_account',
      credit: amount.toString(),
      description: `Payment received for order ${orderId}`,
      metadata: { orderId, chargeId: stripeChargeId },
    })

    return { success: true, data: updated[0] }
  } catch (error) {
    console.error('[v0] Confirm payment error:', error)
    return { error: 'Failed to confirm payment', status: 500 }
  }
}

export async function getOrder(orderId: string) {
  try {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    if (!order.length) {
      return { error: 'Order not found', status: 404 }
    }

    // Get order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))

    return {
      success: true,
      data: {
        order: order[0],
        items,
      },
    }
  } catch (error) {
    console.error('[v0] Get order error:', error)
    return { error: 'Failed to fetch order', status: 500 }
  }
}

export async function getUserOrders(userId: string, limit: number = 50) {
  try {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, userId))
      .limit(limit)

    return { success: true, data: userOrders }
  } catch (error) {
    console.error('[v0] Get user orders error:', error)
    return { error: 'Failed to fetch orders', status: 500 }
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  notes?: string
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    if (!order.length) {
      return { error: 'Order not found', status: 404 }
    }

    // Verify user is seller or admin
    // TODO: add authorization check

    const updated = await db
      .update(orders)
      .set({
        status: newStatus,
        notes: notes || order[0].notes,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning()

    return { success: true, data: updated[0] }
  } catch (error) {
    console.error('[v0] Update order status error:', error)
    return { error: 'Failed to update order', status: 500 }
  }
}

export async function cancelOrder(orderId: string, reason: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    if (!order.length) {
      return { error: 'Order not found', status: 404 }
    }

    // Verify user is order owner or admin
    if (order[0].customerId !== session.user.id) {
      return { error: 'Unauthorized', status: 403 }
    }

    // Only allow cancellation if not yet shipped
    if (!['pending_payment', 'confirmed', 'processing'].includes(order[0].status)) {
      return { error: 'Order cannot be cancelled in current state', status: 400 }
    }

    // Restore inventory
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))

    for (const item of items) {
      const listing = await db
        .select()
        .from(sellerListings)
        .where(eq(sellerListings.id, item.listingId))
        .limit(1)

      if (listing.length) {
        await db
          .update(sellerListings)
          .set({
            quantity: listing[0].quantity + item.quantity,
          })
          .where(eq(sellerListings.id, item.listingId))
      }
    }

    // Update order status
    const updated = await db
      .update(orders)
      .set({
        status: 'cancelled',
        notes: reason,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning()

    return { success: true, data: updated[0] }
  } catch (error) {
    console.error('[v0] Cancel order error:', error)
    return { error: 'Failed to cancel order', status: 500 }
  }
}
