import { NextRequest, NextResponse } from 'next/server'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  email: string
  messages: ConversationMessage[]
  supportEmail?: string
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

    // Archive the conversation
    console.log(`[CONVERSATION ARCHIVE]
Customer: ${email}
Messages: ${messages.length}
Timestamp: ${new Date().toISOString()}
Support Email: ${supportEmail}`)

    // Format the conversation for email
    const formattedConversation = messages
      .map((msg, idx) => `${idx + 1}. [${msg.role.toUpperCase()}]: ${msg.content}`)
      .join('\n\n')

    console.log(`\n--- FULL CONVERSATION ---\n${formattedConversation}\n--- END ---\n`)

    // Build HTML email
    const conversationHtml = messages
      .map(
        (msg) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; vertical-align: top; width: 100px;">
            <strong style="color: ${msg.role === 'user' ? '#0066cc' : '#059669'};">${
              msg.role === 'user' ? 'Customer' : 'Support'
            }</strong>
          </td>
          <td style="padding: 12px; vertical-align: top;">
            <p style="margin: 0; color: #1f2937;">${msg.content}</p>
          </td>
        </tr>
      `
      )
      .join('')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Chat Conversation Received</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">From: ${email}</p>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Date: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="content">
              <h2 style="color: #0066cc; margin-top: 0;">Conversation History</h2>
              
              <table>
                ${conversationHtml}
              </table>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              
              <h3 style="color: #0066cc;">Customer Information</h3>
              <p><strong>Email Address:</strong> <a href="mailto:${email}" style="color: #0066cc;">${email}</a></p>
              <p><strong>Total Messages:</strong> ${messages.length}</p>
              <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
              
              <div style="background: #e8f1fd; padding: 16px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #0066cc;">
                <p style="margin: 0; color: #0066cc;"><strong>Action Required:</strong> Please review this conversation and follow up with the customer to provide further assistance or next steps.</p>
              </div>
              
              <a href="mailto:${email}" class="button" style="margin-top: 20px;">Reply to Customer</a>
            </div>
            
            <div class="footer">
              <p>© 2024 AUAPW LLC - Quality Used Auto Parts</p>
              <p><a href="https://auapw.com" style="color: #0066cc; text-decoration: none;">Visit AUAPW.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `

    // Try to send with Resend if API key exists
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'noreply@auapw.com',
            to: supportEmail,
            replyTo: email,
            subject: `New Chat Conversation from ${email}`,
            html: emailHtml,
          }),
        })

        if (!response.ok) {
          console.error('Resend API error:', await response.text())
        }
      } catch (resendError) {
        console.error('Resend send failed, conversation archived:', resendError)
      }
    }

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
