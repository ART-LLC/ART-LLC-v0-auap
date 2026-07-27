'use server'

import { db } from '@/lib/db'
import {
  ledgerEntries,
  payoutRecords,
  sellerProfiles,
  orders,
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

interface LedgerEntryInput {
  txnId: string
  txnType: string
  accountType: string
  accountId: string
  debit?: string | number
  credit?: string | number
  description: string
  metadata?: Record<string, any>
}

/**
 * Double-entry ledger: every financial transaction creates two entries
 * (one debit, one credit) to maintain accounting integrity
 */
export async function recordLedgerEntry(input: LedgerEntryInput) {
  try {
    if (!input.debit && !input.credit) {
      return { error: 'Must specify either debit or credit amount', status: 400 }
    }

    const entry = await db
      .insert(ledgerEntries)
      .values({
        id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        txnId: input.txnId,
        txnType: input.txnType,
        accountType: input.accountType,
        accountId: input.accountId,
        debit: input.debit?.toString() || '0',
        credit: input.credit?.toString() || '0',
        description: input.description,
        metadata: input.metadata || {},
        createdAt: new Date(),
      })
      .returning()

    return { success: true, data: entry[0] }
  } catch (error) {
    console.error('[v0] Record ledger entry error:', error)
    return { error: 'Failed to record ledger entry', status: 500 }
  }
}

/**
 * Calculate seller payout for a given period
 * Accounts for: sales, commissions, fees, chargebacks, adjustments
 */
export async function calculateSellerPayout(
  sellerId: string,
  period: string // 'YYYY-MM'
) {
  try {
    // Get seller profile for fee structure
    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    // Get all ledger entries for this seller in the period
    const [startDate, endDate] = getPeriodDateRange(period)

    // Sum up sales (credits to seller)
    const salesResult = (await db
      .select({
        total: sql<string>`SUM(${ledgerEntries.credit})`,
      })
      .from(ledgerEntries)
      .where(
        and(
          eq(ledgerEntries.accountType, 'seller'),
          eq(ledgerEntries.accountId, seller[0].userId),
          eq(ledgerEntries.txnType, 'sale'),
          sql`${ledgerEntries.createdAt} >= ${startDate}`,
          sql`${ledgerEntries.createdAt} < ${endDate}`
        )
      )) as any

    const totalSales = parseFloat(salesResult[0]?.total || '0')

    // Calculate commission
    const commissionPercent = parseFloat(seller[0].commissionPercent || '10') / 100
    const commissionDue = totalSales * commissionPercent

    // Calculate flat transaction fees
    const transactionCount = (await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(ledgerEntries)
      .where(
        and(
          eq(ledgerEntries.accountType, 'seller'),
          eq(ledgerEntries.accountId, seller[0].userId),
          eq(ledgerEntries.txnType, 'sale'),
          sql`${ledgerEntries.createdAt} >= ${startDate}`,
          sql`${ledgerEntries.createdAt} < ${endDate}`
        )
      )) as any

    const transactionFees = transactionCount[0].count * 
      (parseFloat(seller[0].flatTransactionFee || '0'))

    // Get listing fees (monthly)
    const listingFees = parseFloat(seller[0].monthlyListingFee || '0')

    // Get chargebacks
    const chargebackResult = (await db
      .select({
        total: sql<string>`SUM(${ledgerEntries.debit})`,
      })
      .from(ledgerEntries)
      .where(
        and(
          eq(ledgerEntries.accountType, 'seller'),
          eq(ledgerEntries.accountId, seller[0].userId),
          eq(ledgerEntries.txnType, 'chargeback'),
          sql`${ledgerEntries.createdAt} >= ${startDate}`,
          sql`${ledgerEntries.createdAt} < ${endDate}`
        )
      )) as any

    const chargebacks = parseFloat(chargebackResult[0]?.total || '0')

    // Get adjustments (manual overrides)
    const adjustmentResult = (await db
      .select({
        total: sql<string>`SUM(CASE WHEN debit > 0 THEN -debit ELSE credit END)`,
      })
      .from(ledgerEntries)
      .where(
        and(
          eq(ledgerEntries.accountType, 'seller'),
          eq(ledgerEntries.accountId, seller[0].userId),
          eq(ledgerEntries.txnType, 'adjustment'),
          sql`${ledgerEntries.createdAt} >= ${startDate}`,
          sql`${ledgerEntries.createdAt} < ${endDate}`
        )
      )) as any

    const adjustments = parseFloat(adjustmentResult[0]?.total || '0')

    // Calculate net payout
    const netPayout = totalSales - commissionDue - transactionFees - listingFees - chargebacks + adjustments

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
export async function createPayoutRecord(
  sellerId: string,
  period: string
) {
  try {
    // Get seller profile
    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

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
    const record = await db
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
      .returning()

    // TODO: Wire Stripe Connect payout here (Phase 2)
    // if (seller[0].stripeConnectId) {
    //   const stripePayoutId = await initiateStripePayout(
    //     seller[0].stripeConnectId,
    //     payoutData.netPayout
    //   )
    //   await db
    //     .update(payoutRecords)
    //     .set({ stripePayoutId })
    //     .where(eq(payoutRecords.id, payoutId))
    // }

    return { success: true, data: record[0] }
  } catch (error) {
    console.error('[v0] Create payout error:', error)
    return { error: 'Failed to create payout', status: 500 }
  }
}

/**
 * Get seller's ledger entries for audit/transparency
 */
export async function getSellerLedger(
  sellerId: string,
  startDate?: Date,
  endDate?: Date
) {
  try {
    let query: any = db
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.accountId, sellerId))

    if (startDate) {
      query = query.where(sql`${ledgerEntries.createdAt} >= ${startDate}`)
    }

    if (endDate) {
      query = query.where(sql`${ledgerEntries.createdAt} < ${endDate}`)
    }

    const entries = (await query) as any

    // Calculate balances by type
    let totalDebits = 0
    let totalCredits = 0

    (entries as any[]).forEach((entry) => {
      totalDebits += parseFloat(entry.debit || '0')
      totalCredits += parseFloat(entry.credit || '0')
    })

    return {
      success: true,
      data: {
        entries,
        summary: {
          totalDebits,
          totalCredits,
          balance: totalCredits - totalDebits,
        },
      },
    }
  } catch (error) {
    console.error('[v0] Get seller ledger error:', error)
    return { error: 'Failed to fetch ledger', status: 500 }
  }
}

/**
 * Helper: convert period string (YYYY-MM) to date range
 */
function getPeriodDateRange(period: string): [Date, Date] {
  const [year, month] = period.split('-').map(Number)
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)
  return [startDate, endDate]
}
