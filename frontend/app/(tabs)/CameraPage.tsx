import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageDisplayPage from '../CameraPage2';

const CameraPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the gallery is required!");
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
      alert("Permission to access the camera is required!");
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

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <ImageDisplayPage
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      ) : (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  iconImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
});

export default CameraPage;