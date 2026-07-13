'use client'

import { useEffect } from 'react'

interface IntercomUser {
  id?: string
  name?: string
  email?: string
  createdAt?: number
}

interface IntercomProviderProps {
  user?: IntercomUser
}

declare global {
  interface Window {
    Intercom: any
  }
}

export function IntercomProvider({ user }: IntercomProviderProps) {
  useEffect(() => {
    // Load Intercom widget script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://widget.intercom.io/widget/pnwvqy83'
    document.head.appendChild(script)

    // Boot Intercom once the widget is loaded
    const bootIntercom = async () => {
      try {
        // If user is authenticated, fetch JWT and set it before booting
        if (user?.id) {
          try {
            // Fetch secure JWT token from server
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

              // Set JWT token before logging in user
              window.Intercom('setUserJwt', token)

              // Login authenticated user with same user_id used in JWT
              window.Intercom('login', {
                user_id: user.id,
                email: user.email,
                name: user.name,
              })
            } else {
              // Fallback: boot as anonymous
              window.Intercom('boot', {
                app_id: 'pnwvqy83',
              })
            }
          } catch (error) {
            console.warn('[Intercom] Token fetch failed, booting anonymously:', error)
            window.Intercom('boot', {
              app_id: 'pnwvqy83',
            })
          }
        } else {
          // Boot Intercom anonymously for non-authenticated users
          window.Intercom('boot', {
            app_id: 'pnwvqy83',
          })
        }
      } catch (error) {
        console.error('[Intercom] Boot error:', error)
      }
    }

    // Wait for window.Intercom to be available
    const waitForIntercom = setInterval(() => {
      if (typeof window.Intercom === 'function') {
        clearInterval(waitForIntercom)
        bootIntercom()
      }
    }, 100)

    // Timeout after 5 seconds
    const timeout = setTimeout(() => clearInterval(waitForIntercom), 5000)

    return () => {
      clearInterval(waitForIntercom)
      clearTimeout(timeout)
    }
  }, [user])

  return null
}
