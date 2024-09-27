import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Text } from 'react-native';

// Define the structure of the image data
interface ImageItem {
  id: string; // or number, depending on your backend response
  original_image_url: string;
  detected_image_url: string;
}

// Define the types for the ImageDisplay component's props
interface ImageDisplayProps {
  originalImageUrl: string;
  detectedImageUrl: string;
}

// ImageDisplay component
const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImageUrl, detectedImageUrl }) => (
  <View style={styles.imageContainer}>
    <Text>Original Image:</Text>
    <Image source={{ uri: originalImageUrl }} style={styles.image} />
    <Text>Detected Image:</Text>
    <Image source={{ uri: detectedImageUrl }} style={styles.image} />
  </View>
);

// Main Gallery component
const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]); // Use the ImageItem type here

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://192.168.254.111:8000/api/images/');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  
  // Use the correct URLs for the ImageDisplay component
  const renderItem = ({ item }: { item: ImageItem }) => (
    <ImageDisplay
      originalImageUrl={item.original_image_url} // Ensure this points to the correct backend URL
      detectedImageUrl={item.detected_image_url}
    />
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // Access id correctly here
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 5,
    resizeMode: 'contain',
  },
});

export default Gallery;
