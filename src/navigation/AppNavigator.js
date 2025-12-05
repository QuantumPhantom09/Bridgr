import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import PaymentScreen from '../screens/PaymentScreen';
import FraudScreen from '../screens/FraudScreen';
import DemoControlScreen from '../screens/DemoControlScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Fraud" component={FraudScreen} />
        <Stack.Screen name="Demo" component={DemoControlScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
