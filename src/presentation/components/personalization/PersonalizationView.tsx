import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';
import { AccessibilitySettings } from '../../../domain/entities/Settings';
import { AppTopBar } from '../shared/AppTopBar';
import { screenScaffoldStyles } from '../shared/screenScaffoldStyles';

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
  fontSizeOptions: Option<AccessibilitySettings['fontSize']>[];
  spacingOptions: Option<AccessibilitySettings['spacing']>[];
  contrastOptions: Option<AccessibilitySettings['contrast']>[];
  onFontSizeChange: (value: AccessibilitySettings['fontSize']) => void;
  onSpacingChange: (value: AccessibilitySettings['spacing']) => void;
  onContrastChange: (value: AccessibilitySettings['contrast']) => void;
  onInterfaceModeToggle: (value: boolean) => void;
  onReinforcedFeedbackToggle: (value: boolean) => void;
  onConfirmCriticalActionsToggle: (value: boolean) => void;
  onSave: () => void;
}

export const PersonalizationView: React.FC<PersonalizationViewProps> = ({
  isLoading,
  displayName,
  email,
  initial,
  memberSince,
  accessibility,
  fontSizeOptions,
  spacingOptions,
  contrastOptions,
  onFontSizeChange,
  onSpacingChange,
  onContrastChange,
  onInterfaceModeToggle,
  onReinforcedFeedbackToggle,
  onConfirmCriticalActionsToggle,
  onSave,
}) => {
  if (isLoading || !accessibility) {
    return (
      <View style={screenScaffoldStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando configuracoes...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={screenScaffoldStyles.container}
      contentContainerStyle={screenScaffoldStyles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <AppTopBar actionLabel="Menu" />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
          <Text style={styles.profileMemberSince}>Membro desde: {memberSince}</Text>
        </View>
      </View>

      <Text style={styles.title}>Deixe o SeniorEase confortavel para voce</Text>
      <Text style={styles.subtitle}>
        Ajuste legibilidade, contraste, espacamento, navegacao e confirmacoes.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tamanho da fonte</Text>
        <View style={styles.optionsContainer}>
          {fontSizeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                accessibility.fontSize === option.value && styles.optionSelected,
              ]}
              onPress={() => onFontSizeChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: accessibility.fontSize === option.value }}
              accessibilityLabel={`Tamanho da fonte ${option.label}`}
            >
              <Text
                style={[
                  styles.optionText,
                  accessibility.fontSize === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Conforto de espacamento</Text>
        <View style={styles.optionsContainer}>
          {spacingOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                accessibility.spacing === option.value && styles.optionSelected,
              ]}
              onPress={() => onSpacingChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: accessibility.spacing === option.value }}
              accessibilityLabel={`Espacamento ${option.label}`}
            >
              <Text
                style={[
                  styles.optionText,
                  accessibility.spacing === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nivel de contraste</Text>
        <View style={styles.optionsContainer}>
          {contrastOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                accessibility.contrast === option.value && styles.optionSelected,
              ]}
              onPress={() => onContrastChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: accessibility.contrast === option.value }}
              accessibilityLabel={`Nivel de contraste ${option.label}`}
            >
              <Text
                style={[
                  styles.optionText,
                  accessibility.contrast === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Modo de interface</Text>
        <Text style={styles.helperText}>
          O modo simplificado mantem apenas escolhas essenciais para facilitar as acoes.
        </Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Navegacao simplificada</Text>
          <Switch
            value={accessibility.interfaceMode === 'basic'}
            onValueChange={onInterfaceModeToggle}
            trackColor={{ false: colors.border, true: '#8FD3A9' }}
            thumbColor={accessibility.interfaceMode === 'basic' ? colors.success : '#FFFFFF'}
            accessibilityLabel="Alternar modo simplificado"
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Feedback reforcado</Text>
          <Switch
            value={accessibility.reinforcedFeedback}
            onValueChange={onReinforcedFeedbackToggle}
            trackColor={{ false: colors.border, true: '#8FD3A9' }}
            thumbColor={accessibility.reinforcedFeedback ? colors.success : '#FFFFFF'}
            accessibilityLabel="Alternar feedback reforcado"
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Confirmacao de acoes criticas</Text>
          <Switch
            value={accessibility.confirmCriticalActions}
            onValueChange={onConfirmCriticalActionsToggle}
            trackColor={{ false: colors.border, true: '#8FD3A9' }}
            thumbColor={accessibility.confirmCriticalActions ? colors.success : '#FFFFFF'}
            accessibilityLabel="Alternar confirmacao de acoes criticas"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSave}
        accessibilityRole="button"
        accessibilityLabel="Salvar configuracoes"
      >
        <Text style={styles.saveButtonText}>Salvar alteracoes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    marginTop: spacing.normal,
    color: colors.textSecondary,
    fontSize: fontSizes.medium,
  },
  title: {
    fontSize: fontSizes.extraLarge + 2,
    fontWeight: 'bold',
    color: '#1E1B4B',
    lineHeight: 36,
    marginBottom: spacing.normal,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: colors.textSecondary,
    marginBottom: spacing.spacious,
  },
  card: {
    backgroundColor: '#ECEDEF',
    borderRadius: 16,
    padding: spacing.spacious,
    borderWidth: 1,
    borderColor: '#DEDFE3',
    marginBottom: spacing.spacious,
  },
  sectionTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.normal,
  },
  helperText: {
    fontSize: fontSizes.small + 1,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.normal,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.compact,
  },
  option: {
    paddingHorizontal: spacing.spacious,
    paddingVertical: spacing.normal,
    borderRadius: 999,
    backgroundColor: '#E3E4E8',
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#4A67F0',
  },
  optionText: {
    fontSize: fontSizes.small + 1,
    color: colors.text,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.background,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.normal / 2,
  },
  switchLabel: {
    flex: 1,
    marginRight: spacing.normal,
    fontSize: fontSizes.medium,
    color: colors.text,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.spacious,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.normal,
    minHeight: 48,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: '#ECEDEF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DADF',
    padding: spacing.spacious,
    marginBottom: spacing.spacious,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A67F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.normal,
  },
  avatarText: {
    color: colors.background,
    fontSize: fontSizes.large + 4,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSizes.medium,
    color: '#2B2B2E',
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: fontSizes.small + 1,
    color: '#5D5D66',
    marginBottom: 2,
  },
  profileMemberSince: {
    fontSize: fontSizes.small,
    color: '#6A6A71',
  },
});
