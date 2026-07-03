import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fontSizes, spacing } from '../../../shared/constants/theme';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

interface TaskActivityCardProps {
  title: string;
  dateLabel: string;
  timeLabel?: string;
  statusLabel: 'Concluída' | 'Pendente';
  showOverdueWarning: boolean;
  overdueWarningText?: string;
  reinforcedFeedback: boolean;
  onComplete: () => void;
  onDelete: () => void;
}

export const TaskActivityCard: React.FC<TaskActivityCardProps> = ({
  title,
  dateLabel,
  timeLabel,
  statusLabel,
  showOverdueWarning,
  overdueWarningText,
  reinforcedFeedback,
  onComplete,
  onDelete,
}) => {
  const completed = statusLabel === 'Concluída';
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: ui.cardBackground,
          borderColor: ui.cardBorder,
          paddingHorizontal: scaleSpacing(spacing.spacious + 2),
          paddingVertical: scaleSpacing(spacing.spacious + 2),
          marginBottom: scaleSpacing(spacing.normal),
        },
        completed && [styles.cardCompleted, { backgroundColor: ui.successSurface, borderColor: ui.successBorder }],
        reinforcedFeedback && completed && styles.cardCompletedReinforced,
      ]}
    >
      <View style={[styles.contentRow, { gap: scaleSpacing(spacing.normal) }]}>
        <View style={styles.infoColumn}>
          <Text
            style={[
              styles.title,
              { fontSize: scaleFont(fontSizes.large), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.normal) },
            ]}
          >
            {title}
          </Text>

          <View style={[styles.metaRow, { gap: scaleSpacing(spacing.compact), marginBottom: scaleSpacing(spacing.normal) }]}>
            <View
              style={[
                styles.metaPill,
                {
                  backgroundColor: ui.chipBackground,
                  borderColor: ui.cardBorder,
                  paddingHorizontal: scaleSpacing(spacing.normal),
                  paddingVertical: scaleSpacing(spacing.compact + 1),
                },
              ]}
            >
              <Text style={[styles.metaPillText, { color: ui.textSecondary, fontSize: scaleFont(fontSizes.small + 1) }]}>
                Data: {dateLabel}
              </Text>
            </View>

            {timeLabel ? (
              <View
                style={[
                  styles.metaPill,
                  {
                    backgroundColor: ui.chipBackground,
                    borderColor: ui.cardBorder,
                    paddingHorizontal: scaleSpacing(spacing.normal),
                    paddingVertical: scaleSpacing(spacing.compact + 1),
                  },
                ]}
              >
                <Text style={[styles.metaPillText, { color: ui.textSecondary, fontSize: scaleFont(fontSizes.small + 1) }]}>
                  Horário: {timeLabel}
                </Text>
              </View>
            ) : null}
          </View>

          {showOverdueWarning ? (
            <Text
              style={[
                styles.warning,
                {
                  marginBottom: scaleSpacing(spacing.normal),
                  fontSize: scaleFont(fontSizes.small + 1),
                  color: ui.warningText,
                },
              ]}
            >
              {overdueWarningText || 'Horário previsto já passou.'}
            </Text>
          ) : null}

          <View
            style={[
              styles.statusChip,
              {
                backgroundColor: ui.warningSurface,
                borderColor: ui.cardBorder,
                borderWidth: 1,
                paddingHorizontal: scaleSpacing(spacing.normal),
                paddingVertical: scaleSpacing(spacing.compact + 2),
              },
              completed && [styles.statusChipSuccess, { backgroundColor: ui.successSurface }],
            ]}
          >
            <Text style={[styles.statusText, { fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={[styles.actionsColumn, { gap: scaleSpacing(spacing.normal) }]}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: ui.primaryButtonBackground,
                paddingHorizontal: scaleSpacing(spacing.normal),
                paddingVertical: scaleSpacing(spacing.compact + 2),
              },
              completed && styles.actionButtonDisabled,
            ]}
            onPress={onComplete}
            accessibilityRole="button"
            accessibilityLabel={`Marcar como feita ${title}`}
            disabled={completed}
          >
            <Text
              style={[
                styles.actionButtonText,
                { color: ui.primaryButtonText, fontSize: scaleFont(fontSizes.small + 1) },
              ]}
            >
              Marcar como feita
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.deleteButton,
              {
                backgroundColor: ui.dangerSurface,
                borderColor: ui.dangerBorder,
                paddingHorizontal: scaleSpacing(spacing.normal),
                paddingVertical: scaleSpacing(spacing.compact + 2),
              },
            ]}
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={`Excluir tarefa ${title}`}
          >
            <Text
              style={[
                styles.actionButtonText,
                styles.deleteButtonText,
                { color: ui.dangerText, fontSize: scaleFont(fontSizes.small + 1) },
              ]}
            >
              Excluir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
  },
  cardCompleted: {
    borderColor: '#B6DCC2',
    backgroundColor: '#F2FBF5',
  },
  cardCompletedReinforced: {
    borderWidth: 2,
    borderColor: '#2FA35A',
  },
  title: {
    fontWeight: '800',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  infoColumn: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaPill: {
    borderRadius: 999,
    borderWidth: 1,
  },
  metaPillText: {
    fontWeight: '600',
  },
  warning: {
    fontWeight: '700',
  },
  actionsColumn: {
    width: 148,
    justifyContent: 'flex-end',
  },
  statusChip: {
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  statusChipSuccess: {
    backgroundColor: '#CFEEDB',
  },
  statusText: {
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#1E2028',
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  actionButtonText: {
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#FFF2F0',
    borderColor: '#F59E8B',
    borderWidth: 1,
  },
  deleteButtonText: {
    color: '#A31D0F',
  },
});
