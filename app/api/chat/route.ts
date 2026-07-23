import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
  tool,
  type UIMessage,
} from "ai"
import { z } from "zod"
import { searchCatalog, recommendParts, getCatalogFacets } from "@/lib/ai-catalog"
import { searchKnowledgeBase, COMPANY_INFO, FAQ_ITEMS, getRelatedLinks } from "@/lib/chatbot-knowledge-base"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const { models, categories } = getCatalogFacets()

const SYSTEM_PROMPT = `You are the AUAPW Parts Assistant, a friendly and knowledgeable expert for AUAPW LLC, a used auto parts marketplace.

Your job is to help customers find the right used auto parts, answer questions about fitment/compatibility, pricing, warranty, shipping, returns, and all website features.

Company Info:
- Name: ${COMPANY_INFO.name} - ${COMPANY_INFO.description}
- Phone: ${COMPANY_INFO.phone}
- Email: ${COMPANY_INFO.email}
- Coverage: ${COMPANY_INFO.coverage}
- Warranty: ${COMPANY_INFO.warranty}
- Response Time: ${COMPANY_INFO.responseTime}
- Verified Yards: ${COMPANY_INFO.verifiedYards}

Guidelines:
- ALWAYS include relevant website links in your responses (e.g., /products, /warranty, /returns, /dashboard, /chat, /support, /wishlist)
- Use the searchParts tool to look up real inventory. Never invent parts, prices, or stock.
- When a customer mentions a vehicle (year + model) and a part, search for it.
- Use recommendParts to suggest complementary parts when helpful.
- All parts include 90-day warranty minimum (engines 180-day). Shipping varies by item.
- Be concise, friendly, and always provide actionable links to relevant website pages.
- When unsure, suggest visiting /support or calling ${COMPANY_INFO.phone}.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      searchWebsite: tool({
        description:
          "Search AUAPW website knowledge base for pages, features, and information. Use this for questions about warranty, returns, shipping, account features, support, or company info.",
        inputSchema: z.object({
          query: z.string().describe("What are you looking for? e.g. 'warranty', 'returns', 'support', 'dashboard'"),
        }),
        execute: async ({ query }) => {
          const results = searchKnowledgeBase(query)
          return {
            results: results.map((r) => ({
              title: r.title,
              path: r.path,
              description: r.description,
            })),
          }
        },
      }),
      searchParts: tool({
        description:
          "Search the used auto parts catalog for parts matching a vehicle and/or part type. Use this whenever the customer asks about finding, buying, pricing, or the availability of a specific part.",
        inputSchema: z.object({
          query: z
            .string()
            .describe("Free-text description of the part, e.g. 'engine' or 'automatic transmission'"),
          model: z
            .string()
            .optional()
            .describe("Acura model to filter by, e.g. 'MDX', 'CL', 'TL'"),
          year: z.string().optional().describe("Vehicle year, e.g. '2019'"),
          category: z
            .string()
            .optional()
            .describe("Part category filter, e.g. 'engine' or 'transmission'"),
          maxPrice: z.number().optional().describe("Maximum price in USD"),
        }),
        execute: async ({ query, model, year, category, maxPrice }) => {
          const hits = searchCatalog({ query, model, year, category, maxPrice, limit: 6 })
          return {
            count: hits.length,
            parts: hits.map((h) => ({
              id: h.id,
              name: h.name,
              model: h.model,
              year: h.year,
              category: h.category,
              price: h.price,
              warranty: h.warranty,
              shipping: h.shipping,
              availability: h.availability,
              url: h.url,
            })),
          }
        },
      }),
      recommendParts: tool({
        description:
          "Given a product id, return complementary parts that customers commonly buy together with it.",
        inputSchema: z.object({
          productId: z.string().describe("The product id to base recommendations on"),
        }),
        execute: async ({ productId }) => {
          const hits = recommendParts(productId, 4)
          return {
            count: hits.length,
            parts: hits.map((h) => ({
              id: h.id,
              name: h.name,
              category: h.category,
              price: h.price,
              url: h.url,
            })),
          }
        },
      }),
    },
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
