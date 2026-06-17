import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { useAuthStore } from './src/shared/stores/authStore';
import { useSettingsStore } from './src/shared/stores/settingsStore';
import { AuthService } from './src/application/services/AuthService';
import { SettingsService } from './src/application/services/SettingsService';
import { colors } from './src/shared/constants/theme';

export default function App() {
  const { user, setUser } = useAuthStore();
  const { setSettings } = useSettingsStore();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const authService = new AuthService();
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);

        // Load user settings
        const settingsService = new SettingsService();
        try {
          const settings = await settingsService.getSettings(currentUser.id);
          setSettings(settings);
        } catch {
          // Defaults can be created after login if no settings were found.
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setAppLoading(false);
    }
  };

  if (appLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <RootNavigator isLoggedIn={!!user} />;
}
