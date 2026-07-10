import { createDefaultSettings, getSettingsDefaults } from './settingsFactory';

describe('settingsFactory', () => {
  it('retorna defaults esperados de acessibilidade e notificacoes', () => {
    const defaults = getSettingsDefaults();

    expect(defaults.accessibility).toEqual({
      fontSize: 'medium',
      contrast: 'normal',
      spacing: 'normal',
      interfaceMode: 'basic',
      reinforcedFeedback: true,
      confirmCriticalActions: true,
    });

    expect(defaults.notifications).toEqual({
      enableReminders: true,
      reminderTime: '09:00',
      enableTaskCompletion: true,
    });
  });

  it('cria configuracao default usando data injetada em createdAt e updatedAt', () => {
    const now = new Date('2026-05-20T15:00:00.000Z');

    const settings = createDefaultSettings('user-123', now);

    expect(settings.userId).toBe('user-123');
    expect(settings.createdAt).toBe(now);
    expect(settings.updatedAt).toBe(now);
    expect(settings.accessibility.fontSize).toBe('medium');
  });
});
