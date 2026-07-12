'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BrandProductImageProps {
  /** Sheet-provided image URL (preferred). */
  src?: string
  /** Local category-matched fallback image. */
  fallbackSrc: string
  alt: string
  className?: string
  priority?: boolean
}

/**
 * Shows the sheet's image_url for the part; if it fails to load, falls back
 * to the local representative photo matching the part category.
 */
export function BrandProductImage({ src, fallbackSrc, alt, className, priority }: BrandProductImageProps) {
  const [failed, setFailed] = useState(false)
  const effectiveSrc = !failed && src ? src : fallbackSrc

  return (
    <Image
      src={effectiveSrc || '/images/parts/engine-used.jpg'}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      className={className || 'object-cover'}
      onError={() => setFailed(true)}
    />
  )
}
