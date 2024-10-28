import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useRouter } from "expo-router";
import { ArrowLeft } from 'lucide-react-native';

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateInputs = () => {
    let newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (!firstname.trim()) newErrors.firstname = 'First name is required';
    if (!lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!birthday) newErrors.birthday = 'Birthday is required';
    if (!age.trim()) newErrors.age = 'Age is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!idNumber.trim()) newErrors.idNumber = 'ID number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      Alert.alert("Registration Failed", "Please fill in all required fields correctly.", [{ text: "OK" }]);
      return;
    }

    try {
      const response = await fetch('http://192.168.1.6:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          firstname,
          lastname,
          middlename,
          birthday: moment(birthday).format('YYYY-MM-DD'),
          age,
          address,
          contact_number: contactNumber,
          email,
          id_number: idNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Registration Successful", "You have been registered successfully!", [{ text: "OK" }]);
      } else {
        Alert.alert("Registration Failed", data.message || "An error occurred during registration.", [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while trying to register. Please try again later.", [{ text: "OK" }]);
    }
  };

  const onBirthdayChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
      const calculatedAge = moment().diff(moment(selectedDate), 'years');
      setAge(calculatedAge.toString());
    }
  };

  const renderInput = (placeholder: string, value: string, onChangeText: (text: string) => void, key: string, secureTextEntry: boolean = false) => (
    <View style={styles.inputContainer}>
      <TextInput 
        placeholder={placeholder} 
        value={value} 
        onChangeText={(text) => {
          onChangeText(text);
          setErrors({...errors, [key]: ''});
        }}
        style={[styles.input, errors[key] ? styles.inputError : null]}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#888"
      />
      {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
    </View>
  );

  const handleBack = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('./assets/signup.png')} // Replace with your image path
          style={styles.backgroundImage}
          resizeMode="cover"
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
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {renderInput("Username", username, setUsername, "username")}
            {renderInput("Password", password, setPassword, "password", true)}
            {renderInput("First name", firstname, setFirstname, "firstname")}
            {renderInput("Last name", lastname, setLastname, "lastname")}
            {renderInput("Middle name", middlename, setMiddlename, "middlename")}

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.datePicker, errors.birthday ? styles.inputError : null]}>
              <Text style={styles.datePickerText}>
                {birthday ? moment(birthday).format('YYYY-MM-DD') : 'Select Birthday'}
              </Text>
            </TouchableOpacity>
            {errors.birthday ? <Text style={styles.errorText}>{errors.birthday}</Text> : null}
            
            {showDatePicker && (
              <DateTimePicker
                value={birthday || new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={onBirthdayChange}
              />
            )}

            {renderInput("Age", age, setAge, "age")}
            {renderInput("Address", address, setAddress, "address")}
            {renderInput("Contact Number", contactNumber, setContactNumber, "contactNumber")}
            {renderInput("Email", email, setEmail, "email")}
            {renderInput("ID Number", idNumber, setIdNumber, "idNumber")}

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/Login')}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#800000',
  },
  topSection: {
    height: '40%',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    width: '90%',
    height: '95%',
    opacity: 1,
    marginLeft: 28,
   
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
  },
  scrollContainer: {
    flexGrow: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  datePicker: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  datePickerText: {
    fontSize: 16,
    color: '#888',
  },
  registerButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#800000',
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
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Register;
