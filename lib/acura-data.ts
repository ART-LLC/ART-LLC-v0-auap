import acuraData from "@/lib/acura-products.json"

export interface AcuraProduct {
  id: string
  name: string
  slug: string
  brand: string
  description: string
  price: number
  pricingTiers?: { low?: number; medium?: number; high?: number }
  image?: string
  imageSpec?: string
  category: string
  compatibility?: string
  warranty?: string
  shipping?: string
  condition?: string
  availability?: string
  stock?: number
  gtin?: number
  mpn?: string
}

const data = acuraData as unknown as {
  products: AcuraProduct[]
  grouped: Record<string, Record<string, AcuraProduct[]>>
}

export const acuraProducts = data.products
export const acuraGrouped = data.grouped

export function getAcuraProductBySlug(slug: string): AcuraProduct | undefined {
  return data.products.find((p) => p.slug === slug)
}

export function getAcuraProductById(id: string): AcuraProduct | undefined {
  return data.products.find((p) => p.id === id)
}

// Related products: same category first, then same model/compatibility, excluding self.
export function getRelatedAcuraProducts(product: AcuraProduct, limit = 4): AcuraProduct[] {
  const sameCategory = data.products.filter(
    (p) => p.id !== product.id && p.category === product.category,
  )
  const sameModel = data.products.filter(
    (p) =>
      p.id !== product.id &&
      p.category !== product.category &&
      p.compatibility === product.compatibility,
  )
  return [...sameCategory, ...sameModel].slice(0, limit)
}
