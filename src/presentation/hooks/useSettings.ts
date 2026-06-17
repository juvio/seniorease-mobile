import { useCallback, useRef } from 'react';
import { SettingsService } from '../../application/services/SettingsService';
import { useSettingsStore } from '../../shared/stores/settingsStore';
import { useAuthStore } from '../../shared/stores/authStore';
import { Settings } from '../../domain/entities/Settings';

export const useSettings = () => {
  const user = useAuthStore((state) => state.user);

  const settings = useSettingsStore((state) => state.settings);
  const loading = useSettingsStore((state) => state.loading);
  const error = useSettingsStore((state) => state.error);
  const setSettings = useSettingsStore((state) => state.setSettings);
  const updateAccessibilitySettings = useSettingsStore(
    (state) => state.updateAccessibilitySettings,
  );
  const setLoading = useSettingsStore((state) => state.setLoading);
  const setError = useSettingsStore((state) => state.setError);

  const settingsService = useRef(new SettingsService()).current;

  const loadSettings = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const loadedSettings = await settingsService.getSettings(user.id);
      setSettings(loadedSettings);
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao carregar configurações';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setError, settingsService, setSettings]);

  const updateSettings = useCallback(
    async (updates: Partial<Settings['accessibility']>) => {
      if (!settings) return;

      try {
        setLoading(true);
        setError(null);

        const updated = {
          ...settings,
          accessibility: {
            ...settings.accessibility,
            ...updates,
          },
          updatedAt: new Date(),
        };

        await settingsService.updateSettings(updated);
        setSettings(updated);
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao salvar configurações';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [settings, setLoading, setError, settingsService, setSettings]
  );

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings,
    updateAccessibilitySettings,
  };
};
