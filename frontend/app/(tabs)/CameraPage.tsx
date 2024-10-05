import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet } from 'react-native';
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
      const response = await axios.post('http://192.168.31.52:8000/api/detect/', formData, {
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',}}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openImagePickerAsync}>
          <Image source={require('../assets/UploadPic.png')} style={styles.iconImage} />
          <Text style={styles.buttonText}>Pick a photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openCameraAsync}>
          <Image source={require('../assets/TakePhoto - Copy.png')} style={styles.iconImage} />
          <Text style={styles.buttonText}>Take a photo</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <View style={{ alignItems: 'center' }}>
          <Image source={{ uri: selectedImage }} style={{ width: 340, height: 250, marginVertical: 15, borderRadius: 15, }} />
          <TouchableOpacity style={styles.buttonResult} onPress={uploadImage}>
            <Text style={styles.buttonTextUpload}>Upload and Detect Objects</Text>
          </TouchableOpacity>
        </View>
      )}

      {detections.length > 0 && (
        <View style={{ marginTop: 10 }}>
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

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 10,
    width: 145,
    height: 145,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#732626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 5,
    shadowRadius: 2,
    elevation: 50,
  },
  buttonResult: {
    backgroundColor: '#732626',
    paddingVertical: 15,   // Smaller padding for a smaller button
    paddingHorizontal: 15, // Adjust the horizontal padding as needed
    borderRadius: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center'
  },
  buttonTextUpload: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  iconImage: {
    width: 50,
    height: 50,
    marginBottom: 5, // Adjust this to space the image and text
  },
});

export default CameraPage;
