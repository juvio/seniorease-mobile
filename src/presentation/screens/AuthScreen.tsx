import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { fontSizes, spacing, colors } from '../../shared/constants/theme';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../../shared/utils/validators';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { signup, login, loading, error } = useAuth();

  const handleAuth = async () => {
    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        Alert.alert('Atenção', 'Por favor, preencha todos os campos');
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert('Erro', 'Email inválido');
        return;
      }

      if (!validatePassword(password)) {
        Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
        return;
      }

      if (isSignup) {
        if (!displayName.trim()) {
          Alert.alert('Atenção', 'Por favor, digite seu nome');
          return;
        }

        await signup(email, password, displayName);
        Alert.alert('Sucesso', 'Conta criada! Bem-vindo ao SeniorEase');
      } else {
        await login(email, password);
        Alert.alert('Sucesso', 'Bem-vindo ao SeniorEase!');
      }

      onLoginSuccess();
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha na autenticação');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SeniorEase</Text>
      <Text style={styles.subtitle}>Seu organizador simplificado</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          accessibilityLabel="Email input"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          accessibilityLabel="Password input"
        />

        {isSignup && (
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={displayName}
            onChangeText={setDisplayName}
            editable={!loading}
            accessibilityLabel="Display name input"
          />
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={loading}
          accessibilityLabel={isSignup ? 'Signup button' : 'Login button'}
          accessibilityRole="button"
          accessibilityHint={isSignup ? 'Double tap to create account' : 'Double tap to login'}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.buttonText}>{isSignup ? 'Criar Conta' : 'Entrar'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsSignup(!isSignup)}
          accessibilityLabel="Toggle signup"
          accessibilityRole="button"
        >
          <Text style={styles.toggleText}>
            {isSignup ? 'Já tem conta? Faça login' : 'Não tem conta? Crie uma'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: spacing.spacious,
  },
  title: {
    fontSize: fontSizes.large + 4,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: spacing.normal,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.spacious,
  },
  form: {
    gap: spacing.normal,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.normal,
    paddingVertical: spacing.spacious,
    fontSize: fontSizes.medium,
    minHeight: 48,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.spacious,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
  toggleText: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: fontSizes.medium,
    marginTop: spacing.spacious,
  },
});
