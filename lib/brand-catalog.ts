import "server-only"
import fs from "node:fs"
import path from "node:path"

/**
 * Server-side loader for the per-brand catalogs generated from the uploaded
 * pricing sheets (see scripts/build-brand-catalogs.mjs). Prices come EXACTLY
 * from the sheets — no markup or clamping.
 */

export interface BrandProduct {
  id: string
  name: string
  slug: string
  canonicalSlug: string
  price: number
  tiers?: { low: number; medium: number; high: number }
  imageUrl?: string
  productUrl?: string
  category: string
  partNumber: string
  mpn: string
  compatibility?: string
  description?: string
  model: string
  year: string
}

export interface BrandCatalog {
  brand: string
  slug: string
  count: number
  products: BrandProduct[]
}

/** All brands with generated catalogs, in display order. */
export const BRAND_DIRECTORY: { slug: string; label: string }[] = [
  { slug: "alfa-romeo", label: "Alfa Romeo" },
  { slug: "audi", label: "Audi" },
  { slug: "bmw", label: "BMW" },
  { slug: "buick", label: "Buick" },
  { slug: "cadillac", label: "Cadillac" },
  { slug: "chevrolet", label: "Chevrolet" },
  { slug: "chrysler", label: "Chrysler" },
  { slug: "daewoo", label: "Daewoo" },
  { slug: "daihatsu", label: "Daihatsu" },
  { slug: "dodge", label: "Dodge" },
  { slug: "eagle", label: "Eagle" },
  { slug: "fiat", label: "Fiat" },
  { slug: "ford", label: "Ford" },
  { slug: "geo", label: "Geo" },
  { slug: "gmc", label: "GMC" },
  { slug: "honda", label: "Honda" },
  { slug: "hummer", label: "HUMMER" },
  { slug: "hyundai", label: "Hyundai" },
  { slug: "infiniti", label: "INFINITI" },
]

const catalogCache = new Map<string, BrandCatalog>()
const slugIndexCache = new Map<string, Map<string, BrandProduct>>()

export function isValidBrand(brand: string): boolean {
  return BRAND_DIRECTORY.some((b) => b.slug === brand)
}

export function getBrandLabel(brand: string): string {
  return BRAND_DIRECTORY.find((b) => b.slug === brand)?.label ?? brand
}

export function loadBrandCatalog(brand: string): BrandCatalog | null {
  if (!isValidBrand(brand)) return null
  const cached = catalogCache.get(brand)
  if (cached) return cached
  const filePath = path.join(process.cwd(), "data", "brands", `${brand}.json`)
  if (!fs.existsSync(filePath)) return null
  const catalog = JSON.parse(fs.readFileSync(filePath, "utf8")) as BrandCatalog
  catalogCache.set(brand, catalog)
  return catalog
}

export function getBrandProductBySlug(brand: string, slug: string): BrandProduct | undefined {
  let index = slugIndexCache.get(brand)
  if (!index) {
    const catalog = loadBrandCatalog(brand)
    if (!catalog) return undefined
    index = new Map(catalog.products.map((p) => [p.canonicalSlug, p]))
    slugIndexCache.set(brand, index)
  }
  return index.get(slug)
}

export function getBrandProductUrl(brand: string, product: Pick<BrandProduct, "canonicalSlug">): string {
  return `/brands/${brand}/${product.canonicalSlug}`
}

/** Distinct models within a brand catalog with product counts, sorted by count. */
export function getBrandModels(brand: string): { model: string; count: number }[] {
  const catalog = loadBrandCatalog(brand)
  if (!catalog) return []
  const counts = new Map<string, number>()
  for (const p of catalog.products) {
    const m = p.model || "Other"
    counts.set(m, (counts.get(m) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count)
}

export interface BrandSearchResult {
  products: BrandProduct[]
  total: number
  page: number
  pageCount: number
}

const PAGE_SIZE = 48

export function searchBrandProducts(
  brand: string,
  opts: { q?: string; model?: string; category?: string; page?: number } = {},
): BrandSearchResult {
  const catalog = loadBrandCatalog(brand)
  if (!catalog) return { products: [], total: 0, page: 1, pageCount: 0 }
  let items = catalog.products
  if (opts.model) {
    const m = opts.model.toLowerCase()
    items = items.filter((p) => (p.model || "").toLowerCase() === m)
  }
  if (opts.category) {
    const c = opts.category.toLowerCase()
    items = items.filter((p) => (p.category || "").toLowerCase().includes(c))
  }
  if (opts.q) {
    const q = opts.q.toLowerCase()
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.compatibility || "").toLowerCase().includes(q),
    )
  }
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(Math.max(1, opts.page || 1), pageCount)
  return { products: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total, page, pageCount }
}

export function getRelatedBrandProducts(brand: string, product: BrandProduct, limit = 4): BrandProduct[] {
  const catalog = loadBrandCatalog(brand)
  if (!catalog) return []
  return catalog.products
    .filter((p) => p.canonicalSlug !== product.canonicalSlug && p.model === product.model)
    .slice(0, limit)
}

/**
 * Local representative image by part category — used as fallback alongside
 * the sheet-provided image_url so every product shows a matching part photo.
 */
export function resolveBrandPartImage(product: Pick<BrandProduct, "category" | "name">): string {
  const source = `${product.category} ${product.name}`.toLowerCase()
  if (source.includes("transmission")) return "/images/parts/transmission-used.jpg"
  if (source.includes("engine")) return "/images/parts/engine-used.jpg"
  if (source.includes("abs")) return "/images/parts/abs-module-used.jpg"
  if (source.includes("radiator") || source.includes("cooling")) return "/images/parts/radiator-used.jpg"
  if (source.includes("headlight") || source.includes("light")) return "/images/parts/headlight-used.jpg"
  if (source.includes("starter")) return "/images/parts/starter-used.jpg"
  if (source.includes("seat")) return "/images/parts/seat-front-used.jpg"
  if (source.includes("wheel") || source.includes("rim")) return "/images/parts/wheel-rim-used.jpg"
  if (source.includes("speedometer") || source.includes("cluster")) return "/images/parts/speedometer-used.jpg"
  if (source.includes("airbag")) return "/images/parts/airbag-used.jpg"
  if (source.includes("wiper")) return "/images/parts/wiper-motor-used.jpg"
  if (source.includes("a/c") || source.includes("ac ") || source.includes("heat")) return "/images/parts/ac-control-used.jpg"
  return "/images/parts/engine-used.jpg"
}

/** Human-readable part-type label, e.g. "Used Engine". */
export function getBrandPartTypeLabel(product: Pick<BrandProduct, "category">): string {
  const category = (product.category || "Part").replace(/^used\s+/i, "").trim()
  return `Used ${category.replace(/\b\w/g, (c) => c.toUpperCase())}`
}
