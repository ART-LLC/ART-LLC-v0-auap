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
    // Initialize Intercom with app_id and optional user data
    const intercomSettings: any = {
      app_id: 'pnwvqy83',
    }

    // Add user data if available
    if (user) {
      if (user.id) intercomSettings.user_id = user.id
      if (user.name) intercomSettings.name = user.name
      if (user.email) intercomSettings.email = user.email
      if (user.createdAt) intercomSettings.created_at = user.createdAt
    }

    // Initialize Intercom messenger
    Intercom(intercomSettings)
  }, [user])

  return null
}
