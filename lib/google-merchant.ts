import 'server-only'

import { getToken, startAuthorization, UserAuthorizationRequiredError } from '@vercel/connect'
import { PRODUCTS_CATALOG } from '@/lib/products-catalog'

const CONNECTOR_UID = 'google/google-merchant-center-product-sync'
const MERCHANT_ACCOUNT_ID = '5828832429'
const MERCHANT_API = 'https://merchantapi.googleapis.com/products/v1'
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

export type MerchantSyncResult = {
  synced: number
  failed: Array<{ sku: string; error: string }>
  authorizationUrl?: string
  prerequisite?: string
}

function subject(userId: string) {
  return { type: 'user' as const, id: userId, issuer: 'better-auth' }
}

function productInput(product: (typeof PRODUCTS_CATALOG)[number]) {
  return {
    offerId: product.sku,
    contentLanguage: 'en',
    feedLabel: 'US',
    attributes: {
      title: product.name,
      description: product.description,
      link: `${SITE_URL}/products/${product.id}`,
      imageLink: `${SITE_URL}${product.image}`,
      availability: product.inStock ? 'in stock' : 'out of stock',
      condition: 'used',
      brand: 'AUAPW',
      price: { amountMicros: String(Math.round(product.price * 1_000_000)), currencyCode: 'USD' },
      productTypes: [product.category],
      customAttributes: [{ name: 'fits', value: product.fits }],
    },
  }
}

async function merchantToken(userId: string) {
  const params = {
    subject: subject(userId),
    scopes: ['https://www.googleapis.com/auth/content'],
  }

  try {
    return { token: await getToken(CONNECTOR_UID, params) }
  } catch (error) {
    if (error instanceof UserAuthorizationRequiredError) {
      const authorization = await startAuthorization(CONNECTOR_UID, params, {
        callbackUrl: `${SITE_URL}/api/admin/merchant-center/callback`,
      })
      return { token: null, authorizationUrl: authorization.url }
    }
    throw error
  }
}

export async function syncCatalogToMerchantCenter(userId: string): Promise<MerchantSyncResult> {
  const auth = await merchantToken(userId)
  if (!auth.token) return { synced: 0, failed: [], authorizationUrl: auth.authorizationUrl }

  const result: MerchantSyncResult = { synced: 0, failed: [] }
  for (const product of PRODUCTS_CATALOG.filter((item) => item.inStock)) {
    const response = await fetch(`${MERCHANT_API}/accounts/${MERCHANT_ACCOUNT_ID}/productInputs:insert`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ productInput: productInput(product), dataSource: 'accounts/5828832429/dataSources/online' }),
    })
    if (response.ok) result.synced += 1
    else {
      const body = await response.text()
      result.failed.push({ sku: product.sku, error: body.slice(0, 500) })
      if (response.status === 404 || response.status === 400) result.prerequisite = 'Create or select an online product data source in Merchant Center, then run the sync again.'
    }
  }
  return result
}

export { MERCHANT_ACCOUNT_ID }
