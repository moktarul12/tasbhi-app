import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LanguageScreen from '../screens/LanguageScreen';
import AddZikrScreen from '../screens/AddZikrScreen';
import EditZikrScreen from '../screens/EditZikrScreen';
import ZikrDetailScreen from '../screens/ZikrDetailScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import RemindersScreen from '../screens/RemindersScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LocationPickerScreen from '../screens/LocationPickerScreen';
import MainTabs from './MainTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="AddZikr" component={AddZikrScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="EditZikr" component={EditZikrScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="ZikrDetail" component={ZikrDetailScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
        <Stack.Screen name="Reminders" component={RemindersScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="LocationPicker" component={LocationPickerScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
