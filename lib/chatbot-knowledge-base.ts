/**
 * AUAPW Website Knowledge Base
 * Complete indexed data for chatbot responses with direct links.
 *
 * Every path in WEBSITE_PAGES is a REAL route that exists in the app router.
 * Facts (shipping, warranty, returns, contact) are kept in sync with the
 * actual policy pages so the chatbot never invents information.
 */

export interface PageInfo {
  title: string
  path: string
  description: string
  keywords: string[]
}

export const WEBSITE_PAGES: PageInfo[] = [
  {
    title: 'Home',
    path: '/',
    description:
      'AUAPW homepage: America\'s trusted OEM used auto parts warehouse. 2,000+ verified yards, 30-180 day warranty, $240 flat shipping per part, nationwide delivery.',
    keywords: ['home', 'homepage', 'main', 'brand', 'welcome', 'auapw', 'trusted', 'oem'],
  },
  {
    title: 'Shop',
    path: '/shop',
    description: 'Shop the full catalog of OEM used auto parts with pricing, condition, and warranty details.',
    keywords: ['shop', 'store', 'buy', 'browse', 'catalog', 'purchase'],
  },
  {
    title: 'Used Parts',
    path: '/parts',
    description:
      'Browse all used auto parts by category: engines, transmissions, drivetrain, electrical, cooling, brakes, suspension, body, and exhaust.',
    keywords: ['parts', 'used parts', 'catalog', 'browse', 'components', 'category', 'categories'],
  },
  {
    title: 'Used Engines',
    path: '/used-engines',
    description: 'OEM used engines with up to 180-day warranty. Tested, inspected, and ready to ship.',
    keywords: ['engine', 'engines', 'motor', 'used engine', 'complete engine', 'block'],
  },
  {
    title: 'Used Transmissions',
    path: '/used-transmissions',
    description: 'Automatic and manual used transmissions with 90-day warranty. Fully tested before shipping.',
    keywords: ['transmission', 'transmissions', 'gearbox', 'automatic', 'manual', 'trans'],
  },
  {
    title: 'Car Brands',
    path: '/brands',
    description: 'Find used parts by car brand and make across all major manufacturers.',
    keywords: ['brand', 'brands', 'make', 'makes', 'manufacturer', 'car brands'],
  },
  {
    title: 'All Makes',
    path: '/makes',
    description: 'Browse every vehicle make we carry parts for.',
    keywords: ['makes', 'all makes', 'manufacturer', 'vehicle make'],
  },
  {
    title: 'Inventory',
    path: '/inventory',
    description: 'Live inventory of available OEM used parts across our 2,000+ verified yard network.',
    keywords: ['inventory', 'stock', 'availability', 'in stock', 'available'],
  },
  {
    title: 'Search',
    path: '/search',
    description: 'Search the full parts catalog by keyword, part name, or vehicle.',
    keywords: ['search', 'find', 'lookup', 'keyword'],
  },
  {
    title: 'AI Part & VIN Search',
    path: '/ai-search',
    description:
      'Decode your 17-character VIN to identify your exact vehicle (year, make, model, engine, trim) and find guaranteed-fit OEM parts. Also supports natural-language part search.',
    keywords: [
      'vin', 'vin decode', 'vin decoder', 'vin decoding', 'vin lookup', 'vin search',
      'vehicle identification', 'decode vin', 'fitment', 'compatibility', 'find my part',
      'ai search', 'smart search', '17-character', 'vehicle lookup', 'which part fits',
    ],
  },
  {
    title: 'Get a Quote',
    path: '/quote',
    description: 'Request a free, no-obligation quote for the exact part you need. Fast 24-hour response.',
    keywords: ['quote', 'free quote', 'price', 'pricing', 'estimate', 'get a quote', 'request'],
  },
  {
    title: 'Compare Parts',
    path: '/comparison',
    description: 'Compare parts side by side on price, condition, warranty, and fitment.',
    keywords: ['compare', 'comparison', 'versus', 'vs', 'side by side'],
  },
  {
    title: 'Cart',
    path: '/cart',
    description: 'Your shopping cart. Review items, quantities, and $240 flat per-part shipping before checkout.',
    keywords: ['cart', 'basket', 'shopping cart', 'my cart'],
  },
  {
    title: 'Checkout',
    path: '/checkout',
    description: 'Secure checkout with Stripe. Shipping is a flat $240 per part, shown before you pay.',
    keywords: ['checkout', 'pay', 'payment', 'order', 'stripe', 'buy', 'purchase'],
  },
  {
    title: 'Wishlist',
    path: '/wishlist',
    description: 'Save favorite parts, compare products, and track items you are interested in.',
    keywords: ['wishlist', 'saved', 'favorites', 'save for later', 'watch'],
  },
  {
    title: 'Customer Dashboard',
    path: '/dashboard',
    description: 'Your account dashboard: view orders, saved vehicles, wishlist, invoices, and profile settings.',
    keywords: ['dashboard', 'account', 'orders', 'order tracking', 'track order', 'my account', 'profile', 'invoices'],
  },
  {
    title: 'Support & Help',
    path: '/support',
    description: 'Submit a support ticket, read the FAQ, and get help. Team responds within 24 hours.',
    keywords: ['support', 'help', 'contact', 'ticket', 'faq', 'question', 'assistance'],
  },
  {
    title: 'Contact',
    path: '/contact',
    description: 'Contact AUAPW by phone at (888) 818-5001 or email support@auapw.com.',
    keywords: ['contact', 'phone', 'email', 'call', 'reach', 'get in touch', 'talk to'],
  },
  {
    title: 'About Us',
    path: '/about',
    description: 'Learn about AUAPW LLC, All Used Auto Parts Warehouse, and our nationwide yard network.',
    keywords: ['about', 'about us', 'company', 'who are you', 'story'],
  },
  {
    title: 'Blog',
    path: '/blog',
    description: 'Guides, tips, and articles on used auto parts, installation, and maintenance.',
    keywords: ['blog', 'articles', 'guides', 'tips', 'news'],
  },
  {
    title: 'Warranty',
    path: '/warranty',
    description:
      'Warranty coverage and registration. Engines 180 days, transmissions 90 days, other parts 30-180 days. Covers defects and workmanship.',
    keywords: ['warranty', 'coverage', 'guarantee', 'register warranty', 'claim', 'protection', '30-180'],
  },
  {
    title: 'Return Policy',
    path: '/return-policy',
    description: '30-day return window from delivery. Parts must be unused, uninstalled, and in original packaging.',
    keywords: ['return', 'returns', 'refund', 'return policy', '30-day', 'money back', 'exchange', 'rma'],
  },
  {
    title: 'Shipping Policy',
    path: '/shipping-policy',
    description:
      'Flat $240 shipping per part. Typical delivery 7-14 working days via UPS, FedEx, and freight carriers. Tracking provided. US only.',
    keywords: ['shipping', 'delivery', 'ship', 'how long', 'tracking', 'freight', '$240', 'flat shipping'],
  },
  {
    title: 'Sign In',
    path: '/sign-in',
    description: 'Sign in to your AUAPW account to view orders, saved vehicles, and your wishlist.',
    keywords: ['sign in', 'signin', 'login', 'log in', 'account access'],
  },
  {
    title: 'Sign Up',
    path: '/sign-up',
    description: 'Create an AUAPW account to track orders, save parts, and check out faster.',
    keywords: ['sign up', 'signup', 'register', 'create account', 'join', 'new account'],
  },

  // Parts categories
  {
    title: 'Engine Parts',
    path: '/parts/engines',
    description: 'Complete engines and engine components with warranty.',
    keywords: ['engine parts', 'engines', 'motor', 'cylinder', 'head'],
  },
  {
    title: 'Transmission Parts',
    path: '/parts/transmissions',
    description: 'Automatic and manual transmissions and related parts.',
    keywords: ['transmission parts', 'gearbox', 'torque converter', 'clutch'],
  },
  {
    title: 'Drivetrain Parts',
    path: '/parts/drivetrain',
    description: 'Axles, differentials, driveshafts, and drivetrain components.',
    keywords: ['drivetrain', 'axle', 'differential', 'driveshaft', 'cv'],
  },
  {
    title: 'Electrical Parts',
    path: '/parts/electrical',
    description: 'Alternators, starters, sensors, and electrical components, tested for function.',
    keywords: ['electrical', 'alternator', 'starter', 'sensor', 'battery', 'wiring', 'ecu'],
  },
  {
    title: 'Cooling & Climate',
    path: '/parts/cooling',
    description: 'Radiators, condensers, compressors, and cooling/climate components.',
    keywords: ['cooling', 'radiator', 'ac', 'climate', 'compressor', 'condenser', 'heater'],
  },
  {
    title: 'Brakes & Safety',
    path: '/parts/brakes',
    description: 'Brake calipers, ABS modules, and safety components.',
    keywords: ['brakes', 'brake', 'caliper', 'abs', 'safety', 'rotor'],
  },
  {
    title: 'Suspension & Steering',
    path: '/parts/suspension',
    description: 'Struts, control arms, steering racks, and suspension components.',
    keywords: ['suspension', 'steering', 'strut', 'control arm', 'steering rack', 'shock'],
  },
  {
    title: 'Body & Interior',
    path: '/parts/body',
    description: 'Doors, mirrors, panels, and interior components.',
    keywords: ['body', 'interior', 'door', 'mirror', 'panel', 'bumper', 'fender'],
  },
  {
    title: 'Exhaust System',
    path: '/parts/exhaust',
    description: 'Manifolds, catalytic converters, and exhaust components.',
    keywords: ['exhaust', 'muffler', 'catalytic converter', 'manifold', 'cat'],
  },
]

