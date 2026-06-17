import { create } from 'zustand';
import { Settings } from '../../domain/entities/Settings';

interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  setSettings: (settings: Settings | null) => void;
  updateAccessibilitySettings: (updates: Partial<Settings['accessibility']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: false,
  error: null,
  setSettings: (settings) => set({ settings }),
  updateAccessibilitySettings: (updates) =>
    set((state) => ({
      settings: state.settings
        ? {
            ...state.settings,
            accessibility: { ...state.settings.accessibility, ...updates },
          }
        : null,
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
