import { db } from '@/lib/db'
import { paymentGateways } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export const VALID_TYPES = ['card', 'wallet', 'bank', 'link', 'offline']

/**
 * GET /api/payment-gateways
 * Public: list configured payment gateways/methods (used by checkout).
 * Only customer-facing, non-secret fields are returned publicly (name, type,
 * description, hosted payment link, instructions). Admins (valid admin
 * session) additionally see merchant config (API key/merchant id — never
 * actual secrets, which always live in Vercel project environment variables,
 * not this table) and the list of env var names each gateway depends on.
 */
export async function GET() {
  try {
    const session = await getAdminSession()
    const isAdmin = Boolean(session)

    const rows = await db
      .select()
      .from(paymentGateways)
      .orderBy(asc(paymentGateways.sortOrder))

    const gateways = rows.map((row) => {
      const config = (row.config && typeof row.config === 'object' ? row.config : {}) as Record<
        string,
        unknown
      >
      if (isAdmin) {
        return row
      }
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        type: row.type,
        description: row.description,
        logo: row.logo,
        isEnabled: row.isEnabled,
        isDefault: row.isDefault,
        sortOrder: row.sortOrder,
        paymentLink: row.paymentLink,
        instructions: row.instructions,
        config: { apiKey: typeof config.apiKey === 'string' ? config.apiKey : undefined },
      }
    })

    return NextResponse.json({ gateways })
  } catch (error) {
    console.error('[v0] Payment gateways list error:', error)
    return NextResponse.json({ error: 'Failed to fetch payment gateways' }, { status: 500 })
  }
}

/**
 * POST /api/payment-gateways
 * Admin-only: add a new payment gateway/method to the dashboard, optionally
 * with its (non-secret) merchant config, a hosted payment link, customer
 * instructions, and the env var names its secrets should be configured
 * under (in the project's environment variables — never in this table).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      slug,
      type,
      description,
      logo,
      isEnabled,
      apiKey,
      merchantId,
      environment,
      paymentLink,
      instructions,
      envVarsRequired,
    } = body

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
      config: {
        apiKey: apiKey || '',
        merchantId: merchantId || '',
        environment: environment === 'production' ? 'production' : 'sandbox',
      },
      paymentLink: paymentLink || null,
      instructions: instructions || null,
      envVarsRequired: Array.isArray(envVarsRequired) ? envVarsRequired : [],
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
