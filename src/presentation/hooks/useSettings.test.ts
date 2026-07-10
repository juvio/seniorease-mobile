import { act, renderHook } from '@testing-library/react-native';
import { useSettings } from './useSettings';
import { useAuthStore } from '../../shared/stores/authStore';
import { useSettingsStore } from '../../shared/stores/settingsStore';

const mockGetSettings = jest.fn();
const mockUpdateSettings = jest.fn();

jest.mock('../../application/services/SettingsService', () => ({
  SettingsService: jest.fn().mockImplementation(() => ({
    getSettings: mockGetSettings,
    updateSettings: mockUpdateSettings,
  })),
}));

const buildSettings = () => ({
  userId: 'user-1',
  accessibility: {
    fontSize: 'medium' as const,
    contrast: 'normal' as const,
    spacing: 'normal' as const,
    interfaceMode: 'basic' as const,
    reinforcedFeedback: true,
    confirmCriticalActions: true,
  },
  notifications: {
    enableReminders: true,
    reminderTime: '09:00',
    enableTaskCompletion: true,
  },
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

describe('useSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({
      user: { id: 'user-1', email: 'u@seniorease.com', displayName: 'User', createdAt: new Date(), updatedAt: new Date() },
      loading: false,
      error: null,
    });

    useSettingsStore.setState({
      settings: null,
      loading: false,
      error: null,
    });
  });

  it('loadSettings carrega dados e atualiza store', async () => {
    const settings = buildSettings();
    mockGetSettings.mockResolvedValue(settings);

    const { result } = await renderHook(() => useSettings());

    await act(async () => {
      await result.current.loadSettings();
    });

    expect(mockGetSettings).toHaveBeenCalledWith('user-1');
    expect(useSettingsStore.getState().settings?.userId).toBe('user-1');
    expect(useSettingsStore.getState().error).toBeNull();
  });

  it('updateSettings faz merge de accessibility e atualiza updatedAt', async () => {
    const baseSettings = buildSettings();
    useSettingsStore.setState({ settings: baseSettings });
    mockUpdateSettings.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useSettings());

    await act(async () => {
      await result.current.updateSettings({ fontSize: 'large', contrast: 'high' });
    });

    const saved = useSettingsStore.getState().settings;
    expect(mockUpdateSettings).toHaveBeenCalledTimes(1);
    expect(saved?.accessibility.fontSize).toBe('large');
    expect(saved?.accessibility.contrast).toBe('high');
    expect(saved?.updatedAt).toBeInstanceOf(Date);
  });

  it('em erro no loadSettings preenche mensagem no estado', async () => {
    mockGetSettings.mockRejectedValue(new Error('falha de leitura'));

    const { result } = await renderHook(() => useSettings());

    await act(async () => {
      await result.current.loadSettings();
    });

    expect(useSettingsStore.getState().error).toBe('falha de leitura');
    expect(useSettingsStore.getState().loading).toBe(false);
  });

  it('em erro no updateSettings preenche mensagem no estado', async () => {
    const baseSettings = buildSettings();
    useSettingsStore.setState({ settings: baseSettings });
    mockUpdateSettings.mockRejectedValue(new Error('falha ao salvar'));

    const { result } = await renderHook(() => useSettings());

    await act(async () => {
      await result.current.updateSettings({ spacing: 'spacious' });
    });

    expect(useSettingsStore.getState().error).toBe('falha ao salvar');
    expect(useSettingsStore.getState().loading).toBe(false);
  });
});
