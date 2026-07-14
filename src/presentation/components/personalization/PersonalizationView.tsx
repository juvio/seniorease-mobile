import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';
import { AccessibilitySettings } from '../../../domain/entities/Settings';
import { AppTopBar } from '../shared/AppTopBar';
import { screenScaffoldStyles } from '../shared/screenScaffoldStyles';
import { KeyboardAwareFormContainer } from '../shared/KeyboardAwareFormContainer';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';
import { FeedbackToast } from '../shared/FeedbackToast';

type Option<T> = {
  value: T;
  label: string;
};

interface PersonalizationViewProps {
  isLoading: boolean;
  displayName: string;
  email: string;
  initial: string;
  memberSince: string;
  accessibility: AccessibilitySettings | undefined;
  toast: { visible: boolean; type: 'success' | 'warning' | 'error'; message: string };
  setToast: (value: { visible: boolean; type: 'success' | 'warning' | 'error'; message: string }) => void;
  fontSizeOptions: Option<AccessibilitySettings['fontSize']>[];
  spacingOptions: Option<AccessibilitySettings['spacing']>[];
  contrastOptions: Option<AccessibilitySettings['contrast']>[];
  onFontSizeChange: (value: AccessibilitySettings['fontSize']) => void;
  onSpacingChange: (value: AccessibilitySettings['spacing']) => void;
  onContrastChange: (value: AccessibilitySettings['contrast']) => void;
  onInterfaceModeToggle: (value: boolean) => void;
  onReinforcedFeedbackToggle: (value: boolean) => void;
  onConfirmCriticalActionsToggle: (value: boolean) => void;
  onLogoutPress: () => void;
  onSave: () => void;
}

