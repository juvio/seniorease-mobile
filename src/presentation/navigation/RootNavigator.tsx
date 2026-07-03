import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text as RNText, StyleProp, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthScreen } from '../screens/AuthScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { PersonalizationScreen } from '../screens/PersonalizationScreen';
import { useAccessibilityTheme } from '../hooks/useAccessibilityTheme';

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
  const { ui, scaleFont, scaleSpacing } = useAccessibilityTheme();
  const insets = useSafeAreaInsets();
  const tabBarBottomPadding = Math.max(insets.bottom, scaleSpacing(8));

  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: ui.screenBackground }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: scaleSpacing(56) + tabBarBottomPadding,
          paddingBottom: tabBarBottomPadding,
          paddingTop: scaleSpacing(4),
          backgroundColor: ui.screenBackground,
          borderTopColor: ui.cardBorder,
        },
        tabBarActiveTintColor: ui.chipSelectedBackground,
        tabBarInactiveTintColor: ui.textSecondary,
        tabBarLabelStyle: {
          fontSize: scaleFont(12),
          marginBottom: scaleSpacing(4),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: scaleFont(24), color }}>✓</Text>,
        }}
      />
      <Tab.Screen
        name="Personalization"
        component={PersonalizationScreen}
        options={{
          title: 'Configurações',
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: scaleFont(24), color }}>⚙️</Text>,
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
          <Stack.Group navigationKey="user">
            <Stack.Screen name="App" component={AppTabs} />
          </Stack.Group>
        ) : (
          <Stack.Group navigationKey="guest">
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ animation: 'none' }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Helper to show icon text
const Text = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => {
  return <RNText style={style}>{children}</RNText>;
};
