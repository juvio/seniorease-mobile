import { Settings } from '../entities/Settings';

export type SettingsDefaults = Omit<Settings, 'userId' | 'createdAt' | 'updatedAt'>;

export const getSettingsDefaults = (): SettingsDefaults => ({
  accessibility: {
    fontSize: 'medium',
    contrast: 'normal',
    spacing: 'normal',
    interfaceMode: 'basic',
    reinforcedFeedback: true,
    confirmCriticalActions: true,
  },
  notifications: {
    enableReminders: true,
    reminderTime: '09:00',
    enableTaskCompletion: true,
  },
});

export const createDefaultSettings = (userId: string, now: Date = new Date()): Settings => {
  const defaults = getSettingsDefaults();

  return {
    userId,
    accessibility: defaults.accessibility,
    notifications: defaults.notifications,
    createdAt: now,
    updatedAt: now,
  };
};