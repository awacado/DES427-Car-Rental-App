import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RentalConfirmationScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { car, selectedDate } = route.params; // Retrieve car and selected date from params
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isValidLicense, setIsValidLicense] = useState(true); // To handle license validation

  const fetchLoggedInUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('loggedInUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setName(parsedUser.name);
        setEmail(parsedUser.email);
      }
    } catch (error) {
      console.error('Error fetching logged-in user data:', error);
    }
  };

  const handleConfirmRental = async () => {
    // Validate license number
    if (licenseNumber.trim().length === 0) {
      setIsValidLicense(false);
      return Alert.alert('Error', 'Please enter a valid driving license number.');
    }
    
    try {
      const rentals = await AsyncStorage.getItem('carRentals');
      const parsedRentals = rentals ? JSON.parse(rentals) : [];

      // Find the car in the rentals and mark it as rented
      const rental = parsedRentals.find((r: any) => r.id === car.id);
      if (rental) {
        rental.rentedBy = email;
        rental.returnDate = new Date(selectedDate).toISOString();
        rental.licenseNumber = licenseNumber; // Save the license number to the rental

        // Save the updated rental data back to AsyncStorage
        await AsyncStorage.setItem('carRentals', JSON.stringify(parsedRentals));

        Alert.alert('Success', `Car rented successfully!`);
        navigation.navigate('SearchCars'); // Navigate back to the search screen
      } else {
        Alert.alert('Error', 'This car is no longer available for the selected date.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm rental.');
    }
  };

  const handleCancel = () => {
    navigation.goBack(); // Go back to the search screen if user cancels
  };

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Rental</Text>

      <Text style={styles.carDetails}>
        {car.make} {car.model} ({car.color})
      </Text>
      <Text style={styles.text}>
        Rental Date: {selectedDate.toDateString()}
      </Text>

      <Text style={styles.text}>
        Rented By: {name}
      </Text>

      {/* Driving License Input */}
      <TextInput
        style={[styles.input, !isValidLicense && styles.inputError]}
        placeholder="Enter your Driving License Number"
        value={licenseNumber}
        onChangeText={setLicenseNumber}
        autoCapitalize="none"
        keyboardType="default"
      />
      {!isValidLicense && <Text style={styles.errorText}>Please enter a valid driving license number.</Text>}

      <Button title="Confirm Rental" onPress={handleConfirmRental} />
      <Button title="Cancel" onPress={handleCancel} color="red" />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  carDetails: {
    fontSize: 18,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default RentalConfirmationScreen;
