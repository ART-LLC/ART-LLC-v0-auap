'use server'

import { db } from '@/lib/db'
import {
  ledgerEntries,
  payoutRecords,
  sellerProfiles,
} from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { stripe } from '@/lib/stripe'

/**
 * Record a double-entry ledger transaction
 */
export async function recordLedgerEntry(
  txnId: string,
  txnType: string,
  accountType: string,
  accountId: string,
  debit: number,
  credit: number,
  description: string,
  metadata?: Record<string, any>
) {
  try {
    const entryId = `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await db.insert(ledgerEntries).values({
      id: entryId,
      txnId,
      txnType,
      accountType,
      accountId,
      debit: debit.toString(),
      credit: credit.toString(),
      description,
      metadata: metadata || {},
      createdAt: new Date(),
    })

    return { success: true, id: entryId }
  } catch (error) {
    console.error('[v0] Ledger entry error:', error)
    return { error: 'Failed to record ledger entry', status: 500 }
  }
}

/**
 * Calculate seller payout for a given period
 */
export async function calculateSellerPayout(
  sellerId: string,
  period: string
) {
  try {
    // Get seller profile
    const seller = (await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, sellerId))
      .limit(1)) as any

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    const [startDate, endDate] = getPeriodDateRange(period)

    // Sum up sales (credits to seller) - get all records and calculate
    const salesEntries = (await db
      .select()
      .from(ledgerEntries)
      .where(
        and(
          eq(ledgerEntries.accountType, 'seller'),
          eq(ledgerEntries.accountId, seller[0].userId),
          eq(ledgerEntries.txnType, 'sale')
        )
      )) as any

    const totalSales = salesEntries.reduce((sum: number, entry: any) => {
      return sum + parseFloat(entry.credit || '0')
    }, 0)

    // Calculate commission
    const commissionPercent =
      (parseFloat(seller[0].commissionPercent || '10') / 100)
    const commissionDue = totalSales * commissionPercent

    // Count transactions for flat fees
    const transactionCount = salesEntries.length
    const transactionFees =
      transactionCount * parseFloat(seller[0].flatTransactionFee || '0')

    // Get listing fees (monthly)
    const listingFees = parseFloat(seller[0].monthlyListingFee || '0')

    // Get chargebacks
    const chargebackEntries = (await db
      .select()
      .from(ledgerEntries)
      .where(
        and(
          eq(ledgerEntries.accountType, 'seller'),
          eq(ledgerEntries.accountId, seller[0].userId),
          eq(ledgerEntries.txnType, 'chargeback')
        )
      )) as any

    const chargebacks = chargebackEntries.reduce((sum: number, entry: any) => {
      return sum + parseFloat(entry.debit || '0')
    }, 0)

    // Get adjustments
    const adjustmentEntries = (await db
      .select()
      .from(ledgerEntries)
      .where(
        and(
          eq(ledgerEntries.accountType, 'seller'),
          eq(ledgerEntries.accountId, seller[0].userId),
          eq(ledgerEntries.txnType, 'adjustment')
        )
      )) as any

    const adjustments = adjustmentEntries.reduce((sum: number, entry: any) => {
      const val = parseFloat(entry.debit || '0') - parseFloat(entry.credit || '0')
      return sum + val
    }, 0)

    // Calculate net payout
    const netPayout =
      totalSales - commissionDue - transactionFees - listingFees - chargebacks + adjustments

    return {
      success: true,
      data: {
        sellerId,
        period,
        totalSales,
        commissionDue,
        listingFees,
        transactionFees,
        chargebacks,
        adjustments,
        netPayout,
      },
    }
  } catch (error) {
    console.error('[v0] Calculate payout error:', error)
    return { error: 'Failed to calculate payout', status: 500 }
  }
}

/**
 * Create a payout record and initiate Stripe payout
 */
export async function createPayoutRecord(sellerId: string, period: string) {
  try {
    // Get seller profile
    const seller = (await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, sellerId))
      .limit(1)) as any

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    // Calculate payout amounts
    const calc = await calculateSellerPayout(sellerId, period)
    if (!calc.success) {
      return calc
    }

    const payoutData = calc.data

    // Create payout record
    const payoutId = `payout_${Date.now()}`
    const record = (await db
      .insert(payoutRecords)
      .values({
        id: payoutId,
        sellerId,
        period,
        totalSales: payoutData.totalSales.toString(),
        commissionDue: payoutData.commissionDue.toString(),
        listingFees: payoutData.listingFees.toString(),
        transactionFees: payoutData.transactionFees.toString(),
        chargebacks: payoutData.chargebacks.toString(),
        adjustments: payoutData.adjustments.toString(),
        netPayout: payoutData.netPayout.toString(),
        payoutStatus: 'pending',
        createdAt: new Date(),
      })
      .returning()) as any

    // If payout amount > 0, initiate Stripe transfer
    if (payoutData.netPayout > 0 && seller[0].stripeConnectId) {
      const transfer = await stripe.transfers.create({
        amount: Math.round(payoutData.netPayout * 100), // cents
        currency: 'usd',
        destination: seller[0].stripeConnectId,
        description: `AUAPW Payout for ${period}`,
        metadata: {
          payoutId,
          sellerId,
          period,
        },
      })

      // Update payout record with Stripe ID
      await db
        .insert(payoutRecords)
        .values({
          id: payoutId,
          sellerId,
          period,
          totalSales: payoutData.totalSales.toString(),
          commissionDue: payoutData.commissionDue.toString(),
          listingFees: payoutData.listingFees.toString(),
          transactionFees: payoutData.transactionFees.toString(),
          chargebacks: payoutData.chargebacks.toString(),
          adjustments: payoutData.adjustments.toString(),
          netPayout: payoutData.netPayout.toString(),
          payoutStatus: 'initiated',
          stripePayoutId: transfer.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [payoutRecords.id],
          set: {
            stripePayoutId: transfer.id,
            payoutStatus: 'initiated',
            updatedAt: new Date(),
          },
        })
    }

    return { success: true, data: record[0] }
  } catch (error) {
    console.error('[v0] Create payout error:', error)
    return { error: 'Failed to create payout', status: 500 }
  }
}

/**
 * Get seller ledger for a period
 */
export async function getSellerLedger(
  sellerId: string,
  period?: string
) {
  try {
    let entries = (await db
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.accountId, sellerId))) as any

    if (period) {
      const [startDate, endDate] = getPeriodDateRange(period)
      entries = entries.filter(
        (e: any) => e.createdAt >= startDate && e.createdAt < endDate
      )
    }

    // Calculate totals
    let sumDebits = 0
    let sumCredits = 0

    entries.forEach((entry: any) => {
      sumDebits += parseFloat(entry.debit || '0')
      sumCredits += parseFloat(entry.credit || '0')
    })

    return {
      success: true,
      data: {
        entries,
        summary: {
          totalDebits: sumDebits,
          totalCredits: sumCredits,
          balance: sumCredits - sumDebits,
        },
      },
    }
  } catch (error) {
    console.error('[v0] Get ledger error:', error)
    return { error: 'Failed to fetch ledger', status: 500 }
  }
}

/**
 * Helper: parse period string to date range
 */
function getPeriodDateRange(period: string): [Date, Date] {
  const [year, month] = period.split('-').map(Number)
  const startDate = new Date(year, (month || 1) - 1, 1)
  const endDate = new Date(year, (month || 1), 1)
  return [startDate, endDate]
}
