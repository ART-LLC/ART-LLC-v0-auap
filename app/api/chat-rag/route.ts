import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { getWebsiteIndexer } from '@/lib/website-index'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('No messages provided', { status: 400 })
    }

    const lastUserMessage = messages[messages.length - 1].content

    // Get website index
    const indexer = getWebsiteIndexer()
    const relevantPages = indexer.searchPages(lastUserMessage)

    // Build context from relevant website pages
    let contextMarkdown = ''
    if (relevantPages.length > 0) {
      contextMarkdown = `Here is relevant information from the AUAPW website:\n\n`
      relevantPages.slice(0, 5).forEach(page => {
        contextMarkdown += `**${page.title}** (${page.url})\n${page.content}\n\n`
      })
    } else {
      contextMarkdown = `No specific website content found. Provide helpful information about AUAPW LLC based on general knowledge.`
    }

    // Create system prompt for RAG
    const systemPrompt = `You are a helpful customer support chatbot for AUAPW LLC, a used auto parts supplier. You have access to website content below.

${contextMarkdown}

Guidelines:
- Be helpful and friendly
- Answer questions about AUAPW products and services
- Reference website content when relevant
- For questions not covered by website content, provide general auto parts guidance
- Always be honest if you don't have information
- Mention the phone number (888) 854-8681 for complex inquiries
- Keep responses concise and clear`

    // Stream response using AI SDK
    const result = streamText({
      model: google('gemini-2.0-flash-exp'),
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
    })

    // Return the stream response
    return (await result).toAIStreamResponse()
  } catch (error) {
    console.error('[RAG Chat Error]', error)
    return new Response('Failed to process chat request', { status: 500 })
  }
}
