'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ShoppingCart, Heart, Loader2 } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'

interface Product {
  id: string
  sku: string
  category: string
  name: string
  price: string
  condition: string
  make?: string
  model?: string
  warranty_days: number
  inventory?: {
    quantity_available: number
  }
}

const CATEGORIES = [
  'All',
  'Engines',
  'Transmissions',
  'Suspension & Steering',
  'Electrical & Sensors',
  'Climate Control',
  'Brake System',
  'Engine Components',
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { addItem } = useCartStore()
  const { addItem: addToWishlist, items: wishlistItems } = useWishlistStore()

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item: any) => item.id === productId)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '12',
        })

        if (category !== 'All') {
          params.append('category', category)
        }

        if (search) {
          params.append('search', search)
        }

        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()
        setProducts(data.data || [])
      } catch (error) {
        console.error('[v0] Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, search, page])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[58px]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Used Auto Parts Catalog
            </h1>
            <p className="text-foreground/70">
              Browse our inventory of OEM used auto parts
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="Search parts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground placeholder:text-foreground/50"
            />

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat)
                    setPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:bg-card/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-border bg-card p-4 hover:shadow-lg transition"
                >
                  {/* Product Info */}
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="text-sm text-foreground/70 mb-3 space-y-1">
                    <p>SKU: {product.sku}</p>
                    <p>Condition: {product.condition}</p>
                    {product.make && <p>Make: {product.make}</p>}
                    {product.warranty_days && (
                      <p className="text-green-600">
                        {product.warranty_days}-day warranty
                      </p>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="mb-4 text-sm">
                    {(product.inventory?.quantity_available ?? 0) > 0 ? (
                      <span className="text-green-600 font-medium">
                        In Stock ({product.inventory?.quantity_available})
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium">Out of Stock</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-2xl font-bold text-primary mb-4">
                    ${parseFloat(product.price).toFixed(2)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-card border border-border text-foreground rounded-lg py-2 hover:bg-card/80 transition"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.price),
                          quantity: 1,
                        })
                      }
                      disabled={!product.inventory?.quantity_available}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => addToWishlist(product)}
                      className={`px-4 py-2 rounded-lg transition ${
                        isInWishlist(product.id)
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-card border border-border text-foreground hover:bg-card/80'
                      }`}
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-border rounded-lg hover:bg-card disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-foreground">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={products.length < 12}
                className="px-4 py-2 border border-border rounded-lg hover:bg-card disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
