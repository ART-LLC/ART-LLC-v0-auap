import { redirect } from 'next/navigation'

export async function GET(_: any, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Old Acura URL /acura/[slug] → /brands/acura/[slug]
  redirect(`/brands/acura/${encodeURIComponent(slug)}`)
}
