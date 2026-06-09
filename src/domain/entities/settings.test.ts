import { AccessibilitySettings, Settings } from '../domain/entities/Settings';

describe('Settings Model', () => {
  describe('Accessibility Settings', () => {
    it('should create default accessibility settings', () => {
      const settings: AccessibilitySettings = {
        fontSize: 'medium',
        contrast: 'normal',
        spacing: 'normal',
        interfaceMode: 'basic',
        reinforcedFeedback: true,
        confirmCriticalActions: true,
      };

      expect(settings.fontSize).toBe('medium');
      expect(settings.contrast).toBe('normal');
      expect(settings.interfaceMode).toBe('basic');
      expect(settings.reinforcedFeedback).toBe(true);
    });

    it('should allow changing font sizes', () => {
      const sizes: Array<'small' | 'medium' | 'large' | 'extra-large'> = [
        'small',
        'medium',
        'large',
        'extra-large',
      ];

      sizes.forEach((size) => {
        const settings: AccessibilitySettings = {
          fontSize: size,
          contrast: 'normal',
          spacing: 'normal',
          interfaceMode: 'basic',
          reinforcedFeedback: true,
          confirmCriticalActions: true,
        };

        expect(settings.fontSize).toBe(size);
      });
    });

    it('should allow changing contrast levels', () => {
      const contrasts: Array<'normal' | 'high' | 'maximum'> = [
        'normal',
        'high',
        'maximum',
      ];

      contrasts.forEach((contrast) => {
        const settings: AccessibilitySettings = {
          fontSize: 'medium',
          contrast,
          spacing: 'normal',
          interfaceMode: 'basic',
          reinforcedFeedback: true,
          confirmCriticalActions: true,
        };

        expect(settings.contrast).toBe(contrast);
      });
    });

    it('should allow changing spacing', () => {
      const spacings: Array<'compact' | 'normal' | 'spacious' | 'extra-spacious'> =
        ['compact', 'normal', 'spacious', 'extra-spacious'];

      spacings.forEach((spacing) => {
        const settings: AccessibilitySettings = {
          fontSize: 'medium',
          contrast: 'normal',
          spacing,
          interfaceMode: 'basic',
          reinforcedFeedback: true,
          confirmCriticalActions: true,
        };

        expect(settings.spacing).toBe(spacing);
      });
    });

    it('should toggle interface modes', () => {
      const basicSettings: AccessibilitySettings = {
        fontSize: 'medium',
        contrast: 'normal',
        spacing: 'normal',
        interfaceMode: 'basic',
        reinforcedFeedback: true,
        confirmCriticalActions: true,
      };

      const advancedSettings: AccessibilitySettings = {
        ...basicSettings,
        interfaceMode: 'advanced',
      };

      expect(basicSettings.interfaceMode).toBe('basic');
      expect(advancedSettings.interfaceMode).toBe('advanced');
    });

    it('should toggle feedback flags', () => {
      const settings: AccessibilitySettings = {
        fontSize: 'medium',
        contrast: 'normal',
        spacing: 'normal',
        interfaceMode: 'basic',
        reinforcedFeedback: false,
        confirmCriticalActions: false,
      };

      const updatedSettings: AccessibilitySettings = {
        ...settings,
        reinforcedFeedback: true,
        confirmCriticalActions: true,
      };

      expect(updatedSettings.reinforcedFeedback).toBe(true);
      expect(updatedSettings.confirmCriticalActions).toBe(true);
    });
  });

  describe('Full Settings Document', () => {
    it('should create complete settings object', () => {
      const now = new Date();
      const settings: Settings = {
        userId: 'user123',
        accessibility: {
          fontSize: 'large',
          contrast: 'high',
          spacing: 'spacious',
          interfaceMode: 'basic',
          reinforcedFeedback: true,
          confirmCriticalActions: true,
        },
        notifications: {
          enableReminders: true,
          reminderTime: '09:00',
          enableTaskCompletion: true,
        },
        createdAt: now,
        updatedAt: now,
      };

      expect(settings.userId).toBe('user123');
      expect(settings.accessibility.fontSize).toBe('large');
      expect(settings.notifications.reminderTime).toBe('09:00');
    });

    it('should preserve timestamps', () => {
      const created = new Date('2026-01-01');
      const updated = new Date('2026-01-02');

      const settings: Settings = {
        userId: 'user123',
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
        createdAt: created,
        updatedAt: updated,
      };

      expect(settings.createdAt).toEqual(created);
      expect(settings.updatedAt).toEqual(updated);
    });
  });
});
