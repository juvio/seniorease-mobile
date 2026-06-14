import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';

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
  return (
    <View style={[styles.card, tone === 'danger' && styles.cardDanger]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, tone === 'danger' && styles.buttonDanger]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${actionLabel} ${title}`}
      >
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ECEDEF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DADF',
    padding: spacing.spacious,
    marginBottom: spacing.normal,
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
    marginRight: spacing.normal,
  },
  title: {
    fontSize: fontSizes.medium,
    color: '#2B2B2E',
    fontWeight: '700',
    marginBottom: spacing.compact,
  },
  subtitle: {
    fontSize: fontSizes.small + 1,
    color: '#6A6A71',
  },
  button: {
    minHeight: 42,
    minWidth: 84,
    borderRadius: 999,
    backgroundColor: '#1E2028',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.normal,
  },
  buttonDanger: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: colors.background,
    fontSize: fontSizes.small + 1,
    fontWeight: '700',
  },
});
