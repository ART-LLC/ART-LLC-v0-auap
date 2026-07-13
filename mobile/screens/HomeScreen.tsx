import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/60x60?text=AUAPW' }}
          style={styles.logo}
        />
        <View>
          <Text style={styles.title}>AUAPW LLC</Text>
          <Text style={styles.subtitle}>Quality Used Auto Parts</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>2,000+</Text>
          <Text style={styles.statLabel}>Verified Yards</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>Brands</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>$240</Text>
          <Text style={styles.statLabel}>Flat Rate Shipping</Text>
        </View>
      </View>

      {/* Featured Categories */}
      <Text style={styles.sectionTitle}>Shop by Category</Text>
      <View style={styles.categoryGrid}>
        {['Engines', 'Transmissions', 'Body Parts', 'Suspension'].map((category) => (
          <TouchableOpacity key={category} style={styles.categoryCard}>
            <MaterialCommunityIcons name="car-part" size={40} color="#d4ddf5" />
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Brands */}
      <Text style={styles.sectionTitle}>Popular Brands</Text>
      <View style={styles.brandList}>
        {['Ford', 'Chevrolet', 'Toyota', 'Honda'].map((brand) => (
          <TouchableOpacity key={brand} style={styles.brandItem}>
            <Text style={styles.brandName}>{brand}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6a7590" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Call to Action */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaButton}>
          <MaterialCommunityIcons name="magnify" size={20} color="#1a1a1a" />
          <Text style={styles.ctaText}>Browse All Parts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctaButton, styles.ctaButtonSecondary]}>
          <MaterialCommunityIcons name="phone" size={20} color="#d4ddf5" />
          <Text style={styles.ctaTextSecondary}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5a5f68',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3a3f48',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5f7fc',
  },
  subtitle: {
    fontSize: 12,
    color: '#a5b0c0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d4ddf5',
  },
  statLabel: {
    fontSize: 10,
    color: '#a5b0c0',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f5f7fc',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#3a3f48',
    borderRadius: 8,
    margin: '1%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#f5f7fc',
    marginTop: 8,
    textAlign: 'center',
  },
  brandList: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  brandItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3a3f48',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 14,
    color: '#f5f7fc',
    fontWeight: '500',
  },
  ctaContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  ctaButton: {
    flex: 1,
    backgroundColor: '#d4ddf5',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d4ddf5',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  ctaTextSecondary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d4ddf5',
  },
})
