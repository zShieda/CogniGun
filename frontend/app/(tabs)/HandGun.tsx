import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GPSDataItem {
  latitude: number;
  longitude: number;
  timestamp: string;
}

const HandGun: React.FC = () => {
  const [gpsData, setGpsData] = useState<GPSDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGPSData();
  }, []);

  const fetchGPSData = async () => {
    try {
      setIsLoading(true);
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
    }
  };

  const renderItem = ({ item }: { item: GPSDataItem }) => (
    <View style={styles.item}>
      <Text>Latitude: {item.latitude}</Text>
      <Text>Longitude: {item.longitude}</Text>
      <Text>Timestamp: {new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Gun Data</Text>
      <TouchableOpacity onPress={fetchGPSData} style={styles.reloadButton}>
        <Ionicons name="reload" size={24} color="blue" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
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
    <FlatList
      data={gpsData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={<Text style={styles.emptyText}>No GPS data available</Text>}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  reloadButton: {
    padding: 10,
  },
  retryButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HandGun;