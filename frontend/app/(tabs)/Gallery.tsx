import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, ScrollView, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, FlatList, ActivityIndicator, Modal } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const imageSize = (width - 49) / 3; // 3 images per row with 12 padding on sides

type ImageType = string; // Change this if your API provides an object instead

const FullScreenImage: React.FC<{ uri: string; onClose: () => void }> = ({ uri, onClose }) => (
  <Modal animationType="fade" transparent={true} visible={true}>
    <View style={styles.fullScreenContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={30} color="#fff" />
      </TouchableOpacity>
      <Image source={{ uri }} style={styles.fullScreenImage} resizeMode="contain" />
    </View>
  </Modal>
);

const Gallery: React.FC = () => {
  const [originalImages, setOriginalImages] = useState<ImageType[]>([]);
  const [detectedImages, setDetectedImages] = useState<ImageType[]>([]);
  const [showOriginal, setShowOriginal] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.1.3:8000/api/images/');
      const data = await response.json();
      setOriginalImages(data.original_images); // Assuming this is an array of strings (URLs)
      setDetectedImages(data.detected_images); // Assuming this is also an array of strings (URLs)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const getImageName = (imageUrl: string) => {
    return imageUrl.split('/').pop() || 'Unnamed Image';
  };

  const handleImagePress = (imageUrl: string) => {
    setFullScreenImage(`http://192.168.1.3:8000${imageUrl}`);
  };

  const renderImageItem = ({ item }: { item: ImageType }) => (
    <TouchableOpacity 
      style={styles.imageContainer} 
      onPress={() => handleImagePress(item)}
    >
      <Image
        source={{ uri: `http://192.168.1.3:8000${item}` }}
        style={styles.image}
      />
      <Text style={styles.imageName} numberOfLines={1} ellipsizeMode="tail">
        {getImageName(item)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchImages}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#732626" />
              ) : (
                <Ionicons name="refresh" size={24} color="#732626" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>
            {showOriginal ? 'Original Images' : 'Detected Images'}
          </Text>
          <FlatList
            data={showOriginal ? originalImages : detectedImages}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.imageGrid}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      {fullScreenImage && (
        <FullScreenImage 
          uri={fullScreenImage} 
          onClose={() => setFullScreenImage(null)} 
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: Constants.statusBarHeight,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align buttons to the start
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 10,
    elevation: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#732626',
    backgroundColor: 'transparent',
    marginRight: 5, // Add some margin to the right to space the buttons slightly
  },
  activeButton: {
    backgroundColor: '#732626',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#732626',
  },
  activeButtonText: {
    color: '#fff',
  },
  refreshButton: {
    padding: 10,
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
    paddingHorizontal: 6,
  },
  imageContainer: {
    width: imageSize,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#420707',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: imageSize,
    borderRadius: 8,
  },
  imageName: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Ensure child elements can position relative to this container
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    top: 40, // Adjust vertical position as needed
    right: 20, // Float to the rightmost end
    zIndex: 1, // Ensure it stays above other elements
  },
});


export default Gallery;
