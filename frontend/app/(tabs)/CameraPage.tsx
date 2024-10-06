import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageDisplayPage from '../CameraPage2';

const CameraPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermission = async (permissionType: 'camera' | 'mediaLibrary') => {
    const { granted } = await (permissionType === 'camera' 
      ? ImagePicker.requestCameraPermissionsAsync()
      : ImagePicker.requestMediaLibraryPermissionsAsync());
    
    if (!granted) {
      alert(`Permission to access the ${permissionType} is required!`);
      return false;
    }
    return true;
  };

  const launchPicker = async (pickerType: 'camera' | 'library') => {
    const permissionGranted = await requestPermission(pickerType === 'camera' ? 'camera' : 'mediaLibrary');
    if (!permissionGranted) return;

    const result = await (pickerType === 'camera' 
      ? ImagePicker.launchCameraAsync(pickerOptions)
      : ImagePicker.launchImageLibraryAsync(pickerOptions));

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickerOptions: ImagePicker.ImagePickerOptions = {
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Yolov9 Camera</Text>
      </View>
      <View style={styles.content}>
        {selectedImage ? (
          <ImageDisplayPage
            selectedImage={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        ) : (
          <View style={styles.buttonContainer}>
            <PickerButton
              onPress={() => launchPicker('camera')}
              iconSource={require('../assets/TakePhoto - Copy.png')}
              text="Take a photo"
            />
            <PickerButton
              onPress={() => launchPicker('library')}
              iconSource={require('../assets/UploadPic.png')}
              text="Pick a photo"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

interface PickerButtonProps {
  onPress: () => void;
  iconSource: any;
  text: string;
}

const PickerButton: React.FC<PickerButtonProps> = ({ onPress, iconSource, text }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Image source={iconSource} style={styles.iconImage} />
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B0000',
  },
  header: {
    backgroundColor: '#8B0000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#600000',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Enhanced shadow for more depth
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  iconImage: {
    width: 30,
    height: 30,
    tintColor: '#800000',
  },
});

export default CameraPage;
