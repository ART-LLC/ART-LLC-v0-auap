import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getWidgetChatReply } from '@/lib/widget-chat'

const requestSchema = z.object({
  message: z.string().trim().min(1).max(1_000),
})

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json()
    const result = requestSchema.safeParse(payload)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Please enter a message between 1 and 1,000 characters.' },
        { status: 400 },
      )
    }

    return NextResponse.json(getWidgetChatReply(result.data.message))
  } catch {
    return NextResponse.json(
      { error: 'We could not process that message. Please try again.' },
      { status: 400 },
    )
  }
}
