import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen3 from './screens/ChatScreen3';
import MenuScreen from './screens/MenuScreen';
import HistoryScreen from './screens/HistoryScreen';
import HistoryScreen2 from './screens/HistoryScreen2';
import MainMenuScreen from './screens/MainMenuScreen';
import TeatList from './screens/TeatList';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Main' component={MainMenuScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Menu' component={MenuScreen} />
        <Stack.Screen name='Chat' component={ChatScreen3} />
        <Stack.Screen name='History' component={HistoryScreen} />
        <Stack.Screen name='History2' component={HistoryScreen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
