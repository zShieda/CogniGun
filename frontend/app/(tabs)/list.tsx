import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Imported Ionicons

const { width, height } = Dimensions.get('window');

interface listProps {}

interface listState {
  passcode: string;
  input: string;
}

class List extends Component<listProps, listState> {
  constructor(props: listProps) {
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
        <Text style={styles.header}>Enter Passcode or Scan</Text>
        <View style={styles.passcodeContainer}>
          {Array(6).fill('').map((_, i) => (
            <View key={i} style={[
              styles.passcodeDot,
              { opacity: this.state.input.length > i ? 1 : 0.3 }
            ]} />
          ))}
        </View>

        <View style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'DEL'].map(digit => (
            <TouchableOpacity
              key={digit}
              style={styles.button}
              onPress={() => digit === '' ? this.handleNavigation() : digit === 'DEL' ? this.handleDelete() : this.handlePress(digit)}
            >
              {digit === '' ? (
                <Ionicons name="qr-code-outline" size={32} color="brown" />
              ) : digit === 'DEL' ? (
                <Ionicons name="backspace-outline" size={32} color="brown" />
              ) : (
                <Text style={styles.buttonText}>{digit}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Cancel</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  passcodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 30,
  },
  passcodeDot: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: '#333',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
  },
  button: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#ddd',
    borderRadius: 40, // Round buttons
  },
  buttonText: {
    fontSize: 24,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 30,
  },
  footerText: {
    justifyContent: 'center',
    marginStart: 135,
    fontSize: 18,
    color: '#007AFF',
  },
});

export default List;
