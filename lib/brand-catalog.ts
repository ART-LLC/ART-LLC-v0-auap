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

/**
 * All brands with generated catalogs, in display order. Loaded from the
 * manifest written by scripts/build-brand-catalogs.mjs, so newly uploaded
 * sheets appear automatically after the build script runs.
 */
function loadBrandDirectory(): { slug: string; label: string; count: number }[] {
  const manifestPath = path.join(process.cwd(), "data", "brands", "manifest.json")
  if (!fs.existsSync(manifestPath)) return []
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"))
}

export const BRAND_DIRECTORY: { slug: string; label: string; count: number }[] =
  loadBrandDirectory()

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

  // The primary and previously shared 2003 CL engine URLs highlight the
  // selected Type-S automatic listing (P-2) at the correct $900 medium price.
  if (
    brand === "acura" &&
    (slug === "2003-acura-cl-engine" || slug === "2003-acura-cl-engine-p-3")
  ) {
    return index.get("2003-acura-cl-engine-p-2")
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

const sharedImageCache = new Map<string, Set<string>>()

/** Image URLs used by more than one SKU within a brand catalog. */
function getSharedImageUrls(brand: string): Set<string> {
  const cached = sharedImageCache.get(brand)
  if (cached) return cached
  const catalog = loadBrandCatalog(brand)
  const counts = new Map<string, number>()
  for (const p of catalog?.products ?? []) {
    if (p.imageUrl) counts.set(p.imageUrl, (counts.get(p.imageUrl) || 0) + 1)
  }
  const shared = new Set([...counts.entries()].filter(([, n]) => n > 1).map(([url]) => url))
  sharedImageCache.set(brand, shared)
  return shared
}

export interface ProductDisplayImage {
  /** Preferred image to render. */
  src: string
  /** Per-SKU generated illustration URL (also the on-error fallback). */
  generatedSrc: string
  /** True when src is NOT a genuine SKU-specific photo. */
  illustrative: boolean
}

/**
 * Unique-per-SKU image policy:
 * 1. A genuine photo is used (labeled "Actual part photo") only when it
 *    belongs to exactly one SKU in the brand catalog.
 * 2. Otherwise, a professional brand+category-matched studio photo is shown
 *    when one exists — always disclosed as illustrative. The SKU/vehicle
 *    overlay rendered by BrandProductImage keeps every card visually unique.
 * 3. When no brand-accurate photo exists, the deterministic per-SKU
 *    illustration from /api/product-image is used (unique per SKU).
 */
export function getProductDisplayImage(
  brand: string,
  product: Pick<BrandProduct, "imageUrl" | "canonicalSlug" | "category">,
): ProductDisplayImage {
  const apiIllustration = `/api/product-image/${brand}/${product.canonicalSlug}`
  const categoryImage = getCategoryImage(brand, product)
  // On-error fallback: prefer the branded studio photo over the abstract card
  // so external photos that fail to load still show a real part image.
  const generatedSrc = categoryImage ?? apiIllustration
  const unique = !!product.imageUrl && !getSharedImageUrls(brand).has(product.imageUrl)

  // Genuine one-of-a-kind photo: use it as-is.
  if (unique) {
    return { src: product.imageUrl!, generatedSrc, illustrative: false }
  }

  // Brand+category-matched professional photo, if one is accurate for this SKU.
  return {
    src: categoryImage ?? apiIllustration,
    generatedSrc: apiIllustration,
    illustrative: true,
  }
}

/** Brands with a dedicated professional engine studio photo (brand name shown in-image). */
const ENGINE_IMAGE_FILES: Record<string, string> = {
  acura: "acura-engine.png",
  audi: "audi-engine.png",
  bmw: "bmw-engine.png",
  buick: "buick-engine.png",
  cadillac: "cadillac-engine.png",
  chevrolet: "chevrolet-engine.png",
  chrysler: "chrysler-engine.png",
  dodge: "dodge-engine.png",
  fiat: "fiat-engine.png",
  ford: "ford-engine.png",
  honda: "honda-engine.png",
  isuzu: "isuzu-engine.png",
  jaguar: "jaguar-engine.png",
  jeep: "jeep-engine.png",
  kia: "kia-engine.png",
  "land-rover": "land-rover-engine.png",
  lexus: "lexus-engine.png",
  lincoln: "lincoln-engine.png",
  mazda: "mazda-engine.png",
  "mercedes-benz": "mercedes-engine.png",
  mitsubishi: "mitsubishi-engine.png",
  nissan: "nissan-engine.png",
  suzuki: "suzuki-engine.png",
  toyota: "toyota-engine.png",
  volvo: "volvo-engine.png",
}

/** Brands with a dedicated professional transmission studio photo (brand name shown in-image). */
const TRANSMISSION_IMAGE_FILES: Record<string, string> = {
  acura: "acura-transmission.png",
  audi: "audi-transmission.png",
  bmw: "bmw-transmission.png",
  buick: "buick-transmission.png",
  chevrolet: "chevrolet-transmission.png",
  dodge: "dodge-transmission.png",
  ford: "ford-transmission.png",
  honda: "honda-transmission.png",
  jeep: "jeep-transmission.png",
  "mercedes-benz": "mercedes-benz-transmission.png",
  nissan: "nissan-transmission.png",
  toyota: "toyota-transmission.png",
}

/**
 * Professional studio photo matched to this SKU's brand and category.
 * Brand-specific photos (with the brand name visible in the image) are
 * preferred; otherwise a brand-neutral engine/transmission photo is used
 * and the BrandProductImage overlay displays the brand name on every card.
 */
function getCategoryImage(
  brand: string,
  product: Pick<BrandProduct, "canonicalSlug" | "category">,
): string | null {
  const cat = (product.category || "").toLowerCase()
  const slug = (product.canonicalSlug || "").toLowerCase()

  // Transmission first: slugs like "...transmission - MT, EFI engine" mention
  // the donor engine, so the transmission check must win over engine matching.
  const isTransmission = cat.includes("transmission") || slug.includes("transmission")
  const isEngine = !isTransmission && (cat.includes("engine") || slug.includes("engine"))

  if (isTransmission) {
    const brandFile = TRANSMISSION_IMAGE_FILES[brand]
    if (brandFile) return `/product-images/transmission/${brandFile}`
    if (slug.includes("manual")) return "/product-images/transmission/manual-transmission.png"
    if (slug.includes("cvt")) return "/product-images/transmission/cvt-transmission.png"
    if (slug.includes("automatic")) return "/product-images/transmission/automatic-transmission.png"
    return "/product-images/transmission/transmission-generic.png"
  }

  if (isEngine) {
    const file = ENGINE_IMAGE_FILES[brand]
    return `/product-images/engine/${file || "generic-engine.png"}`
  }

  // Other categories: no accurate studio photo — use per-SKU illustration.
  return null
}

/** Human-readable part-type label, e.g. "Used Engine". */
export function getBrandPartTypeLabel(product: Pick<BrandProduct, "category">): string {
  const category = (product.category || "Part").replace(/^used\s+/i, "").trim()
  return `Used ${category.replace(/\b\w/g, (c) => c.toUpperCase())}`
}
