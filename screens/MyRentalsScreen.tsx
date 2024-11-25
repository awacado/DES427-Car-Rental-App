import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import useNavigation

const MyRentalsScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userRentals, setUserRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  
  // Load the user's rental information from AsyncStorage
  const loadUserRentals = async () => {
    setLoading(true);
    try {
      const rentals = await AsyncStorage.getItem('carRentals');
      const parsedRentals = rentals ? JSON.parse(rentals) : [];

      // Filter rentals by the current user's email (rentedBy)
      const userRentalsList = parsedRentals.filter((r: any) => r.rentedBy === global.userEmail);
      setUserRentals(userRentalsList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load your rentals.');
    } finally {
      setLoading(false);
    }
  };

  const renderRentalItem = ({ item }: any) => (
    <View style={styles.rentalItem}>
      <Text style={styles.carDetails}>
        {item.make} {item.model} - {item.color}
      </Text>
      <Text style={styles.rentalDate}>
        Rental Date: {new Date(item.returnDate).toDateString()}
      </Text>

      <Text style={styles.rentalDate}>
        Driving License Number: {item.licenseNumber}
      </Text>
    </View>
  );

  useEffect(() => {
    fetchLoggedInUser();
    loadUserRentals();
  }, []); // Run once when the component mounts

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Rentals</Text>
      <Text style={styles.userInfo}>
        Name: {name}
      </Text>
      <Text style={styles.userInfo}>
        Email address: {email}
      </Text>

      {loading ? (
        <Text>Loading your rentals...</Text>
      ) : userRentals.length > 0 ? (
        <FlatList
          data={userRentals}
          renderItem={renderRentalItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noRentals}>You have no rentals.</Text>
      )}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
  userInfo: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10,
  },
  rentalItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  carDetails: {
    fontSize: 18,
    marginBottom: 5,
  },
  rentalDate: {
    fontSize: 16,
    color: '#666',
  },
  noRentals: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MyRentalsScreen;
