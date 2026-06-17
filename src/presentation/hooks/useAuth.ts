import { useCallback } from 'react';
import { AuthService } from '../../application/services/AuthService';
import { SettingsService } from '../../application/services/SettingsService';
import { useAuthStore } from '../../shared/stores/authStore';
import { useSettingsStore } from '../../shared/stores/settingsStore';

const AUTH_REQUEST_TIMEOUT_MS = 15000;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(timeoutMessage));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

export const useAuth = () => {
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();

  const authService = new AuthService();
  const settingsService = new SettingsService();

  const signup = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        authStore.setLoading(true);
        authStore.setError(null);

        const user = await withTimeout(
          authService.signup(email, password, displayName),
          AUTH_REQUEST_TIMEOUT_MS,
          'Tempo esgotado ao criar conta. Verifique sua conexao e tente novamente.'
        );
        authStore.setUser(user);

        // Create default settings for new user
        const settings = await withTimeout(
          settingsService.createDefaultSettings(user.id),
          AUTH_REQUEST_TIMEOUT_MS,
          'Conta criada, mas houve demora ao carregar configurações iniciais.'
        );
        settingsStore.setSettings(settings);
        return user;
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao criar conta';
        authStore.setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        authStore.setLoading(false);
      }
    },
    [authStore, settingsStore]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        authStore.setLoading(true);
        authStore.setError(null);

        const user = await withTimeout(
          authService.login(email, password),
          AUTH_REQUEST_TIMEOUT_MS,
          'Tempo esgotado ao fazer login. Verifique sua conexao e tente novamente.'
        );
        authStore.setUser(user);

        // Do not block login on settings loading.
        void withTimeout(
          settingsService.getSettings(user.id),
          AUTH_REQUEST_TIMEOUT_MS,
          'Login realizado, mas houve demora ao carregar suas configurações.'
        )
          .then((settings) => {
            settingsStore.setSettings(settings);
          })
          .catch(() => undefined);
        return user;
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao fazer login';
        authStore.setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        authStore.setLoading(false);
      }
    },
    [authStore, settingsStore]
  );

  const logout = useCallback(async () => {
    try {
      authStore.setLoading(true);
      await withTimeout(
        authService.logout(),
        AUTH_REQUEST_TIMEOUT_MS,
        'Tempo esgotado ao sair da conta. Tente novamente.'
      );
      authStore.logout();
      settingsStore.setSettings(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao fazer logout';
      authStore.setError(errorMessage);
    } finally {
      authStore.setLoading(false);
    }
  }, [authStore, settingsStore]);

  return {
    user: authStore.user,
    loading: authStore.loading,
    error: authStore.error,
    signup,
    login,
    logout,
  };
};
