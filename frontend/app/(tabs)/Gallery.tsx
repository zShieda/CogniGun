import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');
const imageSize = (width - 36) / 3; // 3 images per row with 12 padding on sides

type ImageType = string;

const Gallery: React.FC = () => {
  const [originalImages, setOriginalImages] = useState<ImageType[]>([]);
  const [detectedImages, setDetectedImages] = useState<ImageType[]>([]);
  const [showOriginal, setShowOriginal] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://192.168.254.111:8000/api/images/')
      .then((response) => response.json())
      .then((data) => {
        setOriginalImages(data.original_images);
        setDetectedImages(data.detected_images);
      })
      .catch((error) => console.error(error));
  }, []);

  const renderImageGrid = (images: ImageType[]) => (
    <View style={styles.imageGrid}>
      {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: `http://192.168.254.111:8000${image}` }}
          style={styles.image}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, showOriginal && styles.activeButton]}
            onPress={() => setShowOriginal(true)}
          >
            <Text style={[styles.buttonText, showOriginal && styles.activeButtonText]}>Original Images</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !showOriginal && styles.activeButton]}
            onPress={() => setShowOriginal(false)}
          >
            <Text style={[styles.buttonText, !showOriginal && styles.activeButtonText]}>Detected Images</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.sectionTitle}>
            {showOriginal ? 'Original Images' : 'Detected Images'}
          </Text>
          {renderImageGrid(showOriginal ? originalImages : detectedImages)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 6,
  },
  image: {
    width: imageSize,
    height: imageSize,
    margin: 6,
    borderRadius: 8,
  },
});

export default Gallery;