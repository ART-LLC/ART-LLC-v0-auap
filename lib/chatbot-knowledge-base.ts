/**
 * AUAPW Website Knowledge Base
 * Complete indexed data for chatbot responses with direct links
 */

export interface PageInfo {
  title: string
  path: string
  description: string
  keywords: string[]
  icon?: string
}

export const WEBSITE_PAGES: PageInfo[] = [
  // Main Pages
  {
    title: 'Home',
    path: '/',
    description: 'AUAPW homepage with brand messaging, trust metrics (2,000+ verified yards, 30-180 day warranty), and industry-leading platform info',
    keywords: ['home', 'homepage', 'main', 'brand', 'welcome', 'auapw', 'trusted partner', 'oem parts'],
  },
  {
    title: 'Products Catalog',
    path: '/products',
    description: 'Browse 8,000+ OEM used auto parts including engines, transmissions, suspension, electrical components with pricing and warranty',
    keywords: ['products', 'catalog', 'parts', 'browse', 'search', 'engines', 'transmissions', 'components', 'sku', 'price'],
  },
  {
    title: 'Checkout & Cart',
    path: '/checkout',
    description: 'Secure checkout with Stripe payments, shipping options, order confirmation, and payment processing',
    keywords: ['checkout', 'cart', 'payment', 'order', 'stripe', 'shipping', 'buy', 'purchase'],
  },
  {
    title: 'Customer Dashboard',
    path: '/dashboard',
    description: 'Personalized dashboard to view orders, saved vehicles, wishlist, invoices, and account profile settings',
    keywords: ['dashboard', 'account', 'orders', 'vehicles', 'wishlist', 'invoices', 'profile', 'my account'],
  },
  {
    title: 'Support & Help',
    path: '/support',
    description: 'Submit support tickets, view FAQ, chat with automotive experts, and get help with part selection and installation',
    keywords: ['support', 'help', 'contact', 'ticket', 'faq', 'question', 'assistance', 'chat', 'expert'],
  },
  {
    title: 'Wishlist',
    path: '/wishlist',
    description: 'Save favorite parts, compare products, and track price changes on your saved items',
    keywords: ['wishlist', 'saved', 'favorites', 'bookmarked', 'tracking', 'compare', 'watch'],
  },
  {
    title: 'Returns & Refunds',
    path: '/returns',
    description: '30-day return policy, free return shipping on orders over $500, hassle-free refund process',
    keywords: ['returns', 'refund', 'return policy', '30-day', 'free shipping', 'money back', 'exchange'],
  },
  {
    title: 'Warranty Registration',
    path: '/warranty',
    description: 'Register warranty, view coverage details, track warranty status, submit claims, and view warranty terms',
    keywords: ['warranty', 'registration', 'coverage', 'claim', '30-180 days', 'protection', 'extended warranty'],
  },
  {
    title: 'Chat with Expert',
    path: '/chat',
    description: 'Real-time chat with automotive chatbot expert for part recommendations, compatibility questions, pricing, and shipping',
    keywords: ['chat', 'chatbot', 'expert', 'help', 'ask', 'question', 'recommendation', 'compatibility'],
  },
  {
    title: 'VIN Decoder',
    path: '/products',
    description: 'Decode your Vehicle Identification Number (VIN) to find compatible OEM parts for your specific vehicle year, make, and model',
    keywords: ['vin', 'vin decoder', 'vehicle identification', 'decode', 'compatibility', 'vehicle', 'year', 'make', 'model', 'fitment'],
  },
  {
    title: 'Admin Dashboard',
    path: '/admin/dashboard',
    description: 'Real-time KPI metrics, order monitoring, fraud detection, and performance analytics for business operations',
    keywords: ['admin', 'dashboard', 'metrics', 'analytics', 'orders', 'fraud', 'kpi'],
  },

  // Product Categories (Subcategory pages)
  {
    title: 'Engines',
    path: '/products?category=Engines',
    description: 'Browse complete engines: Honda, Ford, Toyota, and more. 2.4L, 1.8L, 4.0L engines with full warranty',
    keywords: ['engines', 'motor', 'complete engine', 'v4', 'v6', 'displacement', 'horsepower'],
  },
  {
    title: 'Transmissions',
    path: '/products?category=Transmissions',
    description: 'Automatic and manual transmissions: 5-speed, 6-speed, torque converter models with full testing',
    keywords: ['transmission', 'gearbox', 'automatic', 'manual', '5-speed', '6-speed', 'torque converter'],
  },
  {
    title: 'Suspension & Steering',
    path: '/products?category=Suspension & Steering',
    description: 'Struts, axles, control arms, steering components for safe handling and smooth ride',
    keywords: ['suspension', 'steering', 'strut', 'axle', 'coil spring', 'control arm', 'steering rack'],
  },
  {
    title: 'Electrical & Sensors',
    path: '/products?category=Electrical & Sensors',
    description: 'Alternators, starters, sensors, and electrical components with full functionality testing',
    keywords: ['electrical', 'alternator', 'starter', 'sensor', 'battery', 'wiring', 'electronics'],
  },
]

