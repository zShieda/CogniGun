import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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

  const handleRegister = async () => {
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
  };

  // Handle birthday date change and calculate age
  const onBirthdayChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);  // Hide the date picker
    if (selectedDate) {
      setBirthday(selectedDate);
      const calculatedAge = moment().diff(moment(selectedDate), 'years');  // Calculate age
      setAge(calculatedAge.toString());
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Register</Text>
        <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <TextInput placeholder="Firstname" value={firstname} onChangeText={setFirstname} style={styles.input} />
        <TextInput placeholder="Lastname" value={lastname} onChangeText={setLastname} style={styles.input} />
        <TextInput placeholder="Middlename" value={middlename} onChangeText={setMiddlename} style={styles.input} />

        {/* Birthday Date Picker */}
        <Text onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          {birthday ? moment(birthday).format('YYYY-MM-DD') : 'Select Birthday'}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={birthday || new Date()}
            mode="date"
            display="default"
            maximumDate={new Date()}  // Prevent future dates
            onChange={onBirthdayChange}
          />
        )}

        {/* Auto-calculated Age */}
        <TextInput placeholder="Age" value={age} editable={false} style={styles.input} />

        <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
        <TextInput placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} style={styles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="ID Number" value={idNumber} onChangeText={setIdNumber} style={styles.input} />

        <Button title="Register" onPress={handleRegister} color="#007BFF" />
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
    justifyContent: 'center', // Center the content vertically
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
  datePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
});

export default Register;
