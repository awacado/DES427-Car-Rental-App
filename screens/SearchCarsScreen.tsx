import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { cars } from '../mock_data'; // Import mock car data

const SearchCarsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableCars, setAvailableCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


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

  // Load car data and available rentals
  const loadAvailableCars = async () => {
    setLoading(true);
    try {
      const rentals = await AsyncStorage.getItem('carRentals');
      const parsedRentals = rentals ? JSON.parse(rentals) : [];

      // Filter available cars for the selected date
      const availableCarsForDate = cars.filter((car) => {
        const rental = parsedRentals.find((rental: any) => rental.id === car.id);
        const returnDate = new Date(rental.returnDate);
        return returnDate.getDate() !== selectedDate.getDate(); // Filter out cars rented on that day
      });

      setAvailableCars(availableCarsForDate);
    } catch (error) {
      Alert.alert('Error', 'Failed to load available cars.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoggedInUser();
    loadAvailableCars();
  }, [selectedDate]); // Re-fetch available cars when the selected date changes

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleRentCar = (car: any) => {
    // Navigate to rental confirmation screen with selected car and date
    navigation.navigate('RentalConfirmation', {
      car,
      selectedDate,
    });
  };

  const handleSignOut = () => {
    // Handle user sign out (clear user session, etc.)
    AsyncStorage.setItem('loggedInUser', 'null')
    navigation.navigate('Welcome');
    global.userEmail = null;
  };

  const renderCarItem = ({ item }: any) => (
    <View style={styles.carItem}>
      <Text style={styles.carText}>
        {item.make} {item.model} - {item.color}
      </Text>
      <TouchableOpacity
        style={styles.rentButton}
        onPress={() => handleRentCar(item)} // Pass the car object to the confirmation screen
      >
        <Text style={styles.rentButtonText}>Rent this car</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Cars for Rent</Text>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          {selectedDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}

      {loading ? (
        <Text>Loading available cars...</Text>
      ) : (
        <FlatList
          data={availableCars}
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <Button title="My Rentals" onPress={() => navigation.navigate('MyRentals', name)} />
      <Button title="Sign Out" onPress={handleSignOut} />
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
  dateButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  carItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  carText: {
    fontSize: 18,
    marginBottom: 10,
  },
  rentButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  rentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchCarsScreen;
