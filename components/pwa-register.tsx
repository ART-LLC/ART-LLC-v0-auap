'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('[v0] Service Worker registered:', registration.scope)
          })
          .catch((error) => {
            console.error('[v0] Service Worker registration failed:', error)
          })

        // Check for updates periodically
        setInterval(() => {
          navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration) {
              registration.update()
            }
          })
        }, 60000) // Check every minute
      })

      // Listen for controller change (update ready)
      navigator.serviceWorker.addEventListener('controller', () => {
        // Prompt user about app update if needed
        console.log('[v0] Service Worker updated')
      })
    }
  }, [])

  return null
}
