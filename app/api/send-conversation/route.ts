import { NextRequest, NextResponse } from 'next/server'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  email: string
  messages: ConversationMessage[]
  supportEmail?: string
  emailContent?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()
    const { email, messages, supportEmail = process.env.AUAPW_SUPPORT_EMAIL || 'support@auapw.com' } = body

    if (!email || !messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Email and messages are required' },
        { status: 400 }
      )
    }

    // Log the conversation for now (in production, use email service)
    console.log(`[CONVERSATION ARCHIVE]
      Customer: ${email}
      Messages: ${messages.length}
      Timestamp: ${new Date().toISOString()}
      Support Email: ${supportEmail}
    `)

    // Format the conversation for logging/storage
    const formattedConversation = messages
      .map((msg, idx) => `${idx + 1}. [${msg.role.toUpperCase()}]: ${msg.content}`)
      .join('\n\n')

    console.log(`\n--- FULL CONVERSATION ---\n${formattedConversation}\n--- END ---\n`)

    // In production, you would:
    // 1. Use a service like SendGrid, Resend, or AWS SES to send email
    // 2. Store the conversation in a database
    // 3. Create a ticket or support case
    // 4. Send confirmation email to customer

    // For now, return success
    return NextResponse.json({
      success: true,
      messageId: `msg-${Date.now()}`,
      email,
      messageCount: messages.length,
      message: 'Conversation archived successfully. Support team will follow up soon.',
    })
  } catch (error) {
    console.error('Send conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    )
  }
}
