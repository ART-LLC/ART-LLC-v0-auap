import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, description, priority, category } = await request.json()

    const ticketId = `ticket_${uuidv4()}`
    const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`

    // Mock ticket creation
    const ticket = {
      id: ticketId,
      ticketNumber,
      userId: session.user.id,
      subject,
      description,
      priority: priority || 'medium',
      status: 'open',
      category: category || 'general',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // In production, save to database and trigger Teams notification
    console.log('[v0] Support ticket created:', ticket)

    return NextResponse.json({
      success: true,
      ticket,
      message: `Support ticket ${ticketNumber} created successfully`,
    })
  } catch (error) {
    console.error('[v0] Ticket creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock tickets list
    const tickets = [
      {
        id: 'ticket_1',
        ticketNumber: 'TKT-20260724001',
        subject: 'Question about warranty',
        status: 'open',
        priority: 'low',
        category: 'warranty',
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: 'ticket_2',
        ticketNumber: 'TKT-20260724002',
        subject: 'Order tracking issue',
        status: 'closed',
        priority: 'medium',
        category: 'order',
        createdAt: new Date(Date.now() - 172800000),
      },
    ]

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('[v0] Ticket retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve tickets' },
      { status: 500 }
    )
  }
}
