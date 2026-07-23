import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { sendEmail, supportTicketCreatedEmail } from '@/lib/services/email'

// Mock database for demo
const TICKETS: any[] = []

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const body = await request.json()
    const { subject, category, priority, description } = body

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ticketId = uuidv4()
    const ticketNumber = `TKT-${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0')}`

    const ticket = {
      id: ticketId,
      ticketNumber,
      userId: session.user.id,
      subject,
      category,
      priority,
      description,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    TICKETS.push(ticket)

    // Send confirmation email
    await sendEmail(
      session.user.email || '',
      supportTicketCreatedEmail(session.user.name || 'Customer', ticketNumber, subject)
    )

    return Response.json({
      ticketNumber,
      ticketId,
      message: 'Support ticket created successfully',
    })
  } catch (error) {
    console.error('[v0] Support ticket error:', error)
    return Response.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}
