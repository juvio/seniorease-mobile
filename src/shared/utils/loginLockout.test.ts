import {
  clearLoginLockout,
  getRemainingLockoutMs,
  registerFailedLoginAttempt,
} from './loginLockout';

const mockStorage = new Map<string, string>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => mockStorage.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      mockStorage.set(key, value);
    }),
  },
}));

describe('loginLockout', () => {
  beforeEach(() => {
    mockStorage.clear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('normaliza email com trim e lowercase', async () => {
    await registerFailedLoginAttempt('  USER@Example.com  ', 3, 60_000);
    await registerFailedLoginAttempt('user@example.com', 3, 60_000);

    const remaining = await getRemainingLockoutMs('USER@EXAMPLE.COM');
    expect(remaining).toBe(0);

    await registerFailedLoginAttempt('user@example.com', 3, 60_000);
    const lockedRemaining = await getRemainingLockoutMs(' user@example.com ');
    expect(lockedRemaining).toBeGreaterThan(0);
  });

  it('bloqueia apos atingir maximo de tentativas', async () => {
    await registerFailedLoginAttempt('grupo.devops@universidade.edu.br', 3, 120_000);
    await registerFailedLoginAttempt('grupo.devops@universidade.edu.br', 3, 120_000);

    let remaining = await getRemainingLockoutMs('grupo.devops@universidade.edu.br');
    expect(remaining).toBe(0);

    await registerFailedLoginAttempt('grupo.devops@universidade.edu.br', 3, 120_000);

    remaining = await getRemainingLockoutMs('grupo.devops@universidade.edu.br');
    expect(remaining).toBe(120_000);
  });

  it('nao incrementa tentativas durante lockout ativo', async () => {
    await registerFailedLoginAttempt('aluno.sistemas@universidade.edu.br', 1, 180_000);

    const firstRemaining = await getRemainingLockoutMs('aluno.sistemas@universidade.edu.br');
    expect(firstRemaining).toBe(180_000);

    jest.setSystemTime(new Date('2026-01-01T10:01:00.000Z'));
    await registerFailedLoginAttempt('aluno.sistemas@universidade.edu.br', 1, 180_000);

    const secondRemaining = await getRemainingLockoutMs('aluno.sistemas@universidade.edu.br');
    expect(secondRemaining).toBe(120_000);
  });

  it('expira lockout e reseta estado automaticamente', async () => {
    await registerFailedLoginAttempt('aluno.backend@universidade.edu.br', 1, 10_000);

    let remaining = await getRemainingLockoutMs('aluno.backend@universidade.edu.br');
    expect(remaining).toBe(10_000);

    jest.setSystemTime(new Date('2026-01-01T10:00:11.000Z'));
    remaining = await getRemainingLockoutMs('aluno.backend@universidade.edu.br');
    expect(remaining).toBe(0);

    await registerFailedLoginAttempt('aluno.backend@universidade.edu.br', 3, 10_000);
    const afterReset = await getRemainingLockoutMs('aluno.backend@universidade.edu.br');
    expect(afterReset).toBe(0);
  });

  it('clear remove apenas o email informado', async () => {
    await registerFailedLoginAttempt('turma.frontend.a@universidade.edu.br', 1, 60_000);
    await registerFailedLoginAttempt('turma.frontend.b@universidade.edu.br', 1, 60_000);

    await clearLoginLockout('turma.frontend.a@universidade.edu.br');

    const remainingA = await getRemainingLockoutMs('turma.frontend.a@universidade.edu.br');
    const remainingB = await getRemainingLockoutMs('turma.frontend.b@universidade.edu.br');

    expect(remainingA).toBe(0);
    expect(remainingB).toBeGreaterThan(0);
  });
});
