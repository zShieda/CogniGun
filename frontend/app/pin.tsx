import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface PinProps {}

interface PinState {
  passcode: string;
  input: string;
}

class Pin extends Component<PinProps, PinState> {
  constructor(props: PinProps) {
    super(props);
    this.state = {
      passcode: '072930',
      input: '',
    };
  }

  handlePress = (digit: string) => {
    this.setState(prevState => ({
      input: prevState.input + digit
    }), () => {
      if (this.state.input.length === 6) {
        this.validatePasscode();
      }
    });
  }

  handleDelete = () => {
    this.setState(prevState => ({
      input: prevState.input.slice(0, -1)
    }));
  }

  validatePasscode = () => {
    if (this.state.input === this.state.passcode) {
      Alert.alert('Success', 'Passcode Correct!');
    } else {
      Alert.alert('Error', 'Incorrect Passcode');
      this.setState({ input: '' });
    }
  }

  handleNavigation = () => {
    router.push('/scan');
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topSection}>
          {/* Replace the require path with your image path */}
          <Image
  style={styles.tinyLogo}
  source={require('./assets/LOGO.png')}/>
          <Text style={styles.instructionText}>Enter your MPIN</Text>
          <View style={styles.passcodeContainer}>
            {Array(6).fill('').map((_, i) => (
              <View key={i} style={[
                styles.passcodeDot,
                { backgroundColor: this.state.input.length > i ? '#ac3939' : '#e5b3b3' }
              ]} />
            ))}
          </View>
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.keypad}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'].map((item, index) => (
              <TouchableOpacity
                key={item || `empty-${index}`}
                style={styles.button}
                onPress={() => {
                  if (item === 'delete') {
                    this.handleDelete();
                  } else if (item) {
                    this.handlePress(item);
                  }
                }}
              >
                {item === 'delete' ? (
                  <Ionicons name="backspace-outline" size={24} color="#999999" />
                ) : (
                  item && <Text style={styles.buttonText}>{item}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={this.handleNavigation}>
            <Ionicons name="qr-code-outline" size={24} color="#732626" />
            <Text style={styles.footerText}>Scan QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => Alert.alert('Forgot MPIN', 'Please contact support to reset your MPIN.')}>
            <Text style={styles.footerText}>Forgot MPIN?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tinyLogo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    marginTop:10,
  },
  instructionText: {
    fontSize: 18,
    color: '#999999', 
    fontWeight: '500',
    marginTop: 10,
  },
  passcodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    maxWidth: 250,
  },
  passcodeDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginTop: 20,
  },
  bottomSection: {
    flex: 2,
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
    maxWidth: 400,
  },
  button: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.5%',
    backgroundColor: 'white', 
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 24,
    color: '#712828', 
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
  },
  footerButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16, 
    color: '#732626', 
    fontWeight: 'bold', 
    marginLeft: 5,
  },
});

export default Pin;
