import {
  COMPANY_INFO,
  FAQ_ITEMS,
  getRelatedLinks,
  type PageInfo,
} from '@/lib/chatbot-knowledge-base'

export interface WidgetChatReply {
  content: string
  links: Array<{ title: string; path: string }>
}

const GREETING_PATTERN = /^(hi|hello|hey|howdy|good (morning|afternoon|evening)|help)[!.,\s]*$/i
const THANKS_PATTERN = /^(thanks|thank you|thx|awesome|great)[!.,\s]*$/i

function scoreFaq(query: string, keywords: string[]): number {
  const normalized = query.toLowerCase()
  const terms = normalized.split(/\s+/).filter((term) => term.length > 2)
  let score = 0

  for (const keyword of keywords) {
    const key = keyword.toLowerCase()
    if (normalized.includes(key)) score += key.includes(' ') ? 8 : 5
    for (const term of terms) {
      if (key === term) score += 3
      else if (key.includes(term) || term.includes(key)) score += 1
    }
  }

  return score
}

function pageLinks(pages: PageInfo[], limit = 3) {
  const seen = new Set<string>()
  return pages
    .filter((page) => {
      if (seen.has(page.path)) return false
      seen.add(page.path)
      return true
    })
    .slice(0, limit)
    .map((page) => ({ title: page.title, path: page.path }))
}

/**
 * Deterministic, website-grounded support answers for the floating widget.
 * This is deliberately independent from the full-screen AI chat stream so the
 * global support widget always works, even when an AI provider is unavailable.
 */
export function getWidgetChatReply(rawQuery: string): WidgetChatReply {
  const query = rawQuery.trim()
  const normalized = query.toLowerCase()

  if (!query || GREETING_PATTERN.test(query)) {
    return {
      content:
        "Hi! I'm the AUAPW automotive assistant. I can help you find a compatible part, decode a VIN, get a quote, or answer questions about shipping, warranty, returns, orders, and your account. What do you need?",
      links: [
        { title: 'Find Parts by VIN', path: '/ai-search' },
        { title: 'Browse Used Parts', path: '/parts' },
        { title: 'Get a Free Quote', path: '/quote' },
      ],
    }
  }

  if (THANKS_PATTERN.test(query)) {
    return {
      content: `You’re welcome! If you need anything else, ask me here or call ${COMPANY_INFO.phone}.`,
      links: [{ title: 'Contact Support', path: '/support' }],
    }
  }

  // Keep inventory requests useful without inventing stock or prices.
  const asksForInventory =
    /\b(do you have|in stock|available|availability|price|cost|buy|need|looking for)\b/i.test(query) &&
    /\b(engine|transmission|part|motor|alternator|starter|radiator|axle|brake|bumper|door|mirror|compressor|differential|exhaust)\b/i.test(query)

  if (asksForInventory) {
    const isEngine = /\b(engine|motor)\b/i.test(query)
    const isTransmission = /\b(transmission|gearbox)\b/i.test(query)
    const primaryPath = isEngine ? '/used-engines' : isTransmission ? '/used-transmissions' : '/search'
    const primaryTitle = isEngine ? 'Browse Used Engines' : isTransmission ? 'Browse Transmissions' : 'Search Inventory'

    return {
      content:
        'I can help you find it, but I won’t guess about fitment, price, or live stock. For the most accurate match, enter your 17-character VIN in our VIN search or request a free quote with the year, make, model, engine size, and part needed. Our team responds within 24 hours.',
      links: [
        { title: 'Find Exact Fit by VIN', path: '/ai-search' },
        { title: primaryTitle, path: primaryPath },
        { title: 'Get a Free Quote', path: '/quote' },
      ],
    }
  }

  const rankedFaqs = FAQ_ITEMS
    .map((faq) => ({ faq, score: scoreFaq(query, faq.keywords) }))
    .sort((a, b) => b.score - a.score)

  if (rankedFaqs[0]?.score >= 3) {
    const best = rankedFaqs[0].faq
    return {
      content: best.answer,
      links: [{ title: best.question, path: best.link }],
    }
  }

  const related = getRelatedLinks(query)
  if (related.length > 0) {
    const [best] = related
    return {
      content: `${best.description} Use the link below to go directly there. If you need a specific part and are unsure about fitment, use the VIN search or request a free quote.`,
      links: pageLinks(related),
    }
  }

  return {
    content: `I’m not certain enough to give you a reliable answer from the website. Please submit a support request or call ${COMPANY_INFO.phone}; the AUAPW team responds within 24 hours. For a part match, include your 17-character VIN.`,
    links: [
      { title: 'Contact Support', path: '/support' },
      { title: 'Find Parts by VIN', path: '/ai-search' },
      { title: 'Get a Free Quote', path: '/quote' },
    ],
  }
}
