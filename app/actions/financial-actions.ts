'use server'

import { db } from '@/lib/db'
import {
  ledgerEntries,
  payoutRecords,
  sellerProfiles,
  orders,
} from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

interface LedgerEntryInput {
  txnId: string
  txnType: 'sale' | 'refund' | 'commission' | 'payout' | 'fee' | 'chargeback'
  accountType: 'buyer' | 'seller' | 'platform'
  accountId: string
  debit?: number
  credit?: number
  description: string
  metadata?: Record<string, any>
}

/**
 * Record a double-entry ledger entry
 * Every transaction must balance: debit + credit entries must sum to 0
 */
export async function recordLedgerEntry(input: LedgerEntryInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return { error: 'Unauthorized', status: 401 }
    }

    const entryId = `ledger_${Date.now()}`

    await db.insert(ledgerEntries).values({
      id: entryId,
      txnId: input.txnId,
      txnType: input.txnType,
      accountType: input.accountType,
      accountId: input.accountId,
      debit: input.debit ? input.debit.toString() : '0',
      credit: input.credit ? input.credit.toString() : '0',
      description: input.description,
      metadata: input.metadata,
    })

    return { success: true, data: { id: entryId } }
  } catch (error) {
    console.error('[v0] Record ledger entry error:', error)
    return { error: 'Failed to record ledger entry', status: 500 }
  }
}

/**
 * Get seller's ledger for a period
 */
export async function getSellerLedger(
  sellerId: string,
  startDate?: Date,
  endDate?: Date
) {
  try {
    const whereConditions = [eq(ledgerEntries.accountId, sellerId)]

    if (startDate) {
      whereConditions.push(
        sql`${ledgerEntries.createdAt} >= ${startDate}` as any
      )
    }

    if (endDate) {
      whereConditions.push(sql`${ledgerEntries.createdAt} < ${endDate}` as any)
    }

    const entries = (await db
      .select()
      .from(ledgerEntries)
      .where(and(...(whereConditions as any)))) as any[]

    let totalDebits = 0
    let totalCredits = 0

    entries.forEach((entry: any) => {
      totalDebits += parseFloat(entry.debit || '0')
      totalCredits += parseFloat(entry.credit || '0')
    })

    return {
      success: true,
      data: { entries, totalDebits, totalCredits, balance: totalCredits - totalDebits },
    }
  } catch (error) {
    console.error('[v0] Get seller ledger error:', error)
    return { error: 'Failed to fetch ledger', status: 500 }
  }
}

/**
 * Calculate seller payout for a period (monthly)
 */
export async function calculateMonthlyPayout(
  sellerId: string,
  period: string // 'YYYY-MM'
) {
  try {
    const seller = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.id, sellerId))
      .limit(1)

    if (!seller.length) {
      return { error: 'Seller not found', status: 404 }
    }

    const [startDate, endDate] = getPeriodDateRange(period)

    // Sum sales for the period
    const salesResult = (await db
      .select({
        total: sql<string>`COALESCE(SUM(${ledgerEntries.credit}), '0')`,
      })
      .from(ledgerEntries)
      .where(
        and(
          eq(ledgerEntries.accountType, 'seller'),
          eq(ledgerEntries.accountId, sellerId),
          eq(ledgerEntries.txnType, 'sale'),
          sql`${ledgerEntries.createdAt} >= ${startDate}`,
          sql`${ledgerEntries.createdAt} < ${endDate}`
        )
      )) as any[]

    const totalSales = parseFloat(salesResult[0]?.total || '0')
    const commissionPercent = parseFloat(seller[0].commissionPercent || '10') / 100
    const commissionDue = totalSales * commissionPercent
    const listingFees = parseFloat(seller[0].monthlyListingFee || '0')
    const transactionFees = parseFloat(seller[0].flatTransactionFee || '0')

    // Get chargebacks
    const chargebackResult = (await db
      .select({
        total: sql<string>`COALESCE(SUM(${ledgerEntries.debit}), '0')`,
      })
      .from(ledgerEntries)
      .where(
        and(
          eq(ledgerEntries.accountType, 'seller'),
          eq(ledgerEntries.accountId, sellerId),
          eq(ledgerEntries.txnType, 'chargeback'),
          sql`${ledgerEntries.createdAt} >= ${startDate}`,
          sql`${ledgerEntries.createdAt} < ${endDate}`
        )
      )) as any[]

    const chargebacks = parseFloat(chargebackResult[0]?.total || '0')

    const netPayout = totalSales - (commissionDue + listingFees + transactionFees + chargebacks)

    // Create payout record
    const payoutId = `payout_${Date.now()}`
    await db.insert(payoutRecords).values({
      id: payoutId,
      sellerId,
      period,
      totalSales: totalSales.toString(),
      commissionDue: commissionDue.toString(),
      listingFees: listingFees.toString(),
      transactionFees: transactionFees.toString(),
      chargebacks: chargebacks.toString(),
      adjustments: '0',
      netPayout: netPayout.toString(),
      payoutStatus: 'pending',
    })

    return {
      success: true,
      data: {
        payoutId,
        period,
        totalSales,
        commissionDue,
        listingFees,
        transactionFees,
        chargebacks,
        netPayout,
      },
    }
  } catch (error) {
    console.error('[v0] Calculate monthly payout error:', error)
    return { error: 'Failed to calculate payout', status: 500 }
  }
}

/**
 * Get all payouts for a seller
 */
export async function getSellerPayouts(sellerId: string) {
  try {
    const payouts = (await db
      .select()
      .from(payoutRecords)
      .where(eq(payoutRecords.sellerId, sellerId))
      .orderBy(sql`${payoutRecords.period} DESC`)) as any[]

    return { success: true, data: payouts }
  } catch (error) {
    console.error('[v0] Get seller payouts error:', error)
    return { error: 'Failed to fetch payouts', status: 500 }
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
