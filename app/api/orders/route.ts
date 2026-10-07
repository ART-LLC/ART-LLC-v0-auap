import { NextResponse } from "next/server"
import { createOrder } from "@/lib/followup"
import { notifyNewOrder } from "@/lib/followup-notify"
import { priceCart } from "@/lib/order-pricing"
import { OrderSchema } from "@/lib/checkout-schema"

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const parsed = OrderSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 })
  }
  const { customer, items } = parsed.data

  const pricing = priceCart(items)
  if (!pricing.ok) return NextResponse.json({ error: pricing.error }, { status: 422 })

  try {
    const order = await createOrder({
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`,
      customerNotes: customer.notes,
      items: pricing.lines,
      subtotal: pricing.subtotal,
      tax: pricing.tax,
      shippingCost: pricing.shippingCost,
      totalAmount: pricing.totalAmount,
    })
    await notifyNewOrder(order, new URL(request.url).origin)
    return NextResponse.json({ ok: true, orderNumber: order.orderNumber, totalAmount: order.totalAmount })
  } catch (err) {
    console.error("[orders] Failed to save order:", err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: "We couldn't place your order. Please call us at (708) 896-2383." },
      { status: 500 },
    )
  }
}
