import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import SearchCarsScreen from './screens/SearchCarsScreen';
import RentalConfirmationScreen from './screens/RentalConfirmationScreen';
import MyRentalsScreen from './screens/MyRentalsScreen';
import initializeCarData from './initializeCarData';

const Stack = createStackNavigator();

const App: React.FC = () => {

  useEffect(() => {
    initializeCarData(); // Initialize car rental data
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SearchCars" component={SearchCarsScreen} />
        <Stack.Screen name="RentalConfirmation" component={RentalConfirmationScreen} />
        <Stack.Screen name="MyRentals" component={MyRentalsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