export const COMPANY_INFO = {
  name: 'AUAPW LLC',
  tagline: 'All Used Auto Parts Warehouse',
  description: "America's Trusted OEM Used Auto Parts Marketplace",
  phone: '(888) 818-5001',
  phoneHref: 'tel:8888185001',
  email: 'support@auapw.com',
  hours: '24/7 Support',
  coverage: '50 States Covered',
  warranty: '30-180 Day Warranty',
  responseTime: '24hr Response Time',
  verifiedYards: '2,000+',
  flatShipping: '$240 flat shipping per part',
  deliveryWindow: '7-14 working days',
}

export const FAQ_ITEMS = [
  {
    question: 'How long is the warranty?',
    answer:
      'Warranty runs 30-180 days depending on the part. Engines come with a 180-day warranty and transmissions with a 90-day warranty. Register and view coverage at /warranty.',
    link: '/warranty',
    keywords: ['warranty', 'guarantee', 'coverage', 'how long warranty', 'protection'],
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return window from the date of delivery. Parts must be unused, uninstalled, and in original packaging with proof of purchase. Full details at /return-policy.',
    link: '/return-policy',
    keywords: ['return', 'returns', 'refund', 'money back', 'send back', 'exchange'],
  },
  {
    question: 'How much is shipping and how long does it take?',
    answer:
      'Shipping is a flat $240 per part, shown in your cart and at checkout. Typical delivery is 7-14 working days via UPS, FedEx, and freight carriers, with tracking sent by email. We ship within the US. See /shipping-policy.',
    link: '/shipping-policy',
    keywords: ['shipping', 'delivery', 'how long', 'ship', 'how much shipping', 'cost', 'tracking'],
  },
  {
    question: 'How do I find the right part for my car?',
    answer:
      'Use the VIN decoder at /ai-search. Enter your 17-character VIN to identify your exact vehicle and see guaranteed-fit OEM parts, or browse all parts at /parts. You can also request a free quote at /quote.',
    link: '/ai-search',
    keywords: ['find part', 'which part', 'fit', 'fitment', 'compatible', 'my car', 'my vehicle', 'right part'],
  },
  {
    question: 'How do I decode my VIN?',
    answer:
      'Go to /ai-search and enter your 17-character VIN (on your registration, title, insurance card, or the driver-side dashboard). We instantly identify your vehicle and show parts guaranteed to fit.',
    link: '/ai-search',
    keywords: ['vin', 'decode', 'vin decoder', 'chassis', '17 character', 'vehicle identification'],
  },
  {
    question: 'How do I track my order?',
    answer:
      'Track orders from your account dashboard at /dashboard. You will also receive tracking updates by email once your order ships.',
    link: '/dashboard',
    keywords: ['track', 'tracking', 'order status', 'where is my order', 'my order'],
  },
  {
    question: 'How do I get a price or quote?',
    answer:
      'Request a free, no-obligation quote at /quote and our team responds within 24 hours. You can also browse live pricing in the shop at /shop.',
    link: '/quote',
    keywords: ['price', 'quote', 'cost', 'how much', 'estimate', 'pricing'],
  },
  {
    question: 'How do I contact support?',
    answer:
      'Call (888) 818-5001 or email support@auapw.com. You can also submit a ticket at /support and we respond within 24 hours.',
    link: '/support',
    keywords: ['contact', 'support', 'help', 'phone', 'call', 'email', 'talk', 'human', 'representative'],
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express) through secure Stripe checkout at /checkout.',
    link: '/checkout',
    keywords: ['payment', 'pay', 'credit card', 'stripe', 'visa', 'mastercard', 'how to pay'],
  },
  {
    question: 'Do you have an account area?',
    answer:
      'Yes. Create an account at /sign-up or sign in at /sign-in, then manage everything from your dashboard at /dashboard.',
    link: '/dashboard',
    keywords: ['account', 'sign in', 'sign up', 'login', 'register', 'profile'],
  },
]

