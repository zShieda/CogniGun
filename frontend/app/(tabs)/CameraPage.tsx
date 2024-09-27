import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
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

  const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    try {
      const imageBlob = await uriToBlob(selectedImage);
      formData.append('image', imageBlob, 'photo.jpg');

      const response = await axios.post('http://192.168.254.111:8000/api/detect/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDetections(response.data.detections);
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Error uploading image");
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
