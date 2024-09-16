import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner'; 

interface listProps {}

interface listState {
  passcode: string;
  input: string;
  hasPermission: boolean | null;
  scanned: boolean;
  isScannerVisible: boolean;
}

class list extends Component<listProps, listState> {
  constructor(props: listProps) {
    super(props);
    this.state = {
      passcode: '072930',
      input: '',
      hasPermission: null,
      scanned: false,
      isScannerVisible: false,
    };
  }

  async componentDidMount() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
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

  // QR result kineme
  handleBarCodeScanned = ({ type, data }: any) => {
    this.setState({ scanned: true, isScannerVisible: false });
    Alert.alert('Handgun Scanned', `Data: ${data}`);
  };

  // Bukas QR
  openQRScanner = () => {
    this.setState({ isScannerVisible: true, scanned: false });
  };

  render() {
    if (this.state.hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (this.state.hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Enter Passcode or Scan QR</Text>
        <View style={styles.passcodeContainer}>
          {Array(6).fill('').map((_, i) => (
            <View key={i} style={[
              styles.passcodeDot,
              { opacity: this.state.input.length > i ? 1 : 0.3 }
            ]} />
          ))}
        </View>

        <View style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'QR', '0', 'DEL'].map(digit => (
            <TouchableOpacity
              key={digit}
              style={styles.button}
              onPress={() => digit === 'DEL' ? this.handleDelete() : 
                digit === 'QR' ? this.openQRScanner() : this.handlePress(digit)}
            >
              <Text style={styles.buttonText}>{digit}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={this.state.isScannerVisible}
          animationType="slide"
          onRequestClose={() => this.setState({ isScannerVisible: false })}
        >
          <SafeAreaView style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            {this.state.scanned && (
              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={() => this.setState({ scanned: false })}
              >
                <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
              </TouchableOpacity>
            )}
          </SafeAreaView>
        </Modal>

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
    borderRadius: 40, // pangbilog
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
    marginStart:135,
    fontSize: 18,
    color: '#007AFF',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
});

export default list;