/**
 * Search the knowledge base by keywords.
 * Returns matching pages ranked by relevance score.
 */
export function searchKnowledgeBase(query: string): Array<PageInfo & { relevance: number }> {
  const queryLower = query.toLowerCase()
  const terms = queryLower.split(/\s+/).filter((t) => t.length > 1)

  const results = WEBSITE_PAGES.map((page) => {
    let relevance = 0

    if (page.title.toLowerCase().includes(queryLower)) relevance += 10
    if (page.path.toLowerCase().includes(queryLower)) relevance += 8
    if (page.description.toLowerCase().includes(queryLower)) relevance += 4

    for (const term of terms) {
      if (page.title.toLowerCase().includes(term)) relevance += 3
      if (page.description.toLowerCase().includes(term)) relevance += 1
      for (const kw of page.keywords) {
        if (kw.toLowerCase() === term) relevance += 4
        else if (kw.toLowerCase().includes(term) || term.includes(kw.toLowerCase())) relevance += 2
      }
    }

    return { ...page, relevance }
  }).filter((r) => r.relevance > 0)

  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 5)
}

/** Get related links for a topic. */
export function getRelatedLinks(topic: string): PageInfo[] {
  return searchKnowledgeBase(topic).map(({ relevance, ...page }) => page)
}
