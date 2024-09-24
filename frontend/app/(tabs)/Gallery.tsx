import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Gallery = () => {
  const [selectedTab, setSelectedTab] = useState('profile'); 

  const renderContent = () => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/tranpLOGO.png')}
          style={styles.contentImage}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
 
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  contentImage: {
    width: 200, 
    height: 200,
    resizeMode: 'contain',
    opacity: 0.4,
  },
});

export default Gallery;