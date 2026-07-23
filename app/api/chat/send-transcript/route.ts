import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

interface TranscriptRequest {
  customerEmail: string
  messages: ChatMessage[]
  sessionDuration?: number
}

// Configure email transporter (using SendGrid or SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY || '',
  },
})

function formatChatTranscript(messages: ChatMessage[]): string {
  const lines = messages
    .map((msg) => {
      const role = msg.role === 'user' ? 'Customer' : 'AUAPW Support'
      const content = msg.content.replace(/\n/g, '\n  ')
      return `${role}:\n  ${content}`
    })
    .join('\n\n')

  return lines
}

function generateHTMLTranscript(
  customerEmail: string,
  messages: ChatMessage[],
  sessionDuration?: number
): string {
  const messagesHTML = messages
    .map((msg) => {
      const role = msg.role === 'user' ? 'Customer' : 'AUAPW Support'
      const bgColor = msg.role === 'user' ? '#e8f0ff' : '#f0f0f0'
      return `
        <div style="margin: 12px 0; padding: 12px; background-color: ${bgColor}; border-radius: 6px; border-left: 4px solid ${msg.role === 'user' ? '#2a4fa8' : '#999'};">
          <strong>${role}</strong>
          <p style="margin: 8px 0; color: #333;">${msg.content}</p>
        </div>
      `
    })
    .join('')

  const duration = sessionDuration ? `${Math.round(sessionDuration / 1000)} seconds` : 'N/A'

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2a4fa8 0%, #1a3580 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 8px 0 0; opacity: 0.9; }
          .info { background: #f9f9f9; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; }
          .info p { margin: 4px 0; }
          .transcript { margin: 20px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Chat Transcript - AUAPW Automotive Support</h1>
            <p>Thank you for chatting with our support team</p>
          </div>

          <div class="info">
            <p><strong>Customer Email:</strong> ${customerEmail}</p>
            <p><strong>Session Duration:</strong> ${duration}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Messages:</strong> ${messages.length}</p>
          </div>

          <div class="transcript">
            <h2 style="margin-top: 0;">Chat History</h2>
            ${messagesHTML}
          </div>

          <div class="footer">
            <p>If you have any questions about this chat or need further assistance, please contact us at support@auapw.com or call (888) 818-5001.</p>
            <p>&copy; ${new Date().getFullYear()} AUAPW LLC. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body: TranscriptRequest = await request.json()

    if (!body.customerEmail || !body.messages || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: customerEmail and messages' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.customerEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const plainTextTranscript = formatChatTranscript(body.messages)
    const htmlTranscript = generateHTMLTranscript(body.customerEmail, body.messages, body.sessionDuration)

    // Send to customer
    await transporter.sendMail({
      from: 'support@auapw.com',
      to: body.customerEmail,
      subject: 'Your AUAPW Support Chat Transcript',
      html: htmlTranscript,
      text: plainTextTranscript,
      replyTo: 'support@auapw.com',
    })

    // Send to support team
    const supportHTML = htmlTranscript.replace(
      'Thank you for chatting with our support team',
      'New Chat Session Transcript - Please Review'
    )

    await transporter.sendMail({
      from: 'support@auapw.com',
      to: 'support@auapw.com',
      subject: `Chat Transcript - Customer: ${body.customerEmail}`,
      html: supportHTML,
      text: `New chat transcript from ${body.customerEmail}\n\n${plainTextTranscript}`,
      replyTo: body.customerEmail,
    })

    return NextResponse.json({
      success: true,
      message: 'Chat transcript sent successfully to both customer and support team',
    })
  } catch (error) {
    console.error('[v0] Chat transcript email error:', error)
    return NextResponse.json(
      { error: 'Failed to send chat transcript' },
      { status: 500 }
    )
  }
}