export const COMPANY_INFO = {
  name: 'AUAPW LLC',
  tagline: 'All Used Auto Parts Warehouse',
  description: 'America\'s Trusted OEM Used Auto Parts Marketplace',
  phone: '(888) 818-5001',
  email: 'support@auapw.com',
  hours: '24/7 Support',
  coverage: '50 States Covered',
  warranty: '30-180 Day Warranty',
  responseTime: '24hr Response Time',
  verifiedYards: '2,000+',
}

export const FAQ_ITEMS = [
  {
    question: 'How long is the warranty?',
    answer: 'We offer 30-180 day warranty depending on the part. Most engines come with 180-day warranty, transmissions with 90-day warranty. Register your warranty at /warranty to activate coverage.',
    link: '/warranty',
  },
  {
    question: 'What is your return policy?',
    answer: 'We have a 30-day money-back guarantee. Free return shipping on orders over $500. View full details and submit returns at /returns',
    link: '/returns',
  },
  {
    question: 'How long does shipping take?',
    answer: '24-hour response time on all inquiries. Standard shipping takes 3-5 business days. Express shipping available. Contact support for specific orders.',
    link: '/support',
  },
  {
    question: 'Do you have my vehicle part?',
    answer: 'Search our catalog of 8,000+ OEM parts at /products. Use VIN decoder or browse by category. Chat with an expert at /chat for personalized recommendations.',
    link: '/products',
  },
  {
    question: 'How do I track my order?',
    answer: 'View all your orders in your customer dashboard at /dashboard. You\'ll receive tracking updates via email.',
    link: '/dashboard',
  },
  {
    question: 'Can I save parts for later?',
    answer: 'Yes! Add parts to your wishlist at /wishlist. You can compare items and track price changes.',
    link: '/wishlist',
  },
  {
    question: 'Do you accept returns?',
    answer: 'Yes! We offer a 30-day return window with free return shipping on orders over $500. Learn more at /returns',
    link: '/returns',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and secure Stripe payments at checkout.',
    link: '/checkout',
  },
  {
    question: 'How do I find parts for my vehicle using VIN?',
    answer: 'Use our VIN decoder at /products to instantly find compatible OEM parts for your exact vehicle year, make, and model. Enter your 17-character VIN and we\'ll show all matching parts.',
    link: '/products',
  },
  {
    question: 'What is a VIN and why should I decode it?',
    answer: 'VIN (Vehicle Identification Number) is a unique 17-character code for your vehicle. Decoding it helps ensure you get parts that are 100% compatible with your specific vehicle. Use our VIN decoder for accurate fitment.',
    link: '/products',
  },
]

export const FEATURES = [
  {
    title: '2,000+ Verified Yards',
    description: 'Access to largest network of verified auto yards across USA',
    keywords: ['verified', 'yards', 'network', 'suppliers'],
  },
  {
    title: '30-180 Day Warranty',
    description: 'Comprehensive warranty coverage on all parts',
    keywords: ['warranty', 'coverage', 'protection'],
  },
  {
    title: '24hr Response Time',
    description: 'Expert support available around the clock',
    keywords: ['support', 'chat', 'expert', 'help', '24/7'],
  },
  {
    title: '50 States Coverage',
    description: 'Serving customers nationwide with fast shipping',
    keywords: ['shipping', 'nationwide', 'coverage', 'delivery'],
  },
  {
    title: 'OEM Quality Parts',
    description: 'Authentic original equipment manufacturer used parts',
    keywords: ['oem', 'quality', 'authentic', 'original'],
  },
  {
    title: 'Free Return Shipping',
    description: 'Hassle-free returns with free shipping on orders over $500',
    keywords: ['returns', 'free shipping', 'refund', 'exchange'],
  },
]

/**
 * Search the knowledge base by keywords
 * Returns matching pages with relevance score
 */
export function searchKnowledgeBase(query: string): Array<PageInfo & { relevance: number }> {
  const queryLower = query.toLowerCase()
  const results = WEBSITE_PAGES.map((page) => {
    let relevance = 0

    // Title match (highest priority)
    if (page.title.toLowerCase().includes(queryLower)) relevance += 10

    // Path match
    if (page.path.toLowerCase().includes(queryLower)) relevance += 8

    // Description match
    if (page.description.toLowerCase().includes(queryLower)) relevance += 5

    // Keywords match
    const matchedKeywords = page.keywords.filter((k) => k.toLowerCase().includes(queryLower))
    relevance += matchedKeywords.length * 3

    return { ...page, relevance }
  }).filter((r) => r.relevance > 0)

  // Sort by relevance score descending
  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 5)
}

/**
 * Get related links for a topic
 */
export function getRelatedLinks(topic: string): PageInfo[] {
  const results = searchKnowledgeBase(topic)
  return results.map(({ relevance, ...page }) => page)
}
