import { headers } from 'next/headers'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { fraudFlags, ledgerEntries, orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing Stripe environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20',
})

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('[v0] Stripe webhook signature verification failed:', error)
    return new Response(`Webhook Error: ${error}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object as Stripe.Dispute)
        break

      case 'charge.dispute.closed':
        await handleDisputeClosed(event.data.object as Stripe.Dispute)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account)
        break

      default:
        console.log('[v0] Unhandled Stripe event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('[v0] Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500 }
    )
  }
}

async function handleDisputeCreated(dispute: Stripe.Dispute) {
  console.log('[v0] Dispute created:', dispute.id, 'Amount:', dispute.amount / 100)

  // Create fraud flag for the chargeback
  try {
    // Find the order associated with this charge
    const chargeId = dispute.charge as string
    const orderRecord = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeChargeId, chargeId))
      .limit(1)

    const flagId = `fraud_${Date.now()}`
    await db.insert(fraudFlags).values({
      id: flagId,
      flagType: 'chargeback',
      riskScore: 85,
      orderId: orderRecord.length > 0 ? orderRecord[0].id : undefined,
      userId: orderRecord.length > 0 ? orderRecord[0].customerId : undefined,
      description: `Chargeback dispute created. Reason: ${dispute.reason}. Amount: $${dispute.amount / 100}`,
      status: 'open',
      createdAt: new Date(),
    })

    console.log('[v0] Created fraud flag for dispute:', flagId)
  } catch (error) {
    console.error('[v0] Error handling dispute creation:', error)
  }
}

async function handleDisputeClosed(dispute: Stripe.Dispute) {
  console.log('[v0] Dispute closed:', dispute.id, 'Status:', dispute.status)

  try {
    // Find fraud flag and mark as resolved
    const chargeId = dispute.charge as string
    const orderRecord = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeChargeId, chargeId))
      .limit(1)

    if (orderRecord.length > 0) {
      const fraudRecord = await db
        .select()
        .from(fraudFlags)
        .where(eq(fraudFlags.orderId, orderRecord[0].id))
        .limit(1)

      if (fraudRecord.length > 0) {
        // Reverse the charge in ledger if lost
        if (dispute.status === 'lost') {
          await db.insert(ledgerEntries).values({
            id: `ledger_${Date.now()}`,
            txnId: dispute.id,
            txnType: 'chargeback',
            accountType: 'seller',
            accountId: orderRecord[0].sellerId || 'unknown',
            debit: (dispute.amount / 100).toString(),
            credit: '0',
            description: `Chargeback lost for order ${orderRecord[0].id}`,
            createdAt: new Date(),
          })
        }
      }
    }
  } catch (error) {
    console.error('[v0] Error handling dispute closure:', error)
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('[v0] Charge refunded:', charge.id, 'Amount:', charge.refunded)

  try {
    // Find the order and record refund in ledger
    const orderRecord = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeChargeId, charge.id))
      .limit(1)

    if (orderRecord.length > 0) {
      const refundAmount = charge.amount_refunded / 100

      // Record refund credit to buyer
      await db.insert(ledgerEntries).values({
        id: `ledger_${Date.now()}_buyer`,
        txnId: charge.id,
        txnType: 'refund',
        accountType: 'buyer',
        accountId: orderRecord[0].customerId,
        debit: '0',
        credit: refundAmount.toString(),
        description: `Refund for order ${orderRecord[0].id}`,
        createdAt: new Date(),
      })

      // Record refund debit from seller (if applicable)
      if (orderRecord[0].sellerId) {
        await db.insert(ledgerEntries).values({
          id: `ledger_${Date.now()}_seller`,
          txnId: charge.id,
          txnType: 'refund',
          accountType: 'seller',
          accountId: orderRecord[0].sellerId,
          debit: refundAmount.toString(),
          credit: '0',
          description: `Refund for order ${orderRecord[0].id}`,
          createdAt: new Date(),
        })
      }
    }
  } catch (error) {
    console.error('[v0] Error handling charge refund:', error)
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  console.log('[v0] Stripe Connect account updated:', account.id)
  // TODO: Update seller Stripe verification status in DB
  // This is used to track KYB/KYC approval progress
}
