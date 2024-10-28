import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, KeyboardAvoidingView, Platform, SafeAreaView, Alert, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router"; 
import { ArrowLeft } from 'lucide-react-native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.6:8000/api/login/', {
        username,
        password
      });

      const { access: token, user_role } = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', user_role);

      Alert.alert('Login Successful', 'Welcome back!');
      console.log('Token received:', token);
      console.log('User role:', user_role);

      if (user_role === 'admin') {
        router.push('./AdminPage');
      } else {
        router.push('/Home');
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error.response?.data || error.message);
        Alert.alert('Login Failed', error.response?.data?.detail || 'Invalid credentials');
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Login Failed', 'An unexpected error occurred');
      }
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        {/* Add your image here */}
        <Image
          source={require('./assets/login.png')}  
          style={styles.logo}  
          resizeMode="contain"
        />

        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <View style={styles.backButtonCircle}>
            <ArrowLeft color="white" size={20} />
          </View>
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.whiteContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity onPress={() => Alert.alert('Forgot Password')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/Register')}>
            <Text style={styles.signUpText}>
              Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#800000',  // Maroon background
  },
  topSection: {
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',  // Center the image horizontally
    paddingBottom: 20,
  },
  logo: {
    width: '100%',  // Adjust the width to fit your image
    height: '100%',  // Adjust the height to fit your image
    marginBottom: -50,  // Add some margin below the image if necessary
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'black',  // Black background for the button
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#888',
    textAlign: 'right',
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    color: 'black',
    fontSize: 14,
  },
  signUpLink: {
    fontWeight: 'bold',
    color: '#800000', 
  },
});

export default Login;
