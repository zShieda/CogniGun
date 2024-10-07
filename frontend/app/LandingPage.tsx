import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    marginBottom: 40,
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
