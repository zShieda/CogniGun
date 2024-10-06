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
      {/* Image Preview Section */}
      <Image source={{ uri: selectedImage }} style={styles.imagePreview} />

      {/* Detection Results: placed between the image and buttons */}
      {detections.length > 0 && (
        <View style={styles.detectionContainer}>
          {detections.map((detection, index) => (
            <Text key={index} style={styles.detectionText}>
              Object {index + 1}: {detection.class} - {Math.round(detection.confidence * 100)}% confidence
            </Text>
          ))}
        </View>
      )}

      {/* Buttons: Upload and Back aligned on the right */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonResult} onPress={uploadImage}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonTextUpload}>Upload</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
  },
  imagePreview: {
    width: 340,
    height: 250,
    borderRadius: 10,
  },
  detectionContainer: {
    marginTop: 15,
    marginBottom: 15, // Creates space between detection text and buttons
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  detectionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
    alignItems: 'center',
    marginTop: 20,
    width: '90%', // Use most of the screen width
  },
  buttonResult: {
    backgroundColor: '#732626',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonTextUpload: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginLeft: 10, // Adds space between the buttons
  },
  closeButtonText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default ImageDisplayPage;
