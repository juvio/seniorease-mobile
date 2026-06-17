import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';
import { AppTopBar } from '../shared/AppTopBar';
import { KeyboardAwareFormContainer } from '../shared/KeyboardAwareFormContainer';

interface AuthViewProps {
  isSignup: boolean;
  email: string;
  password: string;
  displayName: string;
  isLoading: boolean;
  authError: string | null;
  setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setDisplayName: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  isSignup,
  email,
  password,
  displayName,
  isLoading,
  authError,
  setIsSignup,
  setEmail,
  setPassword,
  setDisplayName,
  onSubmit,
}) => {
  return (
    <KeyboardAwareFormContainer contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <AppTopBar actionLabel="Entrar" />

        <Text style={styles.title}>{isSignup ? 'Criar sua conta' : 'Bem-vindo de volta'}</Text>
        <Text style={styles.subtitle}>
          {isSignup
            ? 'Informe seus dados para comecar a usar o app.'
            : 'Acesse para continuar com suas atividades.'}
        </Text>

        <View style={styles.formCard}>
          {isSignup && (
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={colors.textSecondary}
              value={displayName}
              onChangeText={setDisplayName}
              editable={!isLoading}
              accessibilityLabel="Campo nome completo"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Campo email"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            secureTextEntry
            accessibilityLabel="Campo senha"
          />

          {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={onSubmit}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={isSignup ? 'Criar conta' : 'Entrar na conta'}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.submitButtonText}>{isSignup ? 'Criar conta' : 'Entrar'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSignup((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel="Alternar entre login e cadastro"
          >
            <Text style={styles.toggleText}>
              {isSignup ? 'Ja tem conta? Entrar' : 'Ainda nao tem conta? Criar agora'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareFormContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.spacious,
  },
  title: {
    fontSize: fontSizes.extraLarge + 2,
    color: '#1E1B4B',
    fontWeight: '700',
    marginBottom: spacing.normal,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: '#63636B',
    marginBottom: spacing.spacious,
  },
  formCard: {
    backgroundColor: '#ECEDEF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DADF',
    padding: spacing.spacious,
  },
  input: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFD1D7',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.normal,
    paddingVertical: spacing.normal,
    fontSize: fontSizes.medium,
    marginBottom: spacing.normal,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.small + 1,
    marginBottom: spacing.normal,
  },
  submitButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#1E2028',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.compact,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: '700',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: spacing.spacious,
    fontSize: fontSizes.medium,
    color: '#3F4FA8',
    fontWeight: '600',
  },
});
