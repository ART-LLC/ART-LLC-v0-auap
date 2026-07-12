'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { acuraGrouped, acuraProducts, getAcuraProductUrl, resolveAcuraImage, getAcuraPartTypeLabel, getAcuraPartImageSearchUrl, type AcuraProduct } from '@/lib/acura-data'
import { ImageIcon, ExternalLink } from 'lucide-react'
import { ProductCardActions } from '@/components/products/product-card-actions'
import { AcuraPartsSearch } from '@/components/acura/acura-parts-search'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

// Extract the base model name (e.g. "CL") from a full year-model key
// (e.g. "2003 Acura CL"). Falls back to the last word.
function baseModelName(key: string): string {
  const cleaned = key.replace(/\b(19|20)\d{2}\b/g, '').replace(/acura/i, '').trim()
  return cleaned || key.split(' ').pop() || key
}

export default function AcuraProductsPage() {
  // Consolidate year-model groups into unique base models (CL, MDX, TL...),
  // while preserving each unique canonical inventory record.
  const { modelsList, byModel } = useMemo(() => {
    const byModel: Record<string, Record<string, AcuraProduct[]>> = {}
    for (const [fullKey, categories] of Object.entries(acuraGrouped)) {
      const model = baseModelName(fullKey)
      byModel[model] = byModel[model] || {}
      for (const [category, products] of Object.entries(categories)) {
        byModel[model][category] = (byModel[model][category] || []).concat(products)
      }
    }
    return { modelsList: Object.keys(byModel).sort(), byModel }
  }, [])

  const [selectedModel, setSelectedModel] = useState(modelsList[0] || 'Acura')
  const currentModelData = useMemo(() => byModel[selectedModel] || {}, [selectedModel, byModel])
  const categories = Object.keys(currentModelData)

  // Search scoped strictly to the Acura catalog.
  const [searchQuery, setSearchQuery] = useState('')
  const searchResults = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase()
    if (!trimmed) return [] as AcuraProduct[]
    const terms = trimmed.split(/\s+/)
    return acuraProducts.filter((product) => {
      const hay = [product.name, product.model, product.category, product.compatibility, product.condition]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return terms.every((term) => hay.includes(term))
    })
  }, [searchQuery])

  const isSearching = searchQuery.trim().length > 0

  function renderProductCard(product: AcuraProduct, category: string) {
    const resolvedImage = resolveAcuraImage(product)
    return (
      <Card
        key={product.id}
        className="hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden flex flex-col"
      >
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          <Link href={getAcuraProductUrl(product)} className="block h-full w-full">
            <Image
              src={resolvedImage}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover hover:scale-105 transition-transform"
            />
          </Link>
          <span className="absolute top-2 left-2 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            {getAcuraPartTypeLabel(product)}
          </span>
          <a
            href={getAcuraPartImageSearchUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-card/90 px-2 py-1 text-[10px] font-semibold text-primary hover:underline"
          >
            <ImageIcon className="w-3 h-3" />
            View real photos on Google
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {product.condition || 'Used'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {product.availability || 'In Stock'}
            </Badge>
          </div>
          <Link href={getAcuraProductUrl(product)}>
            <CardTitle className="text-base line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </CardTitle>
          </Link>
          {product.compatibility && (
            <CardDescription className="text-xs">Fits: {product.compatibility}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex-1 pb-4">
          <div className="mb-4 p-3 bg-card/50 rounded-lg border border-border/50">
            <p className="text-sm font-semibold text-foreground mb-2">Pricing by Mileage:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium">Low:</span> ${product.pricingTiers?.low || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Medium:</span> ${product.price}
              </p>
              <p>
                <span className="font-medium">High:</span> ${product.pricingTiers?.high || 'N/A'}
              </p>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            {product.warranty && (
              <p className="text-muted-foreground">
                <span className="font-medium">Warranty:</span> {product.warranty}
              </p>
            )}
            {product.shipping && (
              <p className="text-muted-foreground">
                <span className="font-medium">Shipping:</span> {product.shipping}
              </p>
            )}
          </div>
        </CardContent>

        <div className="px-4 pb-4">
          <ProductCardActions
            productId={String(product.id)}
            productName={product.name}
            productPrice={Number(product.price) || 0}
            productImage={resolvedImage}
            productType={category}
            make="Acura"
            shipping={product.shipping}
            detailsHref={getAcuraProductUrl(product)}
          />
        </div>
      </Card>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            ACURA Used Auto Parts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Premium quality used Acura parts from our 2,000+ yard network. Browse {acuraProducts.length} products across {modelsList.length} vehicle models with verified pricing and warranty.
          </p>

          {/* Acura-only search with live suggestions */}
          <AcuraPartsSearch onSearch={setSearchQuery} activeQuery={searchQuery} />
        </div>

        {isSearching ? (
          /* Search results */
          <div className="mb-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
              <h2 className="text-xl font-bold text-foreground">
                {searchResults.length} result{searchResults.length === 1 ? '' : 's'} for &ldquo;{searchQuery.trim()}&rdquo;
              </h2>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-sm font-medium text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.slice(0, 24).map((product) => renderProductCard(product, product.category))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No Acura parts match your search. Try a model name or part type like &ldquo;TL engine&rdquo;.</p>
              </div>
            )}
            {searchResults.length > 24 && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Showing the first 24 of {searchResults.length} matches. Refine your search to narrow results.
              </p>
            )}
          </div>
        ) : (
        /* Model Selection */
        <div className="mb-8">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 p-2 bg-card/50 rounded-lg">
            {modelsList.map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => setSelectedModel(model)}
                aria-pressed={selectedModel === model}
                className={`text-xs sm:text-sm whitespace-nowrap rounded-md px-2 py-2 font-semibold transition-colors ${
                  selectedModel === model
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }`}
              >
                {model}
              </button>
            ))}
          </div>

          {/* Products Display */}
          <div className="mt-8">
              <div className="space-y-6">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category} className="border-t border-border/50 pt-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6 capitalize">
                        {category}
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(currentModelData[category] as AcuraProduct[] || [])
                          .slice(0, 12)
                          .map((product) => renderProductCard(product, category))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No products available for this model.</p>
                  </div>
                )}
              </div>
          </div>
        </div>
        )}
      </div>
      </main>
      <Footer />
    </>
  )
}
