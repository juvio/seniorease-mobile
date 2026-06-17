import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { validateEmail, validatePassword } from '../../shared/utils/validators';
import { useAuth } from './useAuth';

interface AuthScreenHookParams {
  onLoginSuccess?: () => void;
}

export const useAuthScreen = ({ onLoginSuccess }: AuthScreenHookParams = {}) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, login, error } = useAuth();

  const handleAuth = useCallback(async () => {
    setIsSubmitting(true);

    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert('Atencao', 'Por favor, preencha todos os campos');
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert('Erro', 'Email invalido');
        return;
      }

      if (!validatePassword(password)) {
        Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
        return;
      }

      if (isSignup) {
        if (!displayName.trim()) {
          Alert.alert('Atencao', 'Por favor, digite seu nome');
          return;
        }

        await signup(email.trim(), password, displayName.trim());
        Alert.alert('Sucesso', 'Conta criada! Bem-vindo ao SeniorEase');
      } else {
        await login(email.trim(), password);
        Alert.alert('Sucesso', 'Bem-vindo ao SeniorEase!');
      }

      onLoginSuccess?.();
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Falha na autenticacao');
    } finally {
      setIsSubmitting(false);
    }
  }, [displayName, email, isSignup, login, onLoginSuccess, password, signup]);

  return {
    isSignup,
    email,
    password,
    displayName,
    isLoading: isSubmitting,
    authError: error,
    setIsSignup,
    setEmail,
    setPassword,
    setDisplayName,
    onSubmit: handleAuth,
  };
};
