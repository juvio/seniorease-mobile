import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthScreen } from '../screens/AuthScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { PersonalizationScreen } from '../screens/PersonalizationScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../../shared/constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TasksList" component={TasksScreen} />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Tarefas',
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>✓</Text>,
        }}
      />
      <Tab.Screen
        name="Personalization"
        component={PersonalizationScreen}
        options={{
          title: 'Personalizar',
          tabBarLabel: 'Personalizar',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ animationEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Helper to show icon text
const Text = ({ children, style }: any) => {
  return <span style={style}>{children}</span>;
};
