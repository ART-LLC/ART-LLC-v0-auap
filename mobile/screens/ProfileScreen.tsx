import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account-circle" size={64} color="#d4ddf5" />
        </View>
        <Text style={styles.name}>Guest User</Text>
        <Text style={styles.email}>Not logged in</Text>
      </View>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Sign In / Create Account</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="history" size={20} color="#d4ddf5" />
          <Text style={styles.menuText}>Recent Searches</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#6a7590" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="heart" size={20} color="#d4ddf5" />
          <Text style={styles.menuText}>Wishlist</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#6a7590" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="receipt" size={20} color="#d4ddf5" />
          <Text style={styles.menuText}>Orders</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#6a7590" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Info</Text>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="help-circle" size={20} color="#d4ddf5" />
          <Text style={styles.menuText}>Help & FAQ</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#6a7590" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="phone" size={20} color="#d4ddf5" />
          <Text style={styles.menuText}>Contact Us</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#6a7590" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="file-document" size={20} color="#d4ddf5" />
          <Text style={styles.menuText}>Terms & Privacy</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#6a7590" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="information" size={20} color="#d4ddf5" />
          <Text style={styles.menuText}>About AUAPW</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#6a7590" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>AUAPW LLC Mobile</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
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
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3f48',
  },
  avatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f5f7fc',
  },
  email: {
    fontSize: 12,
    color: '#a5b0c0',
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#d4ddf5',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f5f7fc',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3f48',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: '#f5f7fc',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#a5b0c0',
  },
  version: {
    fontSize: 10,
    color: '#6a7590',
    marginTop: 4,
  },
})
