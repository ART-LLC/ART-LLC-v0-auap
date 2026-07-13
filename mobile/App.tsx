import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Intercom } from '@intercom/react-native'
import HomeScreen from './screens/HomeScreen'
import BrandsScreen from './screens/BrandsScreen'
import PartsScreen from './screens/PartsScreen'
import SearchScreen from './screens/SearchScreen'
import ProfileScreen from './screens/ProfileScreen'
import BrandDetailScreen from './screens/BrandDetailScreen'
import ProductDetailScreen from './screens/ProductDetailScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Intercom
        await Intercom.registerIdentifiedUser({
          userId: userId || 'anonymous-user',
          email: 'support@auapw.com',
        })

        // Boot Intercom with JWT token
        const token = await fetchIntercomJWT(userId)
        if (token) {
          await Intercom.setUserHash(token)
        }

        await Intercom.displayMessenger()
        setIsReady(true)
      } catch (error) {
        console.error('[v0] Intercom initialization error:', error)
        setIsReady(true)
      }
    }

    initializeApp()
  }, [userId])

  const fetchIntercomJWT = async (id: string | null): Promise<string | null> => {
    try {
      const response = await fetch('https://www.auapw.com/api/intercom-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id || 'mobile-user',
          email: 'user@example.com',
          name: 'Mobile User',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.token
      }
    } catch (error) {
      console.error('[v0] JWT fetch error:', error)
    }
    return null
  }

  if (!isReady) {
    return null
  }

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName = 'home'
              if (route.name === 'Home') iconName = 'home'
              else if (route.name === 'Brands') iconName = 'tag'
              else if (route.name === 'Parts') iconName = 'car-part'
              else if (route.name === 'Search') iconName = 'magnify'
              else if (route.name === 'Profile') iconName = 'account'

              return <MaterialCommunityIcons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: '#d4ddf5',
            tabBarInactiveTintColor: '#6a7590',
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#2a2f38',
              borderTopColor: '#5a6270',
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
          <Tab.Screen name="Brands" component={BrandsScreen} options={{ title: 'Brands' }} />
          <Tab.Screen name="Parts" component={PartsScreen} options={{ title: 'Parts' }} />
          <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </>
  )
}
