import React, { useState } from 'react';
import { View, Button, Image, Text, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CameraPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0].uri);
    }
  };

  const openCameraAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }
    let cameraResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cameraResult.canceled) {
      setSelectedImage(cameraResult.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    try {
      const filename = selectedImage.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';

      formData.append('image', {
        uri: Platform.OS === 'ios' ? selectedImage.replace('file://', '') : selectedImage,
        name: filename,
        type,
      } as any);

      console.log('Uploading image...');
      const response = await axios.post('http://192.168.254.111:8000/api/detect/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // Increased timeout to 10 seconds
      });

      console.log('Upload response:', response.data);
      setDetections(response.data.detections);
    } catch (error) {
      console.error("Error uploading image: ", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      }
      alert("Error uploading image. Check console for details.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pick a photo from gallery" onPress={openImagePickerAsync} />
      <Button title="Take a photo with camera" onPress={openCameraAsync} /> 
      
      {selectedImage && (
        <View>
          <Image source={{ uri: selectedImage }} style={{ width: 300, height: 300, marginVertical: 20 }} />
          <Button title="Upload and Detect Objects" onPress={uploadImage} />
        </View>
      )}

      {detections.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text>Detections:</Text>
          {detections.map((detection, index) => (
            <Text key={index}>
              Object {index + 1}: {detection.class} - {Math.round(detection.confidence * 100)}% confidence
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default CameraPage;