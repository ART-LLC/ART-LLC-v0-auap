'use client'

import { useState, useMemo, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { acuraGrouped, acuraProducts, getAcuraProductUrl, resolveAcuraImage, type AcuraProduct } from '@/lib/acura-data'
import { ProductCardActions } from '@/components/products/product-card-actions'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

// Extract the base model name (e.g. "CL") from a full year-model key
// (e.g. "2003 Acura CL"). Falls back to the last word.
function baseModelName(key: string): string {
  const cleaned = key.replace(/\b(19|20)\d{2}\b/g, '').replace(/acura/i, '').trim()
  return cleaned || key.split(' ').pop() || key
}

export default function AcuraProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

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
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const suggestions = useMemo(() => {
    if (normalizedQuery.length < 2) return []

    return acuraProducts
      .filter((product) =>
        [product.name, product.model, product.year, product.category, product.compatibility, product.description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 6)
  }, [normalizedQuery])

  const currentModelData = useMemo(() => {
    const modelData = byModel[selectedModel] || {}
    if (!normalizedQuery) return modelData

    return Object.fromEntries(
      Object.entries(modelData)
        .map(([category, products]) => [
          category,
          products.filter((product) =>
            [product.name, product.model, product.year, product.category, product.compatibility, product.description]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()
              .includes(normalizedQuery),
          ),
        ])
        .filter(([, products]) => (products as AcuraProduct[]).length > 0),
    )
  }, [selectedModel, byModel, normalizedQuery])
  const categories = Object.keys(currentModelData)

  function selectSuggestion(product: AcuraProduct) {
    setSearchFocused(false)
    router.push(getAcuraProductUrl(product))
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (suggestions[0]) selectSuggestion(suggestions[0])
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium quality used Acura parts from our 2,000+ yard network. Browse {acuraProducts.length} products across {modelsList.length} vehicle models with verified pricing and warranty.
          </p>
        </div>

        <form onSubmit={handleSearch} role="search" className="mx-auto mb-10 max-w-3xl">
          <Field>
            <FieldLabel htmlFor="acura-parts-search">Search Acura parts inventory</FieldLabel>
            <div className="relative">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <SearchIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="acura-parts-search"
                    type="search"
                    role="combobox"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
                    onKeyDown={(event) => {
                      if (event.nativeEvent.isComposing || event.keyCode === 229) return
                      if (event.key === 'Escape') setSearchFocused(false)
                    }}
                    placeholder="Try “2012 MDX engine” or “TL transmission”"
                    aria-autocomplete="list"
                    aria-controls="acura-search-suggestions"
                    aria-expanded={searchFocused && normalizedQuery.length >= 2}
                    autoComplete="off"
                    className="h-12 pl-10 pr-10"
                  />
                </div>
                <Button type="submit" size="lg" disabled={!suggestions.length}>
                  <SearchIcon data-icon="inline-start" />
                  Search Acura Parts
                </Button>
              </div>

              {searchFocused && normalizedQuery.length >= 2 && (
                <div
                  id="acura-search-suggestions"
                  role="listbox"
                  aria-label="Acura part suggestions"
                  className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg sm:right-48"
                >
                  {suggestions.length > 0 ? (
                    <div className="flex flex-col p-2">
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Acura inventory suggestions
                      </p>
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          role="option"
                          aria-selected="false"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => selectSuggestion(product)}
                          className="flex items-center justify-between gap-4 rounded-md px-3 py-3 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{product.name}</span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {product.year} Acura {product.model} · {product.category}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-bold text-primary">${product.price}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">
                      No Acura parts match that search. Try a model, year, engine, or transmission.
                    </p>
                  )}
                </div>
              )}
            </div>
            <FieldDescription>
              Suggestions are limited to the Acura inventory on this page. Select a suggestion to open its exact listing.
            </FieldDescription>
          </Field>
        </form>

        {/* Model Selection */}
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
                        {(currentModelData[category] as AcuraProduct[] || []).slice(0, 12).map((product) => {
                          const resolvedImage = resolveAcuraImage(product)
                          return (
                          <Card 
                            key={product.id} 
                            className="hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden flex flex-col"
                          >
                            {/* Product Image */}
                            <Link href={getAcuraProductUrl(product)} className="relative h-48 w-full bg-muted overflow-hidden block">
                              <Image
                                src={resolvedImage}
                                alt={product.name}
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover hover:scale-105 transition-transform"
                              />
                              <span className="absolute inset-x-0 bottom-0 bg-card/90 px-2 py-1 text-center text-[10px] font-medium text-muted-foreground">
                                Representative image — verify VIN/fitment
                              </span>
                            </Link>
                            
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
                                <CardDescription className="text-xs">
                                  Fits: {product.compatibility}
                                </CardDescription>
                              )}
                            </CardHeader>

                            <CardContent className="flex-1 pb-4">
                              {/* Pricing Tiers */}
                              <div className="mb-4 p-3 bg-card/50 rounded-lg border border-border/50">
                                <p className="text-sm font-semibold text-foreground mb-2">
                                  Pricing by Mileage:
                                </p>
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

                              {/* Warranty & Shipping */}
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

                            {/* Full Action Buttons: Add to Cart, Buy Now, Call, Message, Quote, Details */}
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
                        })}
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
      </div>
      </main>
      <Footer />
    </>
  )
}
