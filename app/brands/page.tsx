import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { BRAND_DIRECTORY, loadBrandCatalog } from '@/lib/brand-catalog'
import { ChevronRight, Cog, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shop Used Auto Parts by Brand | Used Engines & Transmissions',
  description:
    'Browse 50,000+ used OEM engines, transmissions, and parts by brand: Ford, Chevrolet, Dodge, BMW, Honda, Audi, Hyundai, and more. Exact mileage-based pricing, tested parts, nationwide shipping.',
}

export default function BrandsDirectoryPage() {
  const brands = BRAND_DIRECTORY.map((b) => {
    const catalog = loadBrandCatalog(b.slug)
    return { ...b, count: catalog?.count ?? 0 }
  }).filter((b) => b.count > 0)

  const totalParts = brands.reduce((sum, b) => sum + b.count, 0)

  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        {/* Hero */}
        <section className="py-12 bg-background border-b border-border/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">Brands</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
              Shop Used Parts by Brand
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
              {totalParts.toLocaleString()}+ used OEM engines, transmissions, and parts priced directly
              from our live inventory sheets. Pick your brand to see exact mileage-based pricing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Shop Quality Auto Parts
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Brand grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="group flex flex-col gap-3 rounded-xl border border-border/40 bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
                      {brand.label}
                    </h2>
                    <Badge variant="secondary">{brand.count.toLocaleString()} parts</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Cog className="w-4 h-4 text-primary" />
                      Used Engines
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-primary" />
                      Transmissions
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-primary inline-flex items-center gap-1">
                    Browse {brand.label} parts
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>

            {/* Acura keeps its dedicated hub */}
            <div className="mt-8 rounded-xl border border-border/40 bg-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-foreground">Acura</h2>
                <p className="text-sm text-muted-foreground">
                  795 parts with model history guides for CL, ILX, Integra, MDX, RDX, TL, and TSX.
                </p>
              </div>
              <Link
                href="/acura"
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors w-fit"
              >
                Browse Acura parts
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
