import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthScreen } from '../screens/AuthScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { PersonalizationScreen } from '../screens/PersonalizationScreen';
import { useAccessibilityTheme } from '../hooks/useAccessibilityTheme';
import { AppAlertModal } from '../components/shared/AppAlertModal';

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
  const { ui, scaleFont, fontScale } = useAccessibilityTheme();
  const insets = useSafeAreaInsets();
  const isAdaptiveMenuLayout = fontScale >= 1.25;
  const tabBarBottomPadding = Math.max(insets.bottom, 8);
  const tabBarIconSize = Math.max(18, Math.min(isAdaptiveMenuLayout ? scaleFont(19) : scaleFont(22), 24));
  const tabBarLabelSize = isAdaptiveMenuLayout ? scaleFont(11) : scaleFont(12);
  const tabBarHeight = Math.max((isAdaptiveMenuLayout ? 64 : 56) + tabBarBottomPadding, 56 + insets.bottom);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: ui.screenBackground,
        },
        tabBarStyle: {
          height: tabBarHeight,
          paddingBottom: tabBarBottomPadding,
          paddingTop: isAdaptiveMenuLayout ? 6 : 4,
          backgroundColor: ui.screenBackground,
          borderTopColor: ui.cardBorder,
        },
        tabBarActiveTintColor: ui.chipSelectedBackground,
        tabBarInactiveTintColor: ui.textSecondary,
        tabBarItemStyle: {
          paddingHorizontal: 2,
        },
        tabBarLabelStyle: {
          fontSize: tabBarLabelSize,
          marginBottom: isAdaptiveMenuLayout ? 2 : 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={tabBarIconSize} color={color} />,
        }}
      />
      <Tab.Screen
        name="Personalization"
        component={PersonalizationScreen}
        options={{
          title: 'Configurações',
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={tabBarIconSize} color={color} />,
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
      <AppAlertModal />
    </NavigationContainer>
  );
};