export const PersonalizationView: React.FC<PersonalizationViewProps> = ({
  isLoading,
  displayName,
  email,
  initial,
  memberSince,
  accessibility,
  toast,
  setToast,
  fontSizeOptions,
  spacingOptions,
  contrastOptions,
  onFontSizeChange,
  onSpacingChange,
  onContrastChange,
  onInterfaceModeToggle,
  onReinforcedFeedbackToggle,
  onConfirmCriticalActionsToggle,
  onLogoutPress,
  onSave,
}) => {
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();

  if (isLoading || !accessibility) {
    return (
      <SafeAreaView style={[screenScaffoldStyles.container, { backgroundColor: ui.screenBackground }]} edges={['top', 'bottom']}>
        <View style={[screenScaffoldStyles.loadingContainer, { backgroundColor: ui.screenBackground }]}>
          <ActivityIndicator size="large" color={ui.chipSelectedBackground} />
          <Text style={[styles.loadingText, { marginTop: scaleSpacing(spacing.normal), color: ui.textSecondary, fontSize: scaleFont(fontSizes.medium) }]}>
            Carregando configuracoes...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAwareFormContainer
      containerStyle={{ backgroundColor: ui.screenBackground }}
      contentContainerStyle={screenScaffoldStyles.contentContainer}
      scrollEnabledWithKeyboardOnly={false}
      safeAreaEdges={['top']}
    >
        <AppTopBar />

      <FeedbackToast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, visible: false })}
        autoHideMs={3200}
      />

      <View style={[styles.profileHeader, { marginBottom: scaleSpacing(spacing.spacious), gap: scaleSpacing(spacing.normal) }]}>
        <View style={[styles.profileCard, { backgroundColor: ui.cardBackground, borderColor: ui.cardBorder, padding: scaleSpacing(spacing.spacious) }]}>
          <View style={[styles.avatar, { backgroundColor: ui.chipSelectedBackground, marginRight: scaleSpacing(spacing.normal) }]}>
            <Text style={[styles.avatarText, { fontSize: scaleFont(fontSizes.large + 4) }]}>{initial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary }]}>{displayName}</Text>
            <Text style={[styles.profileEmail, { fontSize: scaleFont(fontSizes.small + 1), color: ui.textSecondary }]}>{email}</Text>
            <Text style={[styles.profileMemberSince, { fontSize: scaleFont(fontSizes.small), color: ui.textSecondary }]}>Membro desde: {memberSince}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: ui.cardBackground,
              borderColor: ui.cardBorder,
              paddingHorizontal: scaleSpacing(spacing.normal),
              minHeight: scaleSpacing(spacing.spacious) + 6,
            },
          ]}
          onPress={onLogoutPress}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Text style={[styles.logoutButtonText, { color: ui.textSecondary, fontSize: scaleFont(fontSizes.small) }]}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { fontSize: scaleFont(fontSizes.extraLarge + 2), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.normal) }]}>
        Configurações
      </Text>
      <Text style={[styles.subtitle, { fontSize: scaleFont(fontSizes.medium), color: ui.textSecondary, marginBottom: scaleSpacing(spacing.spacious) }]}>
        Ajuste leitura, contraste, espaçamento e confirmações.
      </Text>

      <View style={[styles.card, { backgroundColor: ui.cardBackground, borderColor: ui.cardBorder, padding: scaleSpacing(spacing.spacious), marginBottom: scaleSpacing(spacing.spacious) }]}>
        <Text style={[styles.sectionTitle, { fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.normal) }]}>
          Tamanho da fonte
        </Text>
        <View style={[styles.optionsContainer, { gap: scaleSpacing(spacing.compact) }]}>
          {fontSizeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                {
                  backgroundColor: ui.chipBackground,
                  paddingHorizontal: scaleSpacing(spacing.spacious),
                  paddingVertical: scaleSpacing(spacing.normal),
                },
                accessibility.fontSize === option.value && styles.optionSelected,
                accessibility.fontSize === option.value && { backgroundColor: ui.chipSelectedBackground },
              ]}
              onPress={() => onFontSizeChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: accessibility.fontSize === option.value }}
              accessibilityLabel={`Tamanho da fonte ${option.label}`}
            >
              <Text
                style={[
                  styles.optionText,
                  { fontSize: scaleFont(fontSizes.small + 1), color: ui.chipText },
                  accessibility.fontSize === option.value && styles.optionTextSelected,
                  accessibility.fontSize === option.value && { color: ui.chipSelectedText },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: ui.cardBackground, borderColor: ui.cardBorder, padding: scaleSpacing(spacing.spacious), marginBottom: scaleSpacing(spacing.spacious) }]}>
        <Text style={[styles.sectionTitle, { fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.normal) }]}>
          Conforto de espacamento
        </Text>
        <View style={[styles.optionsContainer, { gap: scaleSpacing(spacing.compact) }]}>
          {spacingOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                {
                  backgroundColor: ui.chipBackground,
                  paddingHorizontal: scaleSpacing(spacing.spacious),
                  paddingVertical: scaleSpacing(spacing.normal),
                },
                accessibility.spacing === option.value && styles.optionSelected,
                accessibility.spacing === option.value && { backgroundColor: ui.chipSelectedBackground },
              ]}
              onPress={() => onSpacingChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: accessibility.spacing === option.value }}
              accessibilityLabel={`Espacamento ${option.label}`}
            >
              <Text
                style={[
                  styles.optionText,
                  { fontSize: scaleFont(fontSizes.small + 1), color: ui.chipText },
                  accessibility.spacing === option.value && styles.optionTextSelected,
                  accessibility.spacing === option.value && { color: ui.chipSelectedText },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: ui.cardBackground, borderColor: ui.cardBorder, padding: scaleSpacing(spacing.spacious), marginBottom: scaleSpacing(spacing.spacious) }]}>
        <Text style={[styles.sectionTitle, { fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.normal) }]}>
          Nivel de contraste
        </Text>
        <View style={[styles.optionsContainer, { gap: scaleSpacing(spacing.compact) }]}>
          {contrastOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                {
                  backgroundColor: ui.chipBackground,
                  paddingHorizontal: scaleSpacing(spacing.spacious),
                  paddingVertical: scaleSpacing(spacing.normal),
                },
                accessibility.contrast === option.value && styles.optionSelected,
                accessibility.contrast === option.value && { backgroundColor: ui.chipSelectedBackground },
              ]}
              onPress={() => onContrastChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: accessibility.contrast === option.value }}
              accessibilityLabel={`Nivel de contraste ${option.label}`}
            >
              <Text
                style={[
                  styles.optionText,
                  { fontSize: scaleFont(fontSizes.small + 1), color: ui.chipText },
                  accessibility.contrast === option.value && styles.optionTextSelected,
                  accessibility.contrast === option.value && { color: ui.chipSelectedText },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: ui.cardBackground, borderColor: ui.cardBorder, padding: scaleSpacing(spacing.spacious), marginBottom: scaleSpacing(spacing.spacious) }]}>
        <Text style={[styles.sectionTitle, { fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.normal) }]}>
          Preferências de comportamento
        </Text>
        <Text style={[styles.helperText, { fontSize: scaleFont(fontSizes.small + 1), color: ui.textSecondary, marginBottom: scaleSpacing(spacing.normal) }]}>
          Estes ajustes definem como a Home e as ações funcionam no dia a dia.
        </Text>

        <View style={[styles.switchRow, { paddingVertical: scaleSpacing(spacing.normal / 2) }]}>
          <Text style={[styles.switchLabel, { marginRight: scaleSpacing(spacing.normal), fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary }]}>
            Modo simplificado
          </Text>
          <Switch
            value={accessibility.interfaceMode === 'basic'}
            onValueChange={onInterfaceModeToggle}
            trackColor={{ false: ui.cardBorder, true: '#8FD3A9' }}
            thumbColor={accessibility.interfaceMode === 'basic' ? '#34C759' : '#FFFFFF'}
            accessibilityLabel="Alternar modo simplificado"
          />
        </View>

        <View style={[styles.switchRow, { paddingVertical: scaleSpacing(spacing.normal / 2) }]}>
          <Text style={[styles.switchLabel, { marginRight: scaleSpacing(spacing.normal), fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary }]}>
            Feedback visual reforçado
          </Text>
          <Switch
            value={accessibility.reinforcedFeedback}
            onValueChange={onReinforcedFeedbackToggle}
            trackColor={{ false: ui.cardBorder, true: '#8FD3A9' }}
            thumbColor={accessibility.reinforcedFeedback ? '#34C759' : '#FFFFFF'}
            accessibilityLabel="Alternar feedback reforcado"
          />
        </View>

        <View style={[styles.switchRow, { paddingVertical: scaleSpacing(spacing.normal / 2) }]}>
          <Text style={[styles.switchLabel, { marginRight: scaleSpacing(spacing.normal), fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary }]}>
            Confirmação adicional antes de ações críticas
          </Text>
          <Switch
            value={accessibility.confirmCriticalActions}
            onValueChange={onConfirmCriticalActionsToggle}
            trackColor={{ false: ui.cardBorder, true: '#8FD3A9' }}
            thumbColor={accessibility.confirmCriticalActions ? '#34C759' : '#FFFFFF'}
            accessibilityLabel="Alternar confirmacao de acoes criticas"
          />
        </View>
      </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: ui.chipSelectedBackground, paddingVertical: scaleSpacing(spacing.spacious), marginTop: scaleSpacing(spacing.normal) }]}
          onPress={onSave}
          accessibilityRole="button"
          accessibilityLabel="Salvar configuracoes"
        >
          <Text style={[styles.saveButtonText, { color: ui.chipSelectedText, fontSize: scaleFont(fontSizes.medium) }]}>Salvar alteracoes</Text>
        </TouchableOpacity>
    </KeyboardAwareFormContainer>
  );
};

const styles = StyleSheet.create({
  loadingText: {
  },
  title: {
    fontWeight: 'bold',
    lineHeight: 36,
  },
  subtitle: {
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  helperText: {
    lineHeight: 18,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    borderRadius: 999,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#4A67F0',
  },
  optionText: {
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.background,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  saveButtonText: {
    fontWeight: 'bold',
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.background,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    marginBottom: 2,
  },
  profileMemberSince: {
  },
  logoutButton: {
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 74,
    alignSelf: 'stretch',
  },
  logoutButtonText: {
    fontWeight: '600',
  },
});
