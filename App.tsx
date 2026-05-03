import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import ResultViewScreen from './src/screens/ResultViewScreen';
import PersonalitiesScreen from './src/screens/PersonalitiesScreen';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F9FA' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="ResultView" component={ResultViewScreen} />
        <Stack.Screen name="Personalities" component={PersonalitiesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
