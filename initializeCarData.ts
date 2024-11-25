import AsyncStorage from '@react-native-async-storage/async-storage';
import { cars } from './mock_data';

const initializeCarData = async () => {
  try {
    const carRentals = await AsyncStorage.getItem('carRentals');
    if (!carRentals) {
      const initialData = cars.map((car) => ({
        id: car.id,
        make: car.make,
        model: car.model,
        color: car.color,
        rentedBy: null,
        licenseNumber: null,
        returnDate: null,
      }));

      await AsyncStorage.setItem('carRentals', JSON.stringify(initialData));
      console.log('Car rental data initialized.');
    }
  } catch (error) {
    console.error('Failed to initialize car rental data:', error);
  }
};

export default initializeCarData;
