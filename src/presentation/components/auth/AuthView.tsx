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
import { PASSWORD_REQUIREMENTS_TEXT } from '../../../shared/utils/validators';
import { AppTopBar } from '../shared/AppTopBar';
import { FeedbackToast } from '../shared/FeedbackToast';
import { KeyboardAwareFormContainer } from '../shared/KeyboardAwareFormContainer';

type AuthToastType = 'success' | 'error' | 'warning';

interface AuthToastState {
  type: AuthToastType;
  message: string;
}

interface AuthViewProps {
  isSignup: boolean;
  email: string;
  password: string;
  displayName: string;
  displayNameFeedback: string | null;
  emailFeedback: string | null;
  passwordFeedback: string | null;
  toastFeedback: AuthToastState | null;
  isLoading: boolean;
  setIsSignup: () => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setDisplayName: (value: string) => void;
  dismissToast: () => void;
  onSubmit: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  isSignup,
  email,
  password,
  displayName,
  displayNameFeedback,
  emailFeedback,
  passwordFeedback,
  toastFeedback,
  isLoading,
  setIsSignup,
  setEmail,
  setPassword,
  setDisplayName,
  dismissToast,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <KeyboardAwareFormContainer contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <FeedbackToast
          visible={Boolean(toastFeedback)}
          type={toastFeedback?.type || 'error'}
          message={toastFeedback?.message || ''}
          onClose={dismissToast}
          autoHideMs={toastFeedback?.type === 'success' ? 3000 : undefined}
        />

        <AppTopBar actionLabel="Entrar" />

        <Text style={styles.title}>{isSignup ? 'Criar sua conta' : 'Bem-vindo de volta'}</Text>
        <Text style={styles.subtitle}>
          {isSignup
            ? 'Informe seus dados para comecar a usar o app.'
            : 'Acesse para continuar com suas atividades.'}
        </Text>

        <View style={styles.formCard}>
          {isSignup && (
            <>
              <TextInput
                style={[styles.input, displayNameFeedback ? styles.inputError : null]}
                placeholder="Nome completo"
                placeholderTextColor={colors.textSecondary}
                value={displayName}
                onChangeText={setDisplayName}
                editable={!isLoading}
                accessibilityLabel="Campo nome completo"
              />

              {displayNameFeedback ? <Text style={styles.errorText}>{displayNameFeedback}</Text> : null}
            </>
          )}

          <TextInput
            style={[styles.input, emailFeedback ? styles.inputError : null]}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Campo email"
          />

          {emailFeedback ? <Text style={styles.errorText}>{emailFeedback}</Text> : null}

          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={[styles.input, styles.passwordInput, passwordFeedback ? styles.inputError : null]}
              placeholder="Senha"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              secureTextEntry={!showPassword}
              accessibilityLabel="Campo senha"
            />

            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              style={styles.passwordToggleButton}
            >
              <Text style={styles.passwordToggleText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
          </View>

          {isSignup ? <Text style={styles.passwordHintText}>{PASSWORD_REQUIREMENTS_TEXT}</Text> : null}

          {passwordFeedback ? <Text style={styles.errorText}>{passwordFeedback}</Text> : null}

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
            onPress={setIsSignup}
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
  passwordInputWrapper: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 88,
  },
  passwordToggleButton: {
    position: 'absolute',
    right: spacing.normal,
    top: 0,
    bottom: spacing.normal,
    justifyContent: 'center',
  },
  passwordToggleText: {
    fontSize: fontSizes.small + 1,
    fontWeight: '700',
    color: '#3F4FA8',
  },
  passwordHintText: {
    color: colors.textSecondary,
    fontSize: fontSizes.small,
    marginTop: -2,
    marginBottom: spacing.normal,
    lineHeight: 18,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.small + 1,
    marginBottom: spacing.normal,
  },
  inputError: {
    borderColor: colors.error,
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
