import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const body = await request.json()
    const { items, shippingAddress, billingAddress } = body

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!items || items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
    const total = subtotal + tax + shipping

    // Create order record
    const orderId = uuidv4()
    const orderNumber = `ORD-${Date.now()}`

    await db.insert(orders).values({
      id: orderId,
      userId: session.user.id,
      orderNumber,
      status: 'pending',
      subtotal: subtotal.toString(),
      tax: tax.toString(),
      shipping: shipping.toString(),
      total: total.toString(),
      paymentStatus: 'unpaid',
      shippingAddress: JSON.stringify(shippingAddress),
      billingAddress: JSON.stringify(billingAddress),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email || undefined,
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || '',
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?sessionId={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      metadata: {
        orderId,
        userId: session.user.id,
      },
    })

    return Response.json({
      sessionId: checkoutSession.id,
      orderId,
      url: checkoutSession.url,
    })
  } catch (error) {
    console.error('[v0] Checkout error:', error)
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
