import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ListTodo, TrendingUp, Calendar as CalendarIcon } from 'lucide-react-native';
import { HomeScreen } from '../screens/app/HomeScreen';
import { colors } from '../config/theme';

// Importações explícitas e corretas
import { ProgressScreen } from '../screens/app/ProgressScreen';
import { CalendarScreen } from '../screens/app/CalendarScreen';

const Tab = createBottomTabNavigator();

export const AppTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Habits"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.textLight, 
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
        }
      }}
    >
      <Tab.Screen
        name="Habits"
        component={HomeScreen}
        options={{
          title: 'Hábitos',
          tabBarIcon: ({ color }) => <ListTodo color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Progresso',
          tabBarIcon: ({ color }) => <TrendingUp color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendário',
          tabBarIcon: ({ color }) => <CalendarIcon color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};