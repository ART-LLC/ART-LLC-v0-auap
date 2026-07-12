'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BadgeCheck } from 'lucide-react'

interface BrandProductImageProps {
  /** Sheet-provided image URL (preferred). */
  src?: string
  /** Local category-matched fallback image. */
  fallbackSrc: string
  alt: string
  sku: string
  brand: string
  year?: string
  model?: string
  category?: string
  className?: string
  priority?: boolean
  compact?: boolean
}

/**
 * Creates a distinct, truthful image card for every SKU. The underlying photo
 * remains the authoritative sheet image (or category fallback), while the
 * overlay identifies the exact catalog record instead of implying the photo is
 * the actual inventory unit.
 */
export function BrandProductImage({
  src,
  fallbackSrc,
  alt,
  sku,
  brand,
  year,
  model,
  category,
  className,
  priority,
  compact = false,
}: BrandProductImageProps) {
  const [failed, setFailed] = useState(false)
  const effectiveSrc = !failed && src ? src : fallbackSrc
  const vehicle = [year, brand, model].filter(Boolean).join(' ')

  return (
    <div className="absolute inset-0 overflow-hidden bg-muted">
      <Image
        src={effectiveSrc || '/images/parts/engine-used.jpg'}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        className={className || 'object-cover'}
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-x-0 bottom-0 bg-card/95 text-card-foreground shadow-[0_-8px_24px_hsl(var(--background)/0.45)]">
        <div className={compact ? 'flex items-center justify-between gap-2 px-3 py-2' : 'flex items-end justify-between gap-4 px-4 py-3'}>
          <div className="min-w-0">
            <p className={`${compact ? 'text-[10px]' : 'text-xs'} truncate font-black uppercase tracking-[0.12em] text-foreground`}>
              {vehicle || brand}
            </p>
            {!compact && (
              <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                {category || 'Used OEM Part'}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className={`${compact ? 'text-[10px]' : 'text-xs'} font-black text-primary`}>SKU {sku}</p>
            {!compact && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                <BadgeCheck className="h-3 w-3 text-primary" />
                Sheet-matched listing
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
