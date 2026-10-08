import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// Guards every /admin/cms page, including the client-component ones that
// can't check the session themselves.
export default async function AdminCmsLayout({ children }: { children: ReactNode }) {
  if (!(await getAdminSession())) redirect('/admin/login')
  return children
}
