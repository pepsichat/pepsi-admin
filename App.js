import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ChatGroup from './screens/ChatGroup';
import ChatPage from './screens/ChatPage';
import MenuScreen from './screens/MenuScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name='Menu' component={MenuScreen} />
        <Stack.Screen name='Group' component={ChatGroup} />
        <Stack.Screen name='Chat' component={ChatPage} />
        <Stack.Screen name='History' component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
