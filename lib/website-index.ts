// Website content indexing for RAG chatbot
// Stores website pages for retrieval and semantic search

export interface IndexedPage {
  id: string
  url: string
  title: string
  content: string
  description?: string
  keywords?: string[]
  lastIndexed: Date
}

class WebsiteIndexer {
  private pages: Map<string, IndexedPage> = new Map()

  // Hardcoded website index based on AUAPW content
  initializeDefaultIndex() {
    const defaultPages: IndexedPage[] = [
      {
        id: 'home',
        url: '/',
        title: 'AUAPW LLC - Quality Used Auto Parts',
        content: `AUAPW LLC is your trusted source for quality used auto parts. We specialize in engines, transmissions, body parts, and more from 2,000+ verified salvage yards nationwide. We offer $240 flat-rate shipping per part and a 6-month warranty on all purchases. Our VIN search makes it easy to find the exact part for your vehicle.`,
        description: 'Buy quality used auto parts from AUAPW LLC',
        keywords: ['used auto parts', 'engines', 'transmissions', 'salvage', 'shipping'],
        lastIndexed: new Date(),
      },
      {
        id: 'about',
        url: '/about',
        title: 'About AUAPW LLC',
        content: `AUAPW LLC has been serving customers since our founding. We work with over 2,000 certified salvage yards across the United States to bring you the best selection of quality used auto parts. Our mission is to provide affordable, reliable parts with exceptional customer service.`,
        description: 'Learn about AUAPW LLC',
        keywords: ['about', 'history', 'mission', 'certified'],
        lastIndexed: new Date(),
      },
      {
        id: 'used-parts',
        url: '/parts',
        title: 'Used Auto Parts - AUAPW LLC',
        content: `Browse our extensive catalog of used auto parts including engines, transmissions, starters, alternators, suspension components, and more. All parts are sourced from verified salvage yards and tested for quality. Each part comes with a 6-month warranty.`,
        description: 'Shop used auto parts',
        keywords: ['parts', 'engines', 'transmissions', 'starters', 'alternators'],
        lastIndexed: new Date(),
      },
      {
        id: 'engines',
        url: '/used-engines',
        title: 'Used Auto Engines - AUAPW LLC',
        content: `Our used engines are sourced from quality salvage yards and come with a 6-month warranty. We offer engines for all makes and models. Our VIN search tool helps you find the perfect engine for your vehicle. Shipping is available nationwide.`,
        description: 'Buy used auto engines',
        keywords: ['engines', 'used engines', 'car engines', 'engine replacement'],
        lastIndexed: new Date(),
      },
      {
        id: 'transmissions',
        url: '/used-transmissions',
        title: 'Used Auto Transmissions - AUAPW LLC',
        content: `Quality used transmissions for all vehicles. AUAPW offers tested and inspected used transmissions with a 6-month warranty. Find your transmission using our VIN search. Fast shipping available to all 50 states.`,
        description: 'Buy used auto transmissions',
        keywords: ['transmissions', 'used transmissions', 'gearbox', 'automatic', 'manual'],
        lastIndexed: new Date(),
      },
      {
        id: 'vin-search',
        url: '/search',
        title: 'VIN Search - Find Your Parts',
        content: `Use our advanced VIN search tool to find the exact parts for your vehicle. Simply enter your vehicle identification number and browse compatible parts. Our search returns results from our network of 2,000+ salvage yards.`,
        description: 'Search parts by VIN',
        keywords: ['VIN search', 'vehicle identification', 'parts search'],
        lastIndexed: new Date(),
      },
      {
        id: 'chat',
        url: '/chat',
        title: 'Live Chat Support - AUAPW LLC',
        content: `Chat with our customer service team for questions about parts, pricing, shipping, or warranty. Available during business hours. Call (888) 854-8681 for immediate assistance.`,
        description: 'Chat with customer support',
        keywords: ['chat', 'support', 'help', 'customer service'],
        lastIndexed: new Date(),
      },
      {
        id: 'contact',
        url: '/contact',
        title: 'Contact AUAPW LLC',
        content: `Contact AUAPW LLC at (888) 854-8681 for customer support. Email: aupworld@gmail.com. Hours: Monday-Friday 9AM-5PM EST. We respond to inquiries within 24 hours.`,
        description: 'Contact us',
        keywords: ['contact', 'phone', 'email', 'support'],
        lastIndexed: new Date(),
      },
      {
        id: 'shipping',
        url: '/shipping',
        title: 'Shipping & Warranty - AUAPW LLC',
        content: `AUAPW offers flat-rate shipping of $240 per part nationwide. All parts come with a 6-month warranty covering defects. Free returns within 30 days if not satisfied. We ship to all 50 states.`,
        description: 'Shipping and warranty information',
        keywords: ['shipping', 'warranty', 'returns', 'guarantee'],
        lastIndexed: new Date(),
      },
      {
        id: 'quote',
        url: '/quote',
        title: 'Get a Quote - AUAPW LLC',
        content: `Request a quote for your specific parts needs. Fill out our form with vehicle information and part requirements. We will respond with pricing and availability within 24 hours.`,
        description: 'Request a quote',
        keywords: ['quote', 'pricing', 'estimate'],
        lastIndexed: new Date(),
      },
    ]

    defaultPages.forEach(page => {
      this.pages.set(page.id, page)
    })
  }

  getPages(): IndexedPage[] {
    return Array.from(this.pages.values())
  }

  searchPages(query: string): IndexedPage[] {
    const lowerQuery = query.toLowerCase()
    return this.getPages().filter(page => {
      const content = `${page.title} ${page.content} ${page.keywords?.join(' ')}`.toLowerCase()
      return content.includes(lowerQuery)
    })
  }

  getPageByUrl(url: string): IndexedPage | undefined {
    return Array.from(this.pages.values()).find(p => p.url === url)
  }

  addPage(page: IndexedPage) {
    this.pages.set(page.id, page)
  }
}

// Singleton instance
let indexer: WebsiteIndexer | null = null

export function getWebsiteIndexer(): WebsiteIndexer {
  if (!indexer) {
    indexer = new WebsiteIndexer()
    indexer.initializeDefaultIndex()
  }
  return indexer
}
