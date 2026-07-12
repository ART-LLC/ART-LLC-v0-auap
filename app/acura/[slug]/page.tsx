'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductCardActions } from '@/components/products/product-card-actions'
import { ProductFAQ } from '@/components/products/product-faq'
import { ShippingInfo } from '@/components/products/shipping-info'
import { PartsDetails } from '@/components/products/parts-details'
import { PartsHistory } from '@/components/products/parts-history'
import { PartRecommendations } from '@/components/ai/part-recommendations'
import { getAcuraProductBySlug, getAcuraProductUrl, getRelatedAcuraProducts, resolveAcuraImage, getAcuraPartTypeLabel, getAcuraPartImageSearchUrl } from '@/lib/acura-data'
import { getAcuraPartSpecs } from '@/lib/acura-part-specs'
import { AcuraPartsSearch } from '@/components/acura/acura-parts-search'
import { MileagePriceSelector } from '@/components/acura/mileage-price-selector'
import { SeoBacklinks } from '@/components/seo-backlinks'
import { Star, ShieldCheck, Truck, BadgeCheck, ChevronRight, ImageIcon, ExternalLink } from 'lucide-react'

export default function AcuraProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = getAcuraProductBySlug(slug)
  // Price of the mileage tier the shopper selected (null = default medium tier).
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)

  if (!product) {
    notFound()
  }

  const related = getRelatedAcuraProducts(product)
  const productImage = resolveAcuraImage(product)
  // Part-specific specifications for engines/transmissions (null for other parts).
  const partSpecs = getAcuraPartSpecs(product)
  const partTypeLabel = product.category.replace(/^used\s+/i, '')
  const partTypeHeading = getAcuraPartTypeLabel(product)
  const imageSearchUrl = getAcuraPartImageSearchUrl(product)
  const fitmentYear = product.year || '1990-Present'

  // Structured data so the part URL, image, and three mileage-based price tiers
  // are indexed by search engines (Google Merchant / rich results).
  const siteUrl = 'https://www.auapw.org'
  // Prefer the canonical product URL from the pricing sheet when available.
  const canonicalUrl = product.productUrl || `${siteUrl}${getAcuraProductUrl(product)}`
  // Sheet-provided reference image URL, indexed alongside the local image.
  const sheetImageUrl = product.imageUrl
  const tiers = product.pricingTiers
  const lowPrice = tiers ? Math.min(tiers.low ?? product.price, tiers.medium ?? product.price, tiers.high ?? product.price) : product.price
  const highPrice = tiers ? Math.max(tiers.low ?? product.price, tiers.medium ?? product.price, tiers.high ?? product.price) : product.price
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [sheetImageUrl, productImage, imageSearchUrl].filter(Boolean),
    description: product.description,
    sku: product.mpn || product.id,
    mpn: product.mpn || product.id,
    brand: { '@type': 'Brand', name: product.brand || 'Acura' },
    category: partTypeHeading,
    url: canonicalUrl,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice,
      highPrice,
      offerCount: 3,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      url: canonicalUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="pt-24 lg:pt-28">
        {/* Breadcrumb */}
        <div className="bg-background border-b border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/acura" className="hover:text-primary transition-colors">Acura</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/acura" className="hover:text-primary transition-colors">Acura Parts</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/acura?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors capitalize">{product.category}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium line-clamp-2">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Hero */}
        <section className="py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Image */}
              <div className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden border border-border/40">
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                />
                <Badge className="absolute top-4 left-4 capitalize">{product.category}</Badge>
                {product.availability && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground capitalize">{product.availability}</Badge>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-card/90 px-4 py-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-muted-foreground line-clamp-1">
                    {product.imageLabel}
                  </p>
                  <a
                    href={imageSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    View real photos
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      {partTypeHeading}
                    </span>
                    <a
                      href={imageSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Search this part on Google
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground text-balance">{product.name}</h1>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-foreground">4.8</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Verified seller</span>
                    <span className="text-sm text-muted-foreground">SKU: {product.mpn}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Condition</div>
                    <div className="font-semibold text-foreground capitalize">{product.condition || 'Used'}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Warranty</div>
                    <div className="font-semibold text-foreground">{product.warranty || '90 Days'}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Shipping</div>
                    <div className="font-semibold text-foreground">{product.shipping}</div>
                  </div>
                  <div className="bg-card rounded-lg p-3 border border-border/40">
                    <div className="text-xs text-muted-foreground">Fits</div>
                    <div className="font-semibold text-foreground text-sm">{product.compatibility}</div>
                  </div>
                </div>

                {/* Interactive pricing by mileage — click a tier to change the price */}
                <MileagePriceSelector
                  basePrice={product.price}
                  tiers={product.pricingTiers}
                  onTierChange={(_, price) => setSelectedPrice(price)}
                />

                {/* Actions */}
                <ProductCardActions
                  productId={String(product.id)}
                  productName={product.name}
                  productPrice={selectedPrice ?? (product.pricingTiers?.medium ?? product.price)}
                  productImage={productImage}
                  productType={product.category}
                  make={product.compatibility || 'Acura'}
                  shipping={product.shipping}
                />

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>{product.warranty || '90 Days'} warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-5 h-5 text-primary shrink-0" />
                    <span>{product.shipping} shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>Fully tested</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search another part + free quote */}
        <section className="py-6 border-y border-border/50 bg-card/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-foreground">Looking for another Acura part?</h2>
                <p className="text-sm text-muted-foreground">
                  Search our full Acura catalog, or{' '}
                  <Link href="/acura#free-quote" className="font-medium text-primary hover:underline">
                    request a free quote
                  </Link>{' '}
                  if you can&apos;t find it.
                </p>
              </div>
              <div className="w-full md:max-w-md">
                <AcuraPartsSearch size="sm" placeholder="Search another Acura part…" />
              </div>
            </div>
          </div>
        </section>

        {/* AI-Powered Recommendations */}
        <section className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PartRecommendations productId={product.id} />
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="py-12 bg-card/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-black text-foreground mb-6">Related Acura Parts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((rp) => (
                  <Link key={rp.id} href={getAcuraProductUrl(rp)}>
                    <Card className="hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden h-full">
                      <div className="relative w-full h-40 bg-muted">
                        <Image src={resolveAcuraImage(rp)} alt={rp.name} fill unoptimized className="object-cover" />
                      </div>
                      <CardHeader className="pb-2">
                        <Badge className="w-fit mb-1 capitalize">{rp.category}</Badge>
                        <CardTitle className="text-sm line-clamp-2">{rp.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-lg font-bold text-primary">${rp.price.toLocaleString()}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Parts Details */}
        <PartsDetails
          partType={partTypeLabel}
          specifications={partSpecs ?? undefined}
          condition={product.condition ? `Used - ${product.condition}` : 'Used - Good Condition'}
          yearRange={fitmentYear}
          mileageRange="0-200,000 miles"
        />

        {/* Parts History */}
        <PartsHistory partType={product.category} />

        {/* Shipping Info */}
        <ShippingInfo />

        {/* FAQ */}
        <ProductFAQ productType={product.category} />

        {/* Keyword-rich internal backlinks for Google indexing */}
        <SeoBacklinks make="Acura" partType={product.category} />
      </main>
      <Footer />
    </>
  )
}
