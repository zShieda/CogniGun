import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'; 

const Register = () => {
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
      const response = await fetch('http://192.168.254.111:8000/api/register/', {
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
    <View>
      <TextInput 
        placeholder={placeholder} 
        value={value} 
        onChangeText={(text) => {
          onChangeText(text);
          setErrors({...errors, [key]: ''});
        }}
        style={[styles.input, errors[key] ? styles.inputError : null]}
        secureTextEntry={secureTextEntry}
      />
      {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Register</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007BFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  datePickerText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Register;