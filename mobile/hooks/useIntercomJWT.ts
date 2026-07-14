import { useEffect, useState } from 'react'
import { Intercom } from '@intercom/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const API_BASE = 'https://www.auapw.com'

interface IntercomUser {
  userId: string
  email?: string
  name?: string
}

export const useIntercomJWT = (user: IntercomUser | null) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeIntercom = async () => {
      try {
        if (!user?.userId) {
          // Initialize as anonymous
          await Intercom.registerUnidentifiedUser()
          await Intercom.displayMessenger()
          setIsInitialized(true)
          return
        }

        // Fetch JWT token from backend
        const token = await fetchIntercomJWT(user)
        
        if (token) {
          // Register identified user with JWT
          await Intercom.registerIdentifiedUser({
            userId: user.userId,
            email: user.email,
          })
          
          // Set the JWT token for secure authentication
          await Intercom.setUserHash(token)
          
          // Display messenger
          await Intercom.displayMessenger()
        } else {
          // Fallback to anonymous if JWT fetch fails
          await Intercom.registerUnidentifiedUser()
          await Intercom.displayMessenger()
        }
        
        setIsInitialized(true)
      } catch (err) {
        console.error('[v0] Intercom initialization error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setIsInitialized(true)
      }
    }

    initializeIntercom()
  }, [user])

  return { isInitialized, error }
}

export const fetchIntercomJWT = async (user: IntercomUser): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${API_BASE}/api/intercom-token`,
      {
        userId: user.userId,
        email: user.email || 'mobile-user@auapw.com',
        name: user.name || 'Mobile User',
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    )

    if (response.data?.token) {
      // Cache token for offline support
      await AsyncStorage.setItem(
        `intercom-jwt-${user.userId}`,
        JSON.stringify({
          token: response.data.token,
          timestamp: Date.now(),
        })
      )
      return response.data.token
    }
  } catch (error) {
    console.warn('[v0] JWT token fetch failed, attempting offline cache:', error)
    
    // Try to use cached token
    try {
      const cached = await AsyncStorage.getItem(`intercom-jwt-${user.userId}`)
      if (cached) {
        const { token, timestamp } = JSON.parse(cached)
        // Use cached token if less than 1 hour old
        if (Date.now() - timestamp < 3600000) {
          return token
        }
      }
    } catch (cacheError) {
      console.error('[v0] Cache retrieval error:', cacheError)
    }
  }
  
  return null
}

export const handleIntercomMessage = async (message: {
  type: string
  data?: any
}) => {
  try {
    switch (message.type) {
      case 'intercom.show':
        await Intercom.displayMessenger()
        break
      case 'intercom.hide':
        await Intercom.hideMessenger()
        break
      case 'intercom.logout':
        await Intercom.logout()
        break
      default:
        console.log('[v0] Unknown Intercom message:', message.type)
    }
  } catch (error) {
    console.error('[v0] Intercom message handling error:', error)
  }
}
