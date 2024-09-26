import React, { useState } from 'react';
import { Button, Image, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function CameraPage() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);

  // Function to launch camera
  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      detectObjects(result.assets[0].uri);
    }
  };

  // Function to pick image from gallery
  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      detectObjects(result.assets[0].uri);
    }
  };

  // Function to send image to Django backend for object detection
  const detectObjects = async (uri: string) => {
    let localUri = uri;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename!);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('image', { uri: localUri, name: filename, type } as any);

    try {
      const response = await axios.post('http://192.168.1.2:8000/api/detect/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDetections(response.data.detections);
    } catch (error) {
      console.error('Error detecting objects:', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Buttons to choose between camera and gallery */}
      <Button title="Take a picture from camera" onPress={pickImageFromCamera} />
      <Button title="Choose an image from gallery" onPress={pickImageFromGallery} />

      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}

      {detections.length > 0 && (
        <View>
          {detections.map((detection, index) => (
            <View key={index}>
              <Text>
                Detected Object: {detection.class} Confidence: {detection.confidence}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
