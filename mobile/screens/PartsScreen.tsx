import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function PartsScreen({ navigation }: any) {
  const [parts, setParts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParts()
  }, [])

  const fetchParts = async () => {
    try {
      setLoading(true)
      const categories = ['Engines', 'Transmissions', 'Body Parts', 'Suspension', 'Electrical', 'Cooling', 'Exhaust', 'Interior', 'Drivetrain']
      setParts(categories)
    } catch (error) {
      console.error('[v0] Failed to fetch parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderPartItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.partCard}
      onPress={() => navigation.navigate('Parts', { category: item })}
    >
      <MaterialCommunityIcons name="car-part" size={32} color="#d4ddf5" />
      <View style={styles.partInfo}>
        <Text style={styles.partName}>{item}</Text>
        <Text style={styles.partCount}>2,000+ items</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#6a7590" />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop by Parts</Text>
        <Text style={styles.headerSubtitle}>Browse our complete inventory</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d4ddf5" />
        </View>
      ) : (
        <FlatList
          data={parts}
          renderItem={renderPartItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  partCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3f48',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  partInfo: {
    flex: 1,
    marginLeft: 12,
  },
  partName: {
    fontSize: 16,
    color: '#f5f7fc',
    fontWeight: '500',
  },
  partCount: {
    fontSize: 12,
    color: '#a5b0c0',
    marginTop: 4,
  },
})
