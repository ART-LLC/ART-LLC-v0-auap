'use client'

import { useEffect } from 'react'
import Intercom from '@intercom/messenger-js-sdk'

const INTERCOM_APP_ID = 'pldz9zi1'

interface IntercomUser {
  id?: string
  name?: string
  email?: string
  createdAt?: number
}

interface IntercomProviderProps {
  user?: IntercomUser
}

export function IntercomProvider({ user }: IntercomProviderProps) {
  useEffect(() => {
    let cancelled = false

    const initIntercom = async () => {
      // Anonymous visitors: boot the messenger immediately.
      if (!user?.id) {
        Intercom({ app_id: INTERCOM_APP_ID })
        return
      }

      // Authenticated users: fetch a signed JWT from the server so Intercom
      // can verify the visitor's identity, then boot with it.
      try {
        const res = await fetch('/api/intercom-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.name,
          }),
        })

        if (cancelled) return

        if (res.ok) {
          const { token } = await res.json()
          Intercom({
            app_id: INTERCOM_APP_ID,
            intercom_user_jwt: token,
            user_id: user.id,
            name: user.name,
            email: user.email,
          })
        } else {
          // Signing failed (e.g. missing secret) — still show the messenger.
          Intercom({ app_id: INTERCOM_APP_ID })
        }
      } catch {
        if (!cancelled) Intercom({ app_id: INTERCOM_APP_ID })
      }
    }

    initIntercom()

    return () => {
      cancelled = true
    }
  }, [user])

  return null
}
