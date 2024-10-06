import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, StatusBar, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  middlename: string;
  birthday: string;
  age: number;
  address: string;
  contact_number: string;
  id_number: string;
}

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const ProfileComponent = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://192.168.254.111:8000/api/profile/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Full profile data:', response.data);
      setProfile(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const getDisplayValue = (value: string | null | undefined): string => {
    if (value === null || value === undefined) return 'Not set';
    if (value.trim() === '') return 'Not set';
    return value;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Profile Information</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8B0000']} />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : profile ? (
          <View style={styles.profileInfo}>
            <InfoItem icon="person" label="Username" value={getDisplayValue(profile.username)} />
            <InfoItem icon="email" label="Email" value={getDisplayValue(profile.email)} />
            <InfoItem icon="face" label="Name" value={getDisplayValue(`${profile.firstname || ''} ${profile.middlename || ''} ${profile.lastname || ''}`.trim())} />
            <InfoItem icon="cake" label="Birthday" value={getDisplayValue(profile.birthday)} />
            <InfoItem icon="trending-up" label="Age" value={getDisplayValue(profile.age?.toString())} />
            <InfoItem icon="location-on" label="Address" value={getDisplayValue(profile.address)} />
            <InfoItem icon="phone" label="Contact Number" value={getDisplayValue(profile.contact_number)} />
            <InfoItem icon="badge" label="ID Number" value={getDisplayValue(profile.id_number)} />
          </View>
        ) : (
          <Text style={styles.errorText}>No profile data available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ icon, label, value }: { icon: IconName; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <View style={styles.iconContainer}>
      <MaterialIcons name={icon} size={24} color="#8B0000" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#8B0000',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  profileInfo: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#757575',
  },
  value: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#B00020',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ProfileComponent;