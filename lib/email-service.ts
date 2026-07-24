/**
 * Email Service for AUAPW
 * Handles sending conversation archives and support emails
 */

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function sendConversationToSupport(
  customerEmail: string,
  conversationHistory: ConversationMessage[],
  supportEmail: string = process.env.AUAPW_SUPPORT_EMAIL || 'support@auapw.com'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Format conversation for email
    const formattedConversation = conversationHistory
      .map((msg) => {
        const sender = msg.role === 'user' ? 'Customer' : 'AUAPW Bot'
        return `[${sender}]: ${msg.content}`
      })
      .join('\n\n')

    const emailContent = `
CUSTOMER CONVERSATION ARCHIVE
════════════════════════════════════════

Customer Email: ${customerEmail}
Date: ${new Date().toISOString()}
Conversation ID: ${generateConversationId()}

────────────────────────────────────────
CONVERSATION HISTORY:
────────────────────────────────────────

${formattedConversation}

════════════════════════════════════════

This conversation was initiated through the AUAPW floating chatbot.
The customer has provided their email and is ready for follow-up support.

Please reach out to the customer to continue assisting them with their needs.

════════════════════════════════════════
    `

    // Call the send-conversation API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail,
        messages: conversationHistory,
        supportEmail,
        emailContent,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return { success: true, messageId: data.messageId }
    } else {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to send email' }
    }
  } catch (error) {
    console.error('Email service error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate a unique conversation ID
 */
function generateConversationId(): string {
  return `CHAT-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Format email body for support notification
 */
export function formatSupportNotificationEmail(
  customerEmail: string,
  messageCount: number,
  topics: string[]
): string {
  return `
NEW CUSTOMER CHAT FOLLOW-UP REQUIRED
════════════════════════════════════════

Customer Email: ${customerEmail}
Messages Exchanged: ${messageCount}
Topics Discussed: ${topics.join(', ')}
Date: ${new Date().toLocaleString()}

ACTION REQUIRED:
Please review the attached conversation and reach out to this customer
to provide personalized support and assistance with their inquiry.

════════════════════════════════════════
  `
}
