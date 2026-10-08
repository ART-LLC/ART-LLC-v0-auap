'use client'

import { useState } from 'react'
import { MileagePriceSelector } from '@/components/acura/mileage-price-selector'
import { ProductCardActions } from '@/components/products/product-card-actions'

interface BrandPurchasePanelProps {
  productId: string
  productName: string
  basePrice: number
  tiers?: { low: number; medium: number; high: number }
  productImage: string
  productType: string
  make: string
  shipping?: string
  availability?: 'in_stock' | 'out_of_stock' | 'backorder'
  detailsHref?: string
}

/**
 * Client island for server-rendered brand product pages: the mileage tier
 * picker updates the price that flows into Call / Message / Quote / Cart.
 */
export function BrandPurchasePanel({
  productId,
  productName,
  basePrice,
  tiers,
  productImage,
  productType,
  make,
  shipping,
  availability = 'in_stock',
  detailsHref,
}: BrandPurchasePanelProps) {
  // Price of the mileage tier the shopper selected (null = default medium tier).
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  // No sheet price means this part is call/quote-only — never let it into the cart as a $0 item.
  const isQuoteOnly = !tiers && basePrice <= 0

  return (
    <div className="flex flex-col gap-5">
      {/* Interactive pricing by mileage — exact sheet tiers only */}
      <MileagePriceSelector
        basePrice={basePrice}
        tiers={tiers}
        onTierChange={(_, price) => setSelectedPrice(price)}
      />

      <ProductCardActions
        productId={productId}
        productName={productName}
        productPrice={selectedPrice ?? (tiers?.medium ?? basePrice)}
        productImage={productImage}
        productType={productType}
        make={make}
        shipping={shipping}
        detailsHref={detailsHref}
        purchaseDisabled={availability !== 'in_stock' || isQuoteOnly}
        isQuoteOnly={isQuoteOnly}
      />
      {isQuoteOnly ? (
        <p role="status" className="text-sm text-muted-foreground">
          This part is priced by phone. Call or request a quote and we&apos;ll confirm pricing and availability.
        </p>
      ) : (
        availability !== 'in_stock' && (
          <p role="status" className="text-sm text-muted-foreground">
            {availability === 'backorder' ? 'This part is on backorder.' : 'This part is out of stock.'} Contact us to confirm availability before ordering.
          </p>
        )
      )}
    </div>
  )
}
