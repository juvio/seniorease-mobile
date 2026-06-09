import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RootNavigator } from './presentation/navigation/RootNavigator';
import { useAuthStore } from './shared/stores/authStore';
import { useSettingsStore } from './shared/stores/settingsStore';
import { AuthService } from './application/services/AuthService';
import { SettingsService } from './application/services/SettingsService';
import { colors } from './shared/constants/theme';

export default function App() {
  const { user, setUser, setLoading: setAuthLoading } = useAuthStore();
  const { setSettings, setLoading: setSettingsLoading } = useSettingsStore();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setAuthLoading(true);
      setSettingsLoading(true);

      const authService = new AuthService();
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);

        // Load user settings
        const settingsService = new SettingsService();
        const settings = await settingsService.getSettings(currentUser.id);
        setSettings(settings);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setAuthLoading(false);
      setSettingsLoading(false);
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
