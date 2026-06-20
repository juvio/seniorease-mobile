import { useCallback, useState } from 'react';
import {
  PASSWORD_REQUIREMENTS_TEXT,
  validateEmail,
  validatePassword,
} from '../../shared/utils/validators';
import {
  clearLoginLockout,
  getRemainingLockoutMs,
  registerFailedLoginAttempt,
} from '../../shared/utils/loginLockout';
import { useAuth } from './useAuth';

interface AuthScreenHookParams {
  onLoginSuccess?: () => void;
}

type AuthToastType = 'success' | 'error' | 'warning';

interface AuthToastState {
  type: AuthToastType;
  message: string;
}

export const useAuthScreen = ({ onLoginSuccess }: AuthScreenHookParams = {}) => {
  const MAX_INVALID_LOGIN_ATTEMPTS = 3;
  const LOGIN_LOCKOUT_DURATION_MS = 3 * 60 * 60 * 1000;
  const GENERIC_AUTH_FAILURE_MESSAGE = 'Nao foi possivel autenticar. Verifique suas credenciais e tente novamente.';

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [displayNameFeedback, setDisplayNameFeedback] = useState<string | null>(null);
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [toastFeedback, setToastFeedback] = useState<AuthToastState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, login } = useAuth();

  const clearInlineFeedback = useCallback(() => {
    setDisplayNameFeedback(null);
    setEmailFeedback(null);
    setPasswordFeedback(null);
  }, []);

  const clearFeedback = useCallback(() => {
    clearInlineFeedback();
    setToastFeedback(null);
  }, [clearInlineFeedback]);

  const handleToggleAuthMode = useCallback(() => {
    setIsSignup((prev) => !prev);
    clearFeedback();
  }, [clearFeedback]);

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (emailFeedback) {
        setEmailFeedback(null);
      }
    },
    [emailFeedback],
  );

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      if (passwordFeedback) {
        setPasswordFeedback(null);
      }
    },
    [passwordFeedback],
  );

  const handleDisplayNameChange = useCallback(
    (value: string) => {
      setDisplayName(value);
      if (displayNameFeedback) {
        setDisplayNameFeedback(null);
      }
    },
    [displayNameFeedback],
  );

  const handleDismissToast = useCallback(() => {
    setToastFeedback(null);
  }, []);

  const handleAuth = useCallback(async () => {
    setIsSubmitting(true);
    setToastFeedback(null);
    clearInlineFeedback();

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedDisplayName = displayName.trim();
      const hasEmail = normalizedEmail.length > 0;
      const hasPassword = password.trim().length > 0;

      if (!hasEmail) {
        setEmailFeedback('Email e obrigatorio');
        return;
      }

      if (!validateEmail(normalizedEmail)) {
        setEmailFeedback('Email invalido');
        return;
      }

      if (!hasPassword) {
        setPasswordFeedback('Senha e obrigatoria');
        return;
      }

      if (isSignup && !validatePassword(password)) {
        setPasswordFeedback(PASSWORD_REQUIREMENTS_TEXT);
        return;
      }

      setPasswordFeedback(null);

      if (isSignup) {
        if (normalizedDisplayName.length < 5) {
          setDisplayNameFeedback('Nome completo deve ter no minimo 5 caracteres');
          return;
        }

        await signup(normalizedEmail, password, normalizedDisplayName);
        setToastFeedback({
          type: 'success',
          message: 'Conta criada! Bem-vindo ao SeniorEase',
        });
      } else {
        const remainingLockoutMs = await getRemainingLockoutMs(normalizedEmail);

        if (remainingLockoutMs > 0) {
          setPasswordFeedback(GENERIC_AUTH_FAILURE_MESSAGE);
          return;
        }

        await login(normalizedEmail, password);
        await clearLoginLockout(normalizedEmail);
      }

      onLoginSuccess?.();
    } catch (err: any) {
      if (!isSignup && err?.code === 'AUTH_INVALID_CREDENTIALS') {
        await registerFailedLoginAttempt(
          email.trim().toLowerCase(),
          MAX_INVALID_LOGIN_ATTEMPTS,
          LOGIN_LOCKOUT_DURATION_MS,
        );
        setPasswordFeedback(GENERIC_AUTH_FAILURE_MESSAGE);
        return;
      }

      setToastFeedback({
        type: 'error',
        message: err?.message || 'Falha na autenticacao',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [clearInlineFeedback, displayName, email, isSignup, login, onLoginSuccess, password, signup]);

  return {
    isSignup,
    email,
    password,
    displayName,
    displayNameFeedback,
    emailFeedback,
    passwordFeedback,
    toastFeedback,
    isLoading: isSubmitting,
    setIsSignup: handleToggleAuthMode,
    setEmail: handleEmailChange,
    setPassword: handlePasswordChange,
    setDisplayName: handleDisplayNameChange,
    dismissToast: handleDismissToast,
    onSubmit: handleAuth,
  };
};
