'use client'

import { useEffect, useState } from 'react'
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
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeIntercom = async () => {
      try {
        // Initialize Intercom with app_id
        const intercomSettings: any = {
          app_id: 'pnwvqy83',
        }

        // If user data is available, fetch secure JWT token from server
        if (user?.id) {
          try {
            const tokenResponse = await fetch('/api/intercom-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                email: user.email,
                name: user.name,
              }),
            })

            if (tokenResponse.ok) {
              const { token } = await tokenResponse.json()
              // Use secure JWT token instead of exposing user data on client
              intercomSettings.identity_verification = {
                user_id: user.id,
                user_hash: token,
              }
            } else {
              console.warn('[Intercom] Failed to fetch JWT token, falling back to anonymous')
            }
          } catch (error) {
            console.warn('[Intercom] JWT token fetch error, proceeding as anonymous:', error)
          }
        }

        // Initialize Intercom messenger
        Intercom(intercomSettings)
        setIsInitialized(true)
      } catch (error) {
        console.error('[Intercom] Initialization error:', error)
      }
    }

    initializeIntercom()
  }, [user])

  return null
}
