import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import MainTabNavigator from './MainTabNavigator';
import EventDetailScreen from '../screens/main/EventDetailScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="EventDetail" 
        component={EventDetailScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
