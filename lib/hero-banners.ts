/**
 * Hero Banner Configuration
 * Maps routes to background images for consistent cinematic automotive aesthetic
 */

const HERO_BANNERS = [
  '/images/hero-banner-1.png',
  '/images/hero-banner-2.png',
  '/images/hero-banner-3.png',
  '/images/hero-banner-4.png',
  '/images/hero-banner-5.png',
  '/images/hero-banner-6.png',
  '/images/hero-banner-7.png',
  '/images/hero-banner-8.png',
  '/images/hero-banner-9.png',
]

/**
 * Get hero banner image for a specific page
 * Uses hash-based routing to consistently assign images
 */
export function getHeroBanner(pathname: string): string {
  const hash = pathname
    .split('')
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
  const index = Math.abs(hash) % HERO_BANNERS.length
  return HERO_BANNERS[index]
}

/**
 * Get a random hero banner (for pages that should vary)
 */
export function getRandomHeroBanner(): string {
  const randomIndex = Math.floor(Math.random() * HERO_BANNERS.length)
  return HERO_BANNERS[randomIndex]
}

/**
 * Get a specific hero banner by index
 */
export function getHeroBannerByIndex(index: number): string {
  return HERO_BANNERS[index % HERO_BANNERS.length]
}
