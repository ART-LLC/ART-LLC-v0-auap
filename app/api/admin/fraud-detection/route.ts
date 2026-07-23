import { NextRequest, NextResponse } from 'next/server'

interface FraudCheckRequest {
  orderId: string
  amount: number
  email: string
  cardCountry: string
  cardType: string
  billingAddress: string
  shippingAddress: string
  ipCountry?: string
  deviceFingerprint?: string
}

interface FraudFlag {
  code: string
  severity: 'low' | 'medium' | 'high'
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const data: FraudCheckRequest = await request.json()

    const flags: FraudFlag[] = []
    let score = 0

    // Check 1: High-value order
    if (data.amount > 5000) {
      flags.push({
        code: 'HIGH_VALUE_ORDER',
        severity: 'medium',
        description: 'Order amount exceeds $5,000',
      })
      score += 15
    }

    // Check 2: Billing-shipping mismatch
    if (
      data.billingAddress &&
      data.shippingAddress &&
      data.billingAddress !== data.shippingAddress
    ) {
      flags.push({
        code: 'ADDRESS_MISMATCH',
        severity: 'medium',
        description: 'Billing and shipping addresses differ',
      })
      score += 10
    }

    // Check 3: International card
    if (data.cardCountry && data.cardCountry !== 'US') {
      flags.push({
        code: 'INTERNATIONAL_CARD',
        severity: 'low',
        description: `Card issued in ${data.cardCountry}`,
      })
      score += 5
    }

    // Check 4: Country mismatch (card vs IP)
    if (data.cardCountry && data.ipCountry && data.cardCountry !== data.ipCountry) {
      flags.push({
        code: 'IP_CARD_MISMATCH',
        severity: 'medium',
        description: `Card from ${data.cardCountry}, IP from ${data.ipCountry}`,
      })
      score += 20
    }

    // Check 5: Multiple rapid orders from same email
    // This would require database query in production
    // For now, we'll skip this check

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (score >= 50) riskLevel = 'high'
    else if (score >= 25) riskLevel = 'medium'

    return NextResponse.json({
      orderId: data.orderId,
      score: Math.min(100, score),
      riskLevel,
      flags,
      approved: score < 50,
      recommendedAction: score >= 50 ? 'review' : score >= 25 ? 'monitor' : 'approve',
    })
  } catch (error) {
    console.error('[v0] Fraud detection error:', error)
    return NextResponse.json(
      { error: 'Fraud detection failed' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve fraud assessment for an order
export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      )
    }

    // Mock response for demo
    return NextResponse.json({
      orderId,
      score: 35,
      riskLevel: 'medium',
      flags: [
        {
          code: 'ADDRESS_MISMATCH',
          severity: 'medium',
          description: 'Billing and shipping addresses differ',
        },
        {
          code: 'INTERNATIONAL_CARD',
          severity: 'low',
          description: 'Card issued in CA',
        },
      ],
      reviewStatus: 'pending',
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Fraud retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve fraud assessment' },
      { status: 500 }
    )
  }
}
