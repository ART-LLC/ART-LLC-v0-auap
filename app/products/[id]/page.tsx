'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCardActions } from '@/components/products/product-card-actions'
import { ProductFAQ } from '@/components/products/product-faq'
import { ShippingInfo } from '@/components/products/shipping-info'
import { PartsDetails } from '@/components/products/parts-details'
import { PartsHistory } from '@/components/products/parts-history'
import { AppleStylePartsSearch, type SearchFilters } from '@/components/apple-style-parts-search'
import { MileagePriceSelector } from '@/components/acura/mileage-price-selector'
import { SeoBacklinks } from '@/components/seo-backlinks'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Star, Shield, Truck, MapPin, Phone, MessageSquare } from 'lucide-react'

import { getPartsSearchUrl } from '@/lib/parts-search-routing'
interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState('overview')
  // Price of the mileage tier the shopper selected (null = default medium tier).
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)

  const handleSearch = (filters: SearchFilters) => {
    router.push(getPartsSearchUrl(filters))
  }

  // Mock product data matching catalog
  const PRODUCTS_MAP: any = {
    'prod_1': {
      id: 'prod_1',
      sku: 'ENGINE-2.4-ACCORD',
      category: 'Engines',
      name: 'Honda Accord 2.4L Engine (2008-2012)',
      price: 2499.99,
      warranty_days: 180,
      condition: 'used',
      make: 'Honda',
      model: 'Accord',
      year_from: 2008,
      year_to: 2012,
      rating: 4.8,
      reviews: 124,
      description: 'High-quality, professionally tested Honda Accord 2.4L V4 engine from 2008-2012 model years. Verified mileage and complete compression test results available. Ready for immediate installation.',
      specifications: {
        displacement: '2.4L',
        cylinders: 4,
        horsepower: '190 HP',
        torque: '162 lb-ft',
        transmission: 'Automatic/Manual Compatible',
        mileage: '45,000 - 85,000 miles',
        condition: 'Used - Good',
      },
      features: [
        'Professional compression test performed',
        'All factory sensors included',
        'Aluminum block construction',
        '180-day warranty included',
        'Express shipping available',
        'Installation guide provided',
      ],
      inventory: 5,
    },
    'prod_2': {
      id: 'prod_2',
      sku: 'ENGINE-1.8-CIVIC',
      category: 'Engines',
      name: 'Honda Civic 1.8L Engine (2006-2011)',
      price: 1899.99,
      warranty_days: 180,
      condition: 'used',
      make: 'Honda',
      model: 'Civic',
      year_from: 2006,
      year_to: 2011,
      rating: 4.7,
      reviews: 98,
      description: 'Well-maintained Honda Civic 1.8L engine suitable for 2006-2011 models. Performance tested and certified.',
      specifications: {
        displacement: '1.8L',
        cylinders: 4,
        horsepower: '140 HP',
        torque: '127 lb-ft',
        transmission: 'Automatic/Manual Compatible',
        mileage: '50,000 - 92,000 miles',
        condition: 'Used - Good',
      },
      features: [
        'Certified by ASE technician',
        'Timing chain inspected',
        '180-day warranty',
        'All gaskets and seals replaced',
        'Free technical support',
      ],
      inventory: 8,
    },
    'prod_3': {
      id: 'prod_3',
      sku: 'ENGINE-4.0-F150',
      category: 'Engines',
      name: 'Ford F-150 4.0L Engine (2004-2008)',
      price: 1799.99,
      warranty_days: 180,
      condition: 'used',
      make: 'Ford',
      model: 'F-150',
      year_from: 2004,
      year_to: 2008,
      rating: 4.9,
      reviews: 156,
      description: 'Powerful Ford F-150 4.0L V6 engine. Extensively tested for durability and performance.',
      specifications: {
        displacement: '4.0L',
        cylinders: 6,
        horsepower: '207 HP',
        torque: '238 lb-ft',
        transmission: 'Automatic',
        mileage: '55,000 - 95,000 miles',
        condition: 'Used - Good',
      },
      features: [
        'V6 reliability and power',
        'Fuel injectors cleaned',
        'Valve covers resealed',
        'Factory throttle body',
        'Extended 180-day warranty',
      ],
      inventory: 3,
    },
    'prod_4': {
      id: 'prod_4',
      sku: 'TRANS-AUTO-5SPD',
      category: 'Transmissions',
      name: 'Automatic Transmission 5-Speed (2000-2015)',
      price: 1299.99,
      warranty_days: 90,
      condition: 'used',
      rating: 4.6,
      reviews: 87,
      description: 'Reliable 5-speed automatic transmission suitable for various makes and models from 2000-2015.',
      specifications: {
        type: '5-Speed Automatic',
        gears: 5,
        transmission: 'Torque Converter',
        mileage: '45,000 - 100,000 miles',
        condition: 'Used - Good',
      },
      features: [
        'Fully tested torque converter',
        'Fresh transmission fluid',
        'All gaskets replaced',
        '90-day warranty',
        'Easy installation',
      ],
      inventory: 12,
    },
    'prod_5': {
      id: 'prod_5',
      sku: 'TRANS-AUTO-6SPD',
      category: 'Transmissions',
      name: 'Automatic Transmission 6-Speed (2010-2020)',
      price: 1599.99,
      warranty_days: 90,
      condition: 'used',
      rating: 4.7,
      reviews: 102,
      description: 'Modern 6-speed automatic transmission for newer vehicles with improved fuel efficiency.',
      specifications: {
        type: '6-Speed Automatic',
        gears: 6,
        transmission: 'Torque Converter',
        mileage: '40,000 - 85,000 miles',
        condition: 'Used - Excellent',
      },
      features: [
        'Modern transmission technology',
        'Smooth shifting',
        'Computer diagnostic tested',
        '90-day warranty',
        'Same-day shipping available',
      ],
      inventory: 7,
    },
    'prod_6': {
      id: 'prod_6',
      sku: 'STRUT-FRONT-ACCORD',
      category: 'Suspension & Steering',
      name: 'Front Strut Pair - Honda Accord (2008-2012)',
      price: 349.99,
      warranty_days: 180,
      condition: 'used',
      make: 'Honda',
      model: 'Accord',
      rating: 4.8,
      reviews: 64,
      description: 'Professional-grade front strut pair for Honda Accord models 2008-2012. Includes coil springs.',
      specifications: {
        type: 'MacPherson Struts',
        pair: 'Front Left & Right',
        mileage: '30,000 - 75,000 miles',
        condition: 'Used - Excellent',
      },
      features: [
        'Coil springs included',
        'Load-tested',
        'Ready to install',
        '180-day warranty',
        'Free core return shipping',
      ],
      inventory: 15,
    },
    'prod_7': {
      id: 'prod_7',
      sku: 'AXLE-FRONT-F150',
      category: 'Suspension & Steering',
      name: 'Front Axle Assembly - Ford F-150 (2004-2008)',
      price: 749.99,
      warranty_days: 180,
      condition: 'used',
      make: 'Ford',
      model: 'F-150',
      rating: 4.9,
      reviews: 73,
      description: 'Heavy-duty front axle assembly for Ford F-150 trucks. Fully functional with new seals.',
      specifications: {
        type: 'Front Axle Assembly',
        position: 'Driver Side',
        mileage: '60,000 - 100,000 miles',
        condition: 'Used - Good',
      },
      features: [
        'New seals installed',
        'Bearings inspected',
        'U-joints included',
        '180-day warranty',
        'Heavy-duty construction',
      ],
      inventory: 2,
    },
    'prod_8': {
      id: 'prod_8',
      sku: 'ALTERNATOR-120A',
      category: 'Electrical & Sensors',
      name: 'Alternator 120A',
      price: 299.99,
      warranty_days: 180,
      condition: 'used',
      rating: 4.7,
      reviews: 156,
      description: 'Heavy-duty 120-amp alternator for various automotive applications.',
      specifications: {
        amperage: '120A',
        voltage: '12V',
        mileage: '35,000 - 80,000 miles',
        condition: 'Used - Good',
      },
      features: [
        'Tested charging output',
        'Voltage regulator included',
        'Pulley included',
        '180-day warranty',
        'Core return available',
      ],
      inventory: 22,
    },
  }

  const product = PRODUCTS_MAP[params.id] || PRODUCTS_MAP['prod_1']

  const relatedProducts = [
    { id: 1, name: 'Transmission Assembly', price: 849.99, image: '/images/product-transmission-1.png' },
    { id: 2, name: 'Radiator Cooling System', price: 199.99, image: '/images/product-radiator-1.png' },
    { id: 3, name: 'Alternator Unit', price: 149.99, image: '/images/product-alternator-1.png' },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        {/* Breadcrumb */}
        <section className="py-4 bg-background border-b border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/parts/engines" className="hover:text-foreground">Parts</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/parts/${product.category.toLowerCase()}s`} className="hover:text-foreground">
                {product.category}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{product.name}</span>
            </div>
          </div>
        </section>

        {/* Product Header */}
        <section className="py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Product Image */}
              <div className="flex flex-col gap-4">
                <div className="relative w-full bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0'
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <button key={i} className="aspect-square bg-muted rounded border-2 border-transparent hover:border-primary transition-colors">
                      <Image src={product.image} alt={`View ${i}`} fill className="object-cover rounded" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-6">
                {/* Title & Rating */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge variant="outline">{product.condition}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
                  </div>

                  {/* Vehicle Info */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Year</p>
                      <p className="font-semibold text-foreground">{product.year}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Make</p>
                      <p className="font-semibold text-foreground">{product.make}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Model</p>
                      <p className="font-semibold text-foreground">{product.model}</p>
                    </div>
                  </div>

                  {/* Mileage */}
                  <div className="flex items-center gap-2 p-3 bg-background border border-border rounded mb-6">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-sm">{product.mileage}</span>
                  </div>
                </div>

                {/* Price — tier picker renders only when real sheet tiers exist */}
                <div className="space-y-3">
                  <MileagePriceSelector
                    basePrice={product.price}
                    onTierChange={(_, price) => setSelectedPrice(price)}
                  />

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    {product.inStock ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-green-600 font-medium">In Stock - Ready to Ship</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <ProductCardActions
                    productId={product.id}
                    productName={product.name}
                    productPrice={selectedPrice ?? product.price}
                    productImage={product.image}
                    productType={product.category}
                    make={product.make}
                  />
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-lg">
                  <div className="flex flex-col items-center text-center">
                    <Shield className="w-6 h-6 text-primary mb-2" />
                    <p className="text-xs font-semibold">90-Day<br/>Warranty</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Truck className="w-6 h-6 text-primary mb-2" />
                    <p className="text-xs font-semibold">Free<br/>Shipping</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Shield className="w-6 h-6 text-primary mb-2" />
                    <p className="text-xs font-semibold">$2M<br/>Insurance</p>
                  </div>
                </div>

                {/* Contact Options */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Call (888) 818-5001
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12 bg-background border-t border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{product.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-1">SKU</p>
                        <p className="font-semibold">{product.sku}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-1">Condition</p>
                        <p className="font-semibold">{product.condition}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-1">Warranty</p>
                        <p className="font-semibold">{product.warranty}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground tracking-wide mb-1">Shipping</p>
                        <p className="font-semibold">{product.shipping}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specifications" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-semibold text-foreground">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Shipping Tab */}
              <TabsContent value="shipping" className="space-y-6 mt-6">
                <ShippingInfo />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>Based on {product.reviews} verified purchases</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-3 pb-6 border-b last:border-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">Great quality part</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">2 weeks ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Excellent condition and fast shipping. Part arrived safely and installed perfectly in my {product.year} {product.make} {product.model}.
                        </p>
                        <p className="text-xs text-muted-foreground">By John D. - Verified Purchase</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-12 bg-background border-t border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(prod => (
                <Card key={prod.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative w-full h-48 bg-muted">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <p className="font-semibold text-foreground">{prod.name}</p>
                    <p className="text-lg font-bold text-primary mt-2">${prod.price}</p>
                    <Button className="w-full mt-4" asChild>
                      <Link href={`/products/${prod.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Parts Details */}
        <PartsDetails 
          partType={product.category}
          yearRange="1990-Present"
          mileageRange="0-200,000 miles"
        />

        {/* Parts History */}
        <PartsHistory partType={product.category} />

        {/* Apple-style search form */}
        <AppleStylePartsSearch
          onSearch={handleSearch}
          title="Find Another Part"
          subtitle="Browse our complete inventory of quality used auto parts"
        />

        {/* FAQ */}
        <ProductFAQ productType={product.category} />

        {/* Keyword-rich internal backlinks for Google indexing */}
        <SeoBacklinks make={product.make} partType={product.category} />
      </main>
      <Footer />
    </>
  )
}
