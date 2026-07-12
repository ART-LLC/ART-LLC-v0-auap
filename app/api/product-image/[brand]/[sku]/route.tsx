import { ImageResponse } from 'next/og'
import { getBrandLabel, getBrandProductBySlug, isValidBrand } from '@/lib/brand-catalog'

/** Deterministic 32-bit hash so every SKU gets a stable, distinct look. */
function hashCode(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

const CATEGORY_HUES: Record<string, number> = {
  engine: 18,
  transmission: 205,
  electrical: 48,
  cooling: 190,
  suspension: 262,
  brakes: 0,
  body: 150,
  exhaust: 30,
  drivetrain: 280,
}

function categoryHue(category: string, fallback: number): number {
  const c = category.toLowerCase()
  for (const [key, hue] of Object.entries(CATEGORY_HUES)) {
    if (c.includes(key)) return hue
  }
  return fallback
}

const IMMUTABLE_CACHE = 'public, max-age=31536000, s-maxage=31536000, immutable'

/** Photo subject per category so the AI renders the right kind of part. */
function categorySubject(category: string): string {
  const c = category.toLowerCase()
  if (c.includes('engine')) return 'complete used car engine block with intake manifold and wiring harness'
  if (c.includes('transmission')) return 'complete used automatic transmission with torque converter and bell housing'
  if (c.includes('electrical')) return 'used automotive electrical part such as an alternator or starter motor'
  if (c.includes('cooling')) return 'used automotive radiator and cooling assembly'
  if (c.includes('suspension')) return 'used automotive suspension strut and control arm assembly'
  if (c.includes('brake')) return 'used automotive brake caliper and rotor assembly'
  if (c.includes('body')) return 'used automotive body panel part'
  if (c.includes('exhaust')) return 'used automotive exhaust manifold and pipe section'
  if (c.includes('drivetrain')) return 'used automotive differential and drive shaft assembly'
  return 'used OEM automotive replacement part'
}

/**
 * Generate a photorealistic per-SKU part image with Deep Infra FLUX.
 * The hash seed makes each SKU's image deterministic AND unique.
 * Returns null on any failure so the caller can fall back to the illustration.
 */
async function generateAiPhoto(
  seed: number,
  vehicle: string,
  category: string,
): Promise<Response | null> {
  const apiKey = process.env.DEEPINFRA_API_KEY
  if (!apiKey) return null
  try {
    const prompt = `Professional product photography of a ${categorySubject(category)} for a ${vehicle}, placed on a clean light-gray studio background, soft even lighting, high detail, realistic OEM salvage part with mild signs of use, centered composition, no people, no text, no watermark`
    const res = await fetch('https://api.deepinfra.com/v1/inference/black-forest-labs/FLUX-1-schnell', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        width: 1024,
        height: 768,
        num_images: 1,
        num_inference_steps: 4,
        seed,
      }),
      signal: AbortSignal.timeout(25000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { images?: string[] }
    const dataUrl = data.images?.[0]
    if (!dataUrl?.startsWith('data:image/')) return null
    const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
    const bytes = Buffer.from(base64, 'base64')
    return new Response(bytes, {
      headers: {
        'Content-Type': dataUrl.slice(5, dataUrl.indexOf(';')),
        'Cache-Control': IMMUTABLE_CACHE,
      },
    })
  } catch {
    return null
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ brand: string; sku: string }> },
) {
  const { brand, sku } = await params
  if (!isValidBrand(brand)) {
    return new Response('Unknown brand', { status: 404 })
  }
  const product = getBrandProductBySlug(brand, sku)
  if (!product) {
    return new Response('Unknown product', { status: 404 })
  }

  const label = getBrandLabel(brand)
  const seed = hashCode(`${brand}:${product.canonicalSlug}`)

  // Prefer a photorealistic AI-generated part photo (deterministic per SKU).
  const aiVehicle = [product.year, label, product.model].filter(Boolean).join(' ') || label
  const aiPhoto = await generateAiPhoto(seed, aiVehicle, product.category || '')
  if (aiPhoto) return aiPhoto

  // Fallback: deterministic illustration card.
  const hue = categoryHue(product.category || '', seed % 360)
  const accent = `hsl(${hue} 72% 52%)`
  const accentSoft = `hsl(${hue} 60% 22%)`
  const bg = `hsl(${(hue + 210) % 360} 18% 10%)`
  const panel = `hsl(${(hue + 210) % 360} 16% 14%)`
  const skuLabel = (product.mpn || product.id || sku).toUpperCase()
  const vehicle = [product.year, label, product.model].filter(Boolean).join(' ')
  const category = (product.category || 'Used OEM Part').replace(/\b\w/g, (c) => c.toUpperCase())
  // Deterministic geometric fingerprint: 6 bars whose heights derive from the hash
  const bars = Array.from({ length: 6 }, (_, i) => 36 + ((seed >> (i * 4)) % 96))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: bg,
          padding: 56,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              color: accent,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 6,
            }}
          >
            <div style={{ width: 52, height: 8, backgroundColor: accent, borderRadius: 4 }} />
            {category.toUpperCase()}
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: accentSoft,
              color: 'white',
              borderRadius: 999,
              padding: '12px 28px',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            SKU {skuLabel}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 14,
              backgroundColor: panel,
              borderRadius: 24,
              padding: '36px 32px',
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 30,
                  height: h,
                  backgroundColor: i % 2 === 0 ? accent : accentSoft,
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', color: 'white', fontSize: 58, fontWeight: 900, lineHeight: 1.1 }}>
              {vehicle || label}
            </div>
            <div style={{ display: 'flex', color: `hsl(${hue} 20% 72%)`, fontSize: 32, marginTop: 18, lineHeight: 1.3 }}>
              {product.name.length > 88 ? `${product.name.slice(0, 88)}…` : product.name}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', color: `hsl(${hue} 14% 60%)`, fontSize: 24, fontWeight: 600 }}>
            Illustrative image — not a photo of the actual unit. Verify VIN & fitment before purchase.
          </div>
          <div style={{ display: 'flex', color: accent, fontSize: 26, fontWeight: 800, letterSpacing: 3 }}>
            AUAPW
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 900,
      headers: {
        'Cache-Control': IMMUTABLE_CACHE,
      },
    },
  )
}
