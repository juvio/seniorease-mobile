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
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

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
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();

  return (
    <KeyboardAwareFormContainer
      containerStyle={{ backgroundColor: ui.screenBackground }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.content, { paddingHorizontal: scaleSpacing(spacing.spacious) }]}>
        <FeedbackToast
          visible={Boolean(toastFeedback)}
          type={toastFeedback?.type || 'error'}
          message={toastFeedback?.message || ''}
          onClose={dismissToast}
          autoHideMs={toastFeedback?.type === 'success' ? 3000 : undefined}
        />

        <AppTopBar />

        <Text
          style={[
            styles.title,
            { fontSize: scaleFont(fontSizes.extraLarge + 2), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.normal) },
          ]}
        >
          {isSignup ? 'Criar sua conta' : 'Bem-vindo de volta'}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { fontSize: scaleFont(fontSizes.medium), color: ui.textSecondary, marginBottom: scaleSpacing(spacing.spacious) },
          ]}
        >
          {isSignup
            ? 'Informe seus dados para comecar a usar o app.'
            : 'Acesse para continuar com suas atividades.'}
        </Text>

        <View
          style={[
            styles.formCard,
            {
              backgroundColor: ui.cardBackground,
              borderColor: ui.cardBorder,
              padding: scaleSpacing(spacing.spacious),
            },
          ]}
        >
          {isSignup && (
            <>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: ui.cardBorder,
                    backgroundColor: colors.background,
                    paddingHorizontal: scaleSpacing(spacing.normal),
                    paddingVertical: scaleSpacing(spacing.normal),
                    fontSize: scaleFont(fontSizes.medium),
                    marginBottom: scaleSpacing(spacing.normal),
                    color: ui.textPrimary,
                  },
                  displayNameFeedback ? styles.inputError : null,
                ]}
                placeholder="Nome completo"
                placeholderTextColor={ui.textSecondary}
                value={displayName}
                onChangeText={setDisplayName}
                editable={!isLoading}
                accessibilityLabel="Campo nome completo"
              />

              {displayNameFeedback ? <Text style={[styles.errorText, { fontSize: scaleFont(fontSizes.small + 1), marginBottom: scaleSpacing(spacing.normal) }]}>{displayNameFeedback}</Text> : null}
            </>
          )}

          <TextInput
            style={[
              styles.input,
              {
                borderColor: ui.cardBorder,
                backgroundColor: colors.background,
                paddingHorizontal: scaleSpacing(spacing.normal),
                paddingVertical: scaleSpacing(spacing.normal),
                fontSize: scaleFont(fontSizes.medium),
                marginBottom: scaleSpacing(spacing.normal),
                color: ui.textPrimary,
              },
              emailFeedback ? styles.inputError : null,
            ]}
            placeholder="Email"
            placeholderTextColor={ui.textSecondary}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Campo email"
          />

          {emailFeedback ? <Text style={[styles.errorText, { fontSize: scaleFont(fontSizes.small + 1), marginBottom: scaleSpacing(spacing.normal) }]}>{emailFeedback}</Text> : null}

          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                {
                  borderColor: ui.cardBorder,
                  backgroundColor: colors.background,
                  paddingHorizontal: scaleSpacing(spacing.normal),
                  paddingVertical: scaleSpacing(spacing.normal),
                  fontSize: scaleFont(fontSizes.medium),
                  marginBottom: scaleSpacing(spacing.normal),
                  color: ui.textPrimary,
                },
                passwordFeedback ? styles.inputError : null,
              ]}
              placeholder="Senha"
              placeholderTextColor={ui.textSecondary}
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
              <Text style={[styles.passwordToggleText, { fontSize: scaleFont(fontSizes.small + 1), color: ui.chipSelectedBackground }]}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

          {isSignup ? (
            <Text
              style={[
                styles.passwordHintText,
                {
                  color: ui.textSecondary,
                  fontSize: scaleFont(fontSizes.small),
                  marginBottom: scaleSpacing(spacing.normal),
                },
              ]}
            >
              {PASSWORD_REQUIREMENTS_TEXT}
            </Text>
          ) : null}

          {passwordFeedback ? <Text style={[styles.errorText, { fontSize: scaleFont(fontSizes.small + 1), marginBottom: scaleSpacing(spacing.normal) }]}>{passwordFeedback}</Text> : null}

          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: ui.primaryButtonBackground,
                marginTop: scaleSpacing(spacing.compact),
              },
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={onSubmit}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={isSignup ? 'Criar conta' : 'Entrar na conta'}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.submitButtonText, { color: ui.primaryButtonText, fontSize: scaleFont(fontSizes.medium) }]}>
                {isSignup ? 'Criar conta' : 'Entrar'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={setIsSignup}
            accessibilityRole="button"
            accessibilityLabel="Alternar entre login e cadastro"
          >
            <Text
              style={[
                styles.toggleText,
                {
                  marginTop: scaleSpacing(spacing.spacious),
                  fontSize: scaleFont(fontSizes.medium),
                  color: ui.chipSelectedBackground,
                },
              ]}
            >
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
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
  },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
  },
  input: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
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
    fontWeight: '700',
  },
  passwordHintText: {
    marginTop: -2,
    lineHeight: 18,
  },
  errorText: {
    color: colors.error,
  },
  inputError: {
    borderColor: colors.error,
  },
  submitButton: {
    minHeight: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontWeight: '700',
  },
  toggleText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
