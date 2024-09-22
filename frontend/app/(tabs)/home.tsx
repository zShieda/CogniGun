import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Replace localhost with the IP address of your laptop
    fetch('http://192.168.254.111:8080/api/test/')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);  // Update message state with the response
        setLoading(false);  // Set loading to false after fetching data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
};

export default HomeScreen;
