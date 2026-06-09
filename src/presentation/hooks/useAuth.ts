import { useCallback } from 'react';
import { AuthService } from '../../application/services/AuthService';
import { SettingsService } from '../../application/services/SettingsService';
import { useAuthStore } from '../../shared/stores/authStore';
import { useSettingsStore } from '../../shared/stores/settingsStore';

export const useAuth = () => {
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();

  const authService = new AuthService();
  const settingsService = new SettingsService();

  const signup = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        authStore.setLoading(true);
        authStore.setError(null);

        const user = await authService.signup(email, password, displayName);
        authStore.setUser(user);

        // Create default settings for new user
        const settings = await settingsService.createDefaultSettings(user.id);
        settingsStore.setSettings(settings);

        return user;
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao criar conta';
        authStore.setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        authStore.setLoading(false);
      }
    },
    [authStore, settingsStore]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        authStore.setLoading(true);
        authStore.setError(null);

        const user = await authService.login(email, password);
        authStore.setUser(user);

        // Load user settings
        const settings = await settingsService.getSettings(user.id);
        settingsStore.setSettings(settings);

        return user;
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao fazer login';
        authStore.setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        authStore.setLoading(false);
      }
    },
    [authStore, settingsStore]
  );

  const logout = useCallback(async () => {
    try {
      authStore.setLoading(true);
      await authService.logout();
      authStore.logout();
      settingsStore.setSettings(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao fazer logout';
      authStore.setError(errorMessage);
    } finally {
      authStore.setLoading(false);
    }
  }, [authStore, settingsStore]);

  return {
    user: authStore.user,
    loading: authStore.loading,
    error: authStore.error,
    signup,
    login,
    logout,
  };
};
