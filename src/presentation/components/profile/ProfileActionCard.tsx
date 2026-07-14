import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

type ActionTone = 'default' | 'danger';

interface ProfileActionCardProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  tone?: ActionTone;
  onPress: () => void;
}

export const ProfileActionCard: React.FC<ProfileActionCardProps> = ({
  title,
  subtitle,
  actionLabel,
  tone = 'default',
  onPress,
}) => {
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: ui.cardBackground,
          borderColor: ui.cardBorder,
          padding: scaleSpacing(spacing.spacious),
          marginBottom: scaleSpacing(spacing.normal),
        },
        tone === 'danger' && styles.cardDanger,
        tone === 'danger' && { borderColor: ui.dangerBorder, backgroundColor: ui.dangerSurface },
      ]}
    >
      <View style={[styles.content, { marginRight: scaleSpacing(spacing.normal) }]}>
        <Text style={[styles.title, { fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.compact) }]}>{title}</Text>
        <Text style={[styles.subtitle, { fontSize: scaleFont(fontSizes.small + 1), color: ui.textSecondary }]}>{subtitle}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: ui.primaryButtonBackground,
            paddingHorizontal: scaleSpacing(spacing.normal),
          },
          tone === 'danger' && styles.buttonDanger,
          tone === 'danger' && { backgroundColor: ui.dangerBorder },
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${actionLabel} ${title}`}
      >
        <Text style={[styles.buttonText, { color: colors.background, fontSize: scaleFont(fontSizes.small + 1) }]}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDanger: {
    borderColor: '#F0C8CC',
    backgroundColor: '#FCEEEF',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
  },
  button: {
    minHeight: 42,
    minWidth: 84,
    borderRadius: 999,
    backgroundColor: '#1E2028',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDanger: {
    backgroundColor: colors.error,
  },
  buttonText: {
    fontWeight: '700',
  },
});
