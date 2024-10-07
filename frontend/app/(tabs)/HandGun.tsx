import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, 
  RefreshControl, StatusBar, SafeAreaView, Platform, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

interface GPSDataItem {
  latitude: number;
  longitude: number;
  timestamp: string;
}

const HandGun: React.FC = () => {
  const [gpsData, setGpsData] = useState<GPSDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGPSData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('http://192.168.1.11:8000/api/get-gps-data/');
      if (!response.ok) {
        throw new Error(`Failed to fetch GPS data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setGpsData(data.gps_data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGPSData();
  }, [fetchGPSData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchGPSData();
  }, [fetchGPSData]);

  const renderItem = ({ item }: { item: GPSDataItem }) => (
    <View style={styles.item}>
      <Text style={styles.label}>Latitude:</Text>
      <Text style={styles.value}>{item.latitude.toFixed(6)}</Text>
      <Text style={styles.label}>Longitude:</Text>
      <Text style={styles.value}>{item.longitude.toFixed(6)}</Text>
      <Text style={styles.label}>Timestamp:</Text>
      <Text style={styles.value}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Gun Location Data</Text>
      <TouchableOpacity onPress={onRefresh} style={styles.reloadButton}>
        <Ionicons name="reload" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8B0000" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchGPSData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <FlatList
        data={gpsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={<Text style={styles.emptyText}>No GPS data available</Text>}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#8B0000']} />
        }
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    padding: 12, // Reduced padding to make items closer
    marginVertical: 8, // Less margin between items
    marginHorizontal: 15, // Reduced horizontal margin
    borderRadius: 8, // Rounded corners, slightly less rounded
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, // Lighter shadow
    shadowRadius: 3,
    elevation: 2, // Slight elevation for a subtle card effect
  },
  label: {
    fontSize: 14, // Slightly smaller font size
    fontWeight: '500',
    color: '#333',
    marginBottom: 2, // Reduced space between label and value
  },
  value: {
    fontSize: 14, // Slightly smaller font size
    fontWeight: '300',
    color: '#666',
    marginBottom: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#B22222',
    fontSize: 16, // Slightly smaller font
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16, // Slightly smaller text for empty state
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12, // Reduced padding in header
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 12, 
    backgroundColor: '#8B0000',
  },
  headerText: {
    fontSize: 18, // Slightly smaller header text
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reloadButton: {
    padding: 2, // Reduced padding for reload button
  },
  retryButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 10, // Slightly smaller retry button
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16, // Slightly smaller retry text
    fontWeight: 'bold',
  },
  listContentContainer: {
    paddingBottom: 15, // Reduced padding bottom for the list
  },
});

export default HandGun;
