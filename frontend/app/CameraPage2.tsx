import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface ImageDisplayPageProps {
  selectedImage: string;
  onClose: () => void;
}

const ImageDisplayPage: React.FC<ImageDisplayPageProps> = ({ selectedImage, onClose }) => {
  const [detections, setDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    const formData = new FormData();
    try {
      setLoading(true);
      const filename = selectedImage.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';

      formData.append('image', {
        uri: Platform.OS === 'ios' ? selectedImage.replace('file://', '') : selectedImage,
        name: filename,
        type,
      } as any);

      const response = await axios.post('http://192.168.254.111:8000/api/detect/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });

      setDetections(response.data.detections);
    } catch (error) {
      alert("Error uploading image. Please try again.");
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
      <TouchableOpacity style={styles.buttonResult} onPress={uploadImage}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonTextUpload}>Upload and Detect Objects</Text>
        )}
      </TouchableOpacity>

      {detections.length > 0 && (
        <View style={styles.detectionContainer}>
          <Text style={styles.detectionTitle}>Detections:</Text>
          {detections.map((detection, index) => (
            <Text key={index} style={styles.detectionText}>
              Object {index + 1}: {detection.class} - {Math.round(detection.confidence * 100)}% confidence
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imagePreview: {
    width: 340,
    height: 250,
    marginVertical: 15,
    borderRadius: 15,
  },
  buttonResult: {
    backgroundColor: '#732626',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 15,
  },
  buttonTextUpload: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  detectionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  detectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detectionText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ImageDisplayPage;