import { FirebaseSettingsRepository } from './FirebaseSettingsRepository';

const mockDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}));

jest.mock('../firebase/config', () => ({
  db: { mocked: true },
}));

describe('FirebaseSettingsRepository', () => {
  const repository = new FirebaseSettingsRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('retorna documento existente com merge de defaults', async () => {
    const createdAt = new Date('2026-01-10T10:00:00.000Z');
    const updatedAt = new Date('2026-01-11T10:00:00.000Z');

    mockDoc.mockReturnValue('settings-ref');
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        accessibility: { fontSize: 'large', contrast: 'high', spacing: 'normal', interfaceMode: 'basic', reinforcedFeedback: true, confirmCriticalActions: true },
        notifications: { enableReminders: false, reminderTime: '11:00', enableTaskCompletion: true },
        createdAt: { toDate: () => createdAt },
        updatedAt: { toDate: () => updatedAt },
      }),
    });

    const settings = await repository.getSettings('user-a');

    expect(settings.userId).toBe('user-a');
    expect(settings.accessibility.fontSize).toBe('large');
    expect(settings.notifications.enableReminders).toBe(false);
    expect(settings.createdAt).toEqual(createdAt);
    expect(settings.updatedAt).toEqual(updatedAt);
  });

  it('cria defaults quando documento nao existe', async () => {
    mockDoc.mockReturnValue('settings-ref');
    mockGetDoc.mockResolvedValue({ exists: () => false });
    mockSetDoc.mockResolvedValue(undefined);

    const settings = await repository.getSettings('user-b');

    expect(settings.userId).toBe('user-b');
    expect(settings.accessibility.fontSize).toBe('medium');
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('updateSettings usa merge true e atualiza updatedAt', async () => {
    mockDoc.mockReturnValue('settings-ref');
    mockSetDoc.mockResolvedValue(undefined);

    await repository.updateSettings({
      userId: 'user-c',
      accessibility: {
        fontSize: 'small',
        contrast: 'normal',
        spacing: 'compact',
        interfaceMode: 'basic',
        reinforcedFeedback: false,
        confirmCriticalActions: false,
      },
      notifications: {
        enableReminders: true,
        reminderTime: '09:00',
        enableTaskCompletion: true,
      },
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    const [, payload, options] = mockSetDoc.mock.calls[0];
    expect(payload.accessibility.fontSize).toBe('small');
    expect(payload.updatedAt).toBeInstanceOf(Date);
    expect(options).toEqual({ merge: true });
  });

  it('em timeout de leitura retorna fallback e tenta persistir', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.useFakeTimers();

    mockDoc.mockReturnValue('settings-ref');
    mockGetDoc.mockImplementation(
      () =>
        new Promise(() => {
          // pending promise to trigger timeout
        }),
    );
    mockSetDoc.mockResolvedValue(undefined);

    const promise = repository.getSettings('user-timeout');
    jest.advanceTimersByTime(12_001);

    const settings = await promise;

    expect(settings.userId).toBe('user-timeout');
    expect(settings.accessibility.fontSize).toBe('medium');

    await Promise.resolve();
    expect(mockSetDoc).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
