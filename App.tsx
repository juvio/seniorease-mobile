import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { useAuthStore } from './src/shared/stores/authStore';
import { useSettingsStore } from './src/shared/stores/settingsStore';
import { SettingsService } from './src/application/services/SettingsService';
import { FirebaseSettingsRepository } from './src/infrastructure/repositories/FirebaseSettingsRepository';
import { auth, db } from './src/infrastructure/firebase/config';
import { colors } from './src/shared/constants/theme';

export default function App() {
  const { user, setUser } = useAuthStore();
  const { setSettings } = useSettingsStore();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: userData?.displayName ?? 'Usuário',
            createdAt: userData?.createdAt?.toDate() ?? new Date(),
            updatedAt: userData?.updatedAt?.toDate() ?? new Date(),
          });

          const settingsService = new SettingsService(new FirebaseSettingsRepository());
          try {
            const settings = await settingsService.getSettings(firebaseUser.uid);
            setSettings(settings);
          } catch {
            // Defaults can be created after login if no settings were found.
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
      } finally {
        setAppLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (appLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <RootNavigator isLoggedIn={!!user} />
    </SafeAreaProvider>
  );
}
