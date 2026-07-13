import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import axios from 'axios'

export default function BrandsScreen({ navigation }: any) {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      // Fetch from backend
      const response = await axios.get('https://www.auapw.com/api/brands')
      setBrands(response.data.brands || [])
    } catch (error) {
      console.error('[v0] Failed to fetch brands:', error)
      // Fallback brands
      setBrands(['Ford', 'Chevrolet', 'Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Volkswagen'])
    } finally {
      setLoading(false)
    }
  }

  const filteredBrands = brands.filter((brand) =>
    (typeof brand === 'string' ? brand : brand.name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  const renderBrandItem = ({ item }: any) => {
    const brandName = typeof item === 'string' ? item : item.name
    return (
      <TouchableOpacity
        style={styles.brandCard}
        onPress={() => navigation.navigate('BrandDetail', { brand: brandName })}
      >
        <MaterialCommunityIcons name="store" size={32} color="#d4ddf5" />
        <Text style={styles.brandCardText}>{brandName}</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#6a7590" />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Brands</Text>
        <Text style={styles.headerSubtitle}>50+ Auto Brands Available</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#6a7590" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search brands..."
          placeholderTextColor="#6a7590"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Brands List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d4ddf5" />
        </View>
      ) : (
        <FlatList
          data={filteredBrands}
          renderItem={renderBrandItem}
          keyExtractor={(item, index) => (typeof item === 'string' ? item : item.id || index.toString())}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5a5f68',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f5f7fc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#a5b0c0',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3f48',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#f5f7fc',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3f48',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  brandCardText: {
    flex: 1,
    fontSize: 16,
    color: '#f5f7fc',
    fontWeight: '500',
    marginLeft: 12,
  },
})
