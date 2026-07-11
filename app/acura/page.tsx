'use client'

import { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import acuraData from '@/lib/acura-products.json'
import { ProductCardActions } from '@/components/products/product-card-actions'

export default function AcuraProductsPage() {
  const acuraProducts = useMemo(() => acuraData as any, [])
  const modelsList = useMemo(() => Object.keys(acuraProducts.grouped || {}), [acuraProducts])
  const [selectedModel, setSelectedModel] = useState(modelsList[0] || 'Acura')
  const currentModelData = useMemo(() => (acuraProducts.grouped as any)?.[selectedModel] || {}, [selectedModel, acuraProducts])
  const categories = Object.keys(currentModelData)

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            𝐀𝐂𝐔𝐑𝐀 Used Auto Parts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium quality used Acura parts from our 2,000+ yard network. Browse {acuraProducts.products?.length || 0} products across {modelsList.length} vehicle models with verified pricing and warranty.
          </p>
        </div>

        {/* Model Selection Tabs */}
        <div className="mb-8">
          <Tabs value={selectedModel} onValueChange={setSelectedModel} className="w-full">
            <TabsList className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 h-auto p-2 bg-card/50">
              {modelsList.map((model) => (
                <TabsTrigger 
                  key={model} 
                  value={model}
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  {model.split(' ').pop()}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Products Display */}
            <TabsContent value={selectedModel} className="mt-8">
              <div className="space-y-6">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category} className="border-t border-border/50 pt-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6 capitalize">
                        {category}
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(currentModelData[category] as any[] || []).map((product: any) => (
                          <Card 
                            key={product.id} 
                            className="hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden flex flex-col"
                          >
                            {/* Product Image */}
                            {product.image && (
                              <Link href={`/acura/${product.slug}`} className="relative h-48 w-full bg-muted overflow-hidden block">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    const img = e.target as HTMLImageElement
                                    img.src = '/images/placeholder-part.png'
                                  }}
                                />
                              </Link>
                            )}
                            
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {product.condition || 'Used'}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {product.availability || 'In Stock'}
                                </Badge>
                              </div>
                              <Link href={`/acura/${product.slug}`}>
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
                                productImage={product.image}
                                productType={category}
                                make="Acura"
                                detailsHref={`/acura/${product.slug}`}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No products available for this model.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
