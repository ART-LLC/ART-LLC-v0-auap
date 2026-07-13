import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setSearched(true)
    try {
      // Mock search results
      const mockResults = [
        { id: 1, name: 'Ford Engine 5.0L', brand: 'Ford', price: '$899' },
        { id: 2, name: 'Chevy Transmission AT', brand: 'Chevrolet', price: '$1,299' },
        { id: 3, name: 'Honda Suspension Kit', brand: 'Honda', price: '$599' },
      ]
      setResults(mockResults)
    } catch (error) {
      console.error('[v0] Search error:', error)
    }
  }

  const renderResultItem = ({ item }: any) => (
    <TouchableOpacity style={styles.resultCard}>
      <View>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultBrand}>{item.brand}</Text>
      </View>
      <Text style={styles.resultPrice}>{item.price}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Parts</Text>
      </View>

      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={20} color="#6a7590" />
        <TextInput
          style={styles.input}
          placeholder="Search by brand, part, or engine size..."
          placeholderTextColor="#6a7590"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        {query && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]) }}>
            <MaterialCommunityIcons name="close" size={20} color="#6a7590" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {searched && results.length > 0 && (
        <>
          <Text style={styles.resultsTitle}>{results.length} Results Found</Text>
          <FlatList
            data={results}
            renderItem={renderResultItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
          />
        </>
      )}

      {searched && results.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="magnify" size={48} color="#6a7590" />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try different keywords</Text>
        </View>
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3f48',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#f5f7fc',
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#d4ddf5',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f5f7fc',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3a3f48',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultName: {
    fontSize: 14,
    color: '#f5f7fc',
    fontWeight: '500',
  },
  resultBrand: {
    fontSize: 12,
    color: '#a5b0c0',
    marginTop: 4,
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d4ddf5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#f5f7fc',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#a5b0c0',
    marginTop: 4,
  },
})
