import { NextResponse } from "next/server"
import { OrderSchema } from "@/lib/checkout-schema"
import { createStripeCheckoutSession } from "@/lib/stripe-checkout"

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

  const result = await createStripeCheckoutSession(parsed.data.customer, parsed.data.items)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 })
  }

  return NextResponse.json({
    clientSecret: result.clientSecret,
    orderNumber: result.orderNumber,
    totalAmount: result.totalAmount,
  })
}
