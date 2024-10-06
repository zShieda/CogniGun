import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      const response = await fetch('http://192.168.254.111:8000/api/get-gps-data/');
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
      <Text style={styles.itemText}>Latitude: {item.latitude.toFixed(6)}</Text>
      <Text style={styles.itemText}>Longitude: {item.longitude.toFixed(6)}</Text>
      <Text style={styles.itemText}>Timestamp: {new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Gun Location Data</Text>
      <TouchableOpacity onPress={onRefresh} style={styles.reloadButton}>
        <Ionicons name="reload" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchGPSData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f0f0f0" barStyle="dark-content" />
      <FlatList
        data={gpsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={<Text style={styles.emptyText}>No GPS data available</Text>}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#007AFF']} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  reloadButton: {
    padding: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HandGun;