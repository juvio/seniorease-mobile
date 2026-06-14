import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';

interface TaskActivityCardProps {
  title: string;
  reminderText: string;
  statusLabel: string;
  actionLabel: string;
  statusTone: 'warning' | 'neutral' | 'success';
  onPrimaryAction: () => void;
}

export const TaskActivityCard: React.FC<TaskActivityCardProps> = ({
  title,
  reminderText,
  statusLabel,
  actionLabel,
  statusTone,
  onPrimaryAction,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.reminder}>{reminderText}</Text>

      <View style={styles.footerRow}>
        <View style={[styles.statusChip, statusTone === 'success' && styles.statusChipSuccess]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPrimaryAction}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} atividade ${title}`}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ECEDEF',
    borderRadius: 16,
    paddingHorizontal: spacing.spacious,
    paddingVertical: spacing.spacious,
    borderWidth: 1,
    borderColor: '#D8DADF',
    marginBottom: spacing.normal,
  },
  title: {
    fontSize: fontSizes.medium,
    color: '#2B2B2E',
    fontWeight: '700',
    marginBottom: spacing.compact,
  },
  reminder: {
    fontSize: fontSizes.small + 1,
    color: '#6A6A71',
    marginBottom: spacing.normal,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    backgroundColor: '#F2E8B9',
    borderRadius: 999,
    paddingHorizontal: spacing.normal,
    paddingVertical: spacing.compact,
  },
  statusChipSuccess: {
    backgroundColor: '#CFEEDB',
  },
  statusText: {
    fontSize: fontSizes.small,
    color: '#3F3F43',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#1E2028',
    borderRadius: 999,
    minHeight: 44,
    minWidth: 82,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.spacious,
  },
  actionButtonText: {
    color: colors.background,
    fontSize: fontSizes.small + 1,
    fontWeight: '700',
  },
});
