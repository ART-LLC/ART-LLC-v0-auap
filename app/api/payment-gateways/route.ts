import { db } from '@/lib/db'
import { paymentGateways } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

const VALID_TYPES = ['card', 'wallet', 'bank', 'offline']

/**
 * GET /api/payment-gateways
 * Public: list configured payment gateways/methods (used by checkout and the
 * admin payments dashboard). No secrets are ever stored in this table.
 */
export async function GET() {
  try {
    const gateways = await db
      .select()
      .from(paymentGateways)
      .orderBy(asc(paymentGateways.sortOrder))

    return NextResponse.json({ gateways })
  } catch (error) {
    console.error('[v0] Payment gateways list error:', error)
    return NextResponse.json({ error: 'Failed to fetch payment gateways' }, { status: 500 })
  }
}

/**
 * POST /api/payment-gateways
 * Admin-only: add a new payment gateway/method to the dashboard.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, type, description, logo, isEnabled, config } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug' },
        { status: 400 }
      )
    }

    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const newGateway = {
      id: `gtw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      slug,
      type: type || 'card',
      description: description || null,
      logo: logo || null,
      isEnabled: Boolean(isEnabled),
      isDefault: false,
      sortOrder: 99,
      config: config || {},
    }

    await db.insert(paymentGateways).values(newGateway)

    return NextResponse.json({ gateway: newGateway }, { status: 201 })
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'A gateway with that slug already exists' }, { status: 400 })
    }
    console.error('[v0] Payment gateway create error:', error)
    return NextResponse.json({ error: 'Failed to create payment gateway' }, { status: 500 })
  }
}
