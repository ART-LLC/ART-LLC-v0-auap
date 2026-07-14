'use client'

import { useEffect } from 'react'
import Intercom from '@intercom/messenger-js-sdk'

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
    try {
      // Initialize Intercom with app ID
      const settings: any = {
        app_id: 'pldz9zi1',
        api_base: 'https://api-iam.intercom.io',
      }

      // If user is authenticated, fetch and use JWT token
      if (user?.id) {
        fetch('/api/intercom-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.name,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.token) {
              settings.intercom_user_jwt = data.token
              Intercom(settings)
            }
          })
          .catch((err) => {
            console.warn('[Intercom] JWT failed, booting anonymously:', err)
            Intercom(settings)
          })
      } else {
        // Boot anonymously for non-authenticated users
        Intercom(settings)
      }
    } catch (error) {
      console.error('[Intercom] Failed to initialize:', error)
    }
  }, [user])

  return null
}
