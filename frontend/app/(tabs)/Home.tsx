import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { format } from 'date-fns'; // Importing date-fns for date formatting

const screenWidth = Dimensions.get("window").width;

interface GPSDataItem {
  latitude: number;
  longitude: number;
  timestamp: string;
}

const HomeScreen: React.FC = () => {
  const [gpsData, setGpsData] = useState<GPSDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGPSData = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get('http://192.168.254.111:8000/api/get-gps-data/');
      setGpsData(response.data.gps_data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGPSData();
  }, [fetchGPSData]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  // Calculate total gunshots
  const totalGunshots = gpsData.length;

  // Calculate gunshot counts by unique date (day and month)
  const gunshotCountsByDate = gpsData.reduce((acc: Record<string, number>, item) => {
    const date = format(new Date(item.timestamp), 'dd MMM'); // Format date as "01 Oct"
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date]++;
    return acc;
  }, {});

  // Prepare chart data (reverse the order of dates)
  const chartData = {
    labels: Object.keys(gunshotCountsByDate).reverse(), // Reverse the dates so latest is on the left
    datasets: [
      {
        data: Object.values(gunshotCountsByDate).reverse(), // Reverse the data points to match the labels
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Total Gunshots Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Gunshots</Text>
          <Text style={styles.cardValue}>{totalGunshots}</Text>
        </View>

        {/* Bar Chart Section */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Gunshot Activity by Date</Text>
          <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
            <BarChart
              data={chartData}
              width={Math.max(screenWidth, chartData.labels.length * 60)} // Adjust width dynamically for scrolling
              height={220}
              yAxisLabel=""
              yAxisSuffix=" shots"
              chartConfig={chartConfig}
              style={styles.chartStyle}
              fromZero={true}
              showValuesOnTopOfBars={true}
              withInnerLines={true}
              showBarTops={false}
              flatColor={true}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const chartConfig = {
  backgroundColor: "#8B0000",
  backgroundGradientFrom: "#8B0000",
  backgroundGradientTo: "#ff6347",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  barPercentage: 0.6,
  propsForLabels: {
    fontSize: 12,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#8B0000',
    paddingTop: 35,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 8,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#B22222',
  },
});

export default HomeScreen;
