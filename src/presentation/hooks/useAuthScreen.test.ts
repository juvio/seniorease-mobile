import { act, renderHook } from '@testing-library/react-native';
import { useAuthScreen } from './useAuthScreen';

const mockSignup = jest.fn();
const mockLogin = jest.fn();
const mockGetRemainingLockoutMs = jest.fn();
const mockRegisterFailed = jest.fn();
const mockClearLockout = jest.fn();

jest.mock('./useAuth', () => ({
  useAuth: () => ({
    signup: mockSignup,
    login: mockLogin,
  }),
}));

jest.mock('../../shared/utils/loginLockout', () => ({
  getRemainingLockoutMs: (...args: unknown[]) => mockGetRemainingLockoutMs(...args),
  registerFailedLoginAttempt: (...args: unknown[]) => mockRegisterFailed(...args),
  clearLoginLockout: (...args: unknown[]) => mockClearLockout(...args),
}));

describe('useAuthScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetRemainingLockoutMs.mockResolvedValue(0);
    mockSignup.mockResolvedValue({ id: 'u1' });
    mockLogin.mockResolvedValue({ id: 'u1' });
    mockClearLockout.mockResolvedValue(undefined);
    mockRegisterFailed.mockResolvedValue(undefined);
  });

  it('valida email obrigatorio antes de autenticar', async () => {
    const { result } = await renderHook(() => useAuthScreen());

    await act(async () => {
      result.current.setEmail('   ');
      result.current.setPassword('Senha@123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(result.current.emailFeedback).toBe('Email e obrigatorio');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('bloqueia login quando lockout ainda esta ativo', async () => {
    mockGetRemainingLockoutMs.mockResolvedValue(60_000);
    const { result } = await renderHook(() => useAuthScreen());

    await act(async () => {
      result.current.setEmail('aluno.ads@universidade.edu.br');
      result.current.setPassword('Senha@123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(result.current.passwordFeedback).toContain('Nao foi possivel autenticar');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('registra tentativa quando credenciais invalidas no login', async () => {
    mockLogin.mockRejectedValue({ code: 'AUTH_INVALID_CREDENTIALS' });

    const { result } = await renderHook(() => useAuthScreen());

    await act(async () => {
      result.current.setEmail('estudante.backend@universidade.edu.br');
      result.current.setPassword('Senha@123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockRegisterFailed).toHaveBeenCalledTimes(1);
    expect(result.current.passwordFeedback).toContain('Nao foi possivel autenticar');
  });

  it('em sucesso no login limpa lockout e chama callback', async () => {
    const onLoginSuccess = jest.fn();
    const { result } = await renderHook(() => useAuthScreen({ onLoginSuccess }));

    await act(async () => {
      result.current.setEmail('profissional.estudos@universidade.edu.br');
      result.current.setPassword('Senha@123');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockLogin).toHaveBeenCalledWith('profissional.estudos@universidade.edu.br', 'Senha@123');
    expect(mockClearLockout).toHaveBeenCalledWith('profissional.estudos@universidade.edu.br');
    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
  });

  it('em sucesso no signup mostra toast de sucesso', async () => {
    const { result } = await renderHook(() => useAuthScreen());

    await act(async () => {
      result.current.setIsSignup();
    });

    await act(async () => {
      result.current.setEmail('aluno.mobile@universidade.edu.br');
      result.current.setPassword('Senha@123');
      result.current.setDisplayName('Aluno TI');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockSignup).toHaveBeenCalledWith('aluno.mobile@universidade.edu.br', 'Senha@123', 'Aluno TI');
    expect(result.current.toastFeedback?.type).toBe('success');
  });
});
