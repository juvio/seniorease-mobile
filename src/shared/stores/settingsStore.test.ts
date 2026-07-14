import { useSettingsStore } from './settingsStore';

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({ settings: null, loading: false, error: null });
  });

  it('setSettings salva configuracoes', () => {
    useSettingsStore.getState().setSettings({
      userId: 'u1',
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(useSettingsStore.getState().settings?.userId).toBe('u1');
  });

  it('updateAccessibilitySettings faz merge sem perder campos existentes', () => {
    useSettingsStore.setState({
      settings: {
        userId: 'u1',
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    useSettingsStore.getState().updateAccessibilitySettings({ contrast: 'high', spacing: 'spacious' });

    const settings = useSettingsStore.getState().settings;
    expect(settings?.accessibility.contrast).toBe('high');
    expect(settings?.accessibility.spacing).toBe('spacious');
    expect(settings?.accessibility.fontSize).toBe('medium');
  });

  it('setLoading e setError atualizam estado', () => {
    useSettingsStore.getState().setLoading(true);
    useSettingsStore.getState().setError('falha settings');

    expect(useSettingsStore.getState().loading).toBe(true);
    expect(useSettingsStore.getState().error).toBe('falha settings');
  });
});
