import { useCallback } from 'react';
import { SettingsService } from '../../application/services/SettingsService';
import { useSettingsStore } from '../../shared/stores/settingsStore';
import { useAuthStore } from '../../shared/stores/authStore';
import { Settings } from '../../domain/entities/Settings';

export const useSettings = () => {
  const settingsStore = useSettingsStore();
  const authStore = useAuthStore();
  const settingsService = new SettingsService();

  const loadSettings = useCallback(async () => {
    if (!authStore.user) return;

    try {
      settingsStore.setLoading(true);
      settingsStore.setError(null);

      const settings = await settingsService.getSettings(authStore.user.id);
      settingsStore.setSettings(settings);
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao carregar configurações';
      settingsStore.setError(errorMessage);
    } finally {
      settingsStore.setLoading(false);
    }
  }, [authStore.user, settingsStore]);

  const updateSettings = useCallback(
    async (updates: Partial<Settings['accessibility']>) => {
      if (!settingsStore.settings) return;

      try {
        settingsStore.setLoading(true);
        settingsStore.setError(null);

        const updated = {
          ...settingsStore.settings,
          accessibility: {
            ...settingsStore.settings.accessibility,
            ...updates,
          },
          updatedAt: new Date(),
        };

        await settingsService.updateSettings(updated);
        settingsStore.setSettings(updated);
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao salvar configurações';
        settingsStore.setError(errorMessage);
      } finally {
        settingsStore.setLoading(false);
      }
    },
    [settingsStore]
  );

  return {
    settings: settingsStore.settings,
    loading: settingsStore.loading,
    error: settingsStore.error,
    loadSettings,
    updateSettings,
    updateAccessibilitySettings: settingsStore.updateAccessibilitySettings,
  };
};
