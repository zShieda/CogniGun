import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

const LandingPage = () => {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/Login');
  };

  const navigateToRegister = () => {
    router.push('/Register');
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Let's Get Started!</Text>

      {/* Image with spotlight effect */}
      <View style={styles.imageWrapper}>
        <View style={styles.spotlight} />
        <Image
          source={require('./assets/kidz.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={navigateToRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Log In Link */}
      <TouchableOpacity onPress={navigateToLogin}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#800000', 
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 40,
  },
  spotlight: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'white',
    bottom: -95,
    left: 50,
    transform: [
      { scaleX: 1 },
      { scaleY: 0.3 },
    ],
    opacity: 1,
    zIndex: 1,
  },
  image: {
    width: 400,
    height: 300,
    zIndex: 2,
  },
  button: {
    backgroundColor: 'black', 
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: 'white', 
    fontSize: 16,
  },
  loginLink: {
    color: 'black', 
    fontWeight: 'bold',
  },
});

export default LandingPage;