import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function BrandDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Brand Detail Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#5a5f68' },
  text: { color: '#f5f7fc' },
})
