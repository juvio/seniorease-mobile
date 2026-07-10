import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSizes, spacing } from '../../../shared/constants/theme';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

interface TaskActivityCardProps {
  title: string;
  timeLabel?: string;
  statusLabel: 'Concluído' | 'Pendente' | 'Não concluído';
  showOverdueWarning: boolean;
  overdueWarningText?: string;
  reinforcedFeedback: boolean;
  onComplete: () => void;
  onDelete: () => void;
}

export const TaskActivityCard: React.FC<TaskActivityCardProps> = ({
  title,
  timeLabel,
  statusLabel,
  showOverdueWarning,
  overdueWarningText,
  reinforcedFeedback,
  onComplete,
  onDelete,
}) => {
  const completed = statusLabel === 'Concluído';
  const blockedPastTask = statusLabel === 'Não concluído';
  const canComplete = !completed && !blockedPastTask;
  const { scaleFont, scaleSpacing, fontScale, spacingScale, ui } = useAccessibilityTheme();
  const hasTimeLabel = Boolean(timeLabel && timeLabel.trim());
  const isStackedLayout = fontScale >= 1.25 || spacingScale >= 1.5;
  const isExtremeAccessibilityLayout = fontScale >= 1.5 || spacingScale >= 2;
  const actionRailWidth = Math.min(
    Math.max(scaleSpacing(spacing.extraSpacious * 5 + 8), scaleFont(100)),
    scaleFont(126),
  );
  const completeButtonMinHeight = Math.max(scaleSpacing(spacing.extraSpacious * 2 + 6), scaleFont(42));
  const deleteButtonMinHeight = Math.max(scaleSpacing(spacing.extraSpacious * 2), scaleFont(38));
  const contentGap = isStackedLayout
    ? scaleSpacing(spacing.normal)
    : Math.min(scaleSpacing(spacing.normal), scaleFont(14));
  const actionAreaPadding = Math.min(scaleSpacing(spacing.compact + 2), scaleFont(14));
  const actionButtonsGap = Math.min(scaleSpacing(spacing.normal), scaleFont(16));

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: ui.screenBackground,
          borderColor: ui.cardBorder,
          paddingHorizontal: scaleSpacing(spacing.spacious + 2),
          paddingVertical: scaleSpacing(spacing.spacious + 2),
          marginBottom: scaleSpacing(spacing.normal),
        },
        completed && [styles.cardCompleted, { borderColor: ui.successBorder }],
        reinforcedFeedback && completed && styles.cardCompletedReinforced,
      ]}
    >
      <View style={[styles.contentRow, isStackedLayout && styles.contentRowLarge, { gap: contentGap }]}>
        <View
          style={[
            styles.infoColumn,
            { paddingRight: isStackedLayout ? 0 : Math.min(scaleSpacing(spacing.normal), scaleFont(14)) },
            isStackedLayout && { marginBottom: scaleSpacing(spacing.compact) },
          ]}
        >
          <View
            style={[
              styles.statusBadge,
              styles.statusBadgeTopLeft,
              {
                backgroundColor: completed ? ui.successSurface : blockedPastTask ? ui.dangerSurface : ui.warningSurface,
                borderColor: completed ? ui.successBorder : blockedPastTask ? ui.dangerBorder : ui.cardBorder,
                paddingHorizontal: scaleSpacing(spacing.normal),
                paddingVertical: scaleSpacing(spacing.compact),
                marginBottom: scaleSpacing(spacing.normal),
                gap: scaleSpacing(spacing.compact),
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  width: scaleSpacing(spacing.compact),
                  height: scaleSpacing(spacing.compact),
                  backgroundColor: completed ? ui.successBorder : blockedPastTask ? ui.dangerText : ui.warningText,
                },
              ]}
            />
            <Text style={[styles.statusText, { fontSize: scaleFont(fontSizes.small), color: ui.textPrimary }]}>
              {statusLabel}
            </Text>
          </View>

          <Text
            style={[
              styles.title,
              {
                fontSize: scaleFont(fontSizes.large),
                color: ui.textPrimary,
                marginBottom: scaleSpacing(spacing.normal),
              },
            ]}
          >
            {title}
          </Text>

          {hasTimeLabel ? (
            <View
              style={[
                styles.timeRow,
                {
                  backgroundColor: ui.chipBackground,
                  borderColor: ui.cardBorder,
                  paddingHorizontal: scaleSpacing(spacing.normal),
                  paddingVertical: scaleSpacing(spacing.compact + 1),
                  marginBottom: showOverdueWarning && !completed ? scaleSpacing(spacing.compact + 2) : 0,
                  gap: scaleSpacing(spacing.compact),
                },
              ]}
            >
              <Ionicons name="time-outline" size={scaleFont(fontSizes.small + 2)} color={ui.textSecondary} />
              <Text
                style={[
                  styles.dateTimeText,
                  {
                    color: ui.textSecondary,
                    fontSize: scaleFont(fontSizes.medium),
                  },
                ]}
              >
                {timeLabel}
              </Text>
            </View>
          ) : null}

          {showOverdueWarning && !completed ? (
            <View
              style={[
                styles.metaRow,
                {
                  marginTop: hasTimeLabel ? 0 : scaleSpacing(spacing.compact),
                  gap: scaleSpacing(spacing.compact),
                  paddingRight: !isStackedLayout ? scaleSpacing(spacing.compact) : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.alertChip,
                  {
                    backgroundColor: ui.warningSurface,
                    borderColor: ui.cardBorder,
                    paddingHorizontal: scaleSpacing(spacing.normal),
                    paddingVertical: scaleSpacing(spacing.compact + 1),
                    gap: scaleSpacing(spacing.compact),
                  },
                ]}
              >
                <Ionicons name="time-outline" size={scaleFont(fontSizes.small + 1)} color={ui.warningText} />
                <Text style={[styles.alertChipText, { color: ui.warningText, fontSize: scaleFont(fontSizes.small + 1) }]}>
                  {overdueWarningText || 'Passou do horário.'}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {!isStackedLayout ? <View style={[styles.verticalDivider, { backgroundColor: ui.cardBorder }]} /> : null}

        <View
          style={[
            styles.actionsColumn,
            isStackedLayout && styles.actionsColumnLarge,
            isExtremeAccessibilityLayout && styles.actionsColumnExtreme,
            {
              width: isStackedLayout ? '100%' : actionRailWidth,
              backgroundColor: ui.screenBackground,
              padding: actionAreaPadding,
              gap: actionButtonsGap,
            },
          ]}
        >
          {!blockedPastTask ? (
            <TouchableOpacity
              style={[
                styles.completeButton,
                isStackedLayout && styles.completeButtonLarge,
                {
                  backgroundColor: ui.primaryButtonBackground,
                  borderColor: ui.primaryButtonBackground,
                  minHeight: completeButtonMinHeight,
                  paddingHorizontal: scaleSpacing(spacing.normal),
                  paddingVertical: scaleSpacing(spacing.compact + 1),
                  gap: scaleSpacing(spacing.compact),
                  shadowColor: '#000000',
                  shadowOpacity: completed ? 0 : 0.18,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: completed ? 0 : 2,
                },
                completed && {
                  backgroundColor: ui.successSurface,
                  borderColor: ui.successBorder,
                  borderWidth: 1,
                },
              ]}
              onPress={onComplete}
              accessibilityRole="button"
              accessibilityLabel={`Concluir tarefa ${title}`}
              disabled={!canComplete}
            >
              <Ionicons
                name={completed ? 'checkmark-circle' : 'checkmark'}
                size={scaleFont(fontSizes.small + 2)}
                color={canComplete ? ui.primaryButtonText : ui.textSecondary}
              />
              <Text
                numberOfLines={isExtremeAccessibilityLayout ? 2 : 1}
                style={[
                  styles.actionButtonText,
                  {
                    color: canComplete ? ui.primaryButtonText : ui.textSecondary,
                    fontSize: scaleFont(fontSizes.small + 1),
                    textAlign: 'center',
                  },
                ]}
              >
                {completed ? 'Concluído' : 'Concluir'}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[
              styles.deleteButton,
              isStackedLayout && styles.deleteButtonLarge,
              isExtremeAccessibilityLayout && styles.deleteButtonExtreme,
              {
                backgroundColor: ui.cardBackground,
                borderColor: ui.dangerBorder,
                minHeight: deleteButtonMinHeight,
                paddingHorizontal: scaleSpacing(spacing.normal),
              },
            ]}
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={`Excluir tarefa ${title}`}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.deleteButtonText,
                {
                  color: ui.dangerText,
                  fontSize: scaleFont(11),
                },
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
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardCompleted: {
    borderColor: '#B6DCC2',
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
    alignItems: 'flex-start',
  },
  contentRowLarge: {
    flexDirection: 'column',
  },
  infoColumn: {
    flex: 1,
    minWidth: 0,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusBadgeTopLeft: {
    alignSelf: 'flex-start',
  },
  statusDot: {
    borderRadius: 999,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dateTimeText: {
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    alignSelf: 'stretch',
    opacity: 0.7,
  },
  alertChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: '100%',
  },
  alertChipText: {
    fontWeight: '600',
    flexShrink: 1,
  },
  statusText: {
    fontWeight: '700',
  },
  actionsColumn: {
    borderRadius: 16,
    alignSelf: 'center',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  actionsColumnLarge: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsColumnExtreme: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  completeButton: {
    alignSelf: 'stretch',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonLarge: {
    flex: 1,
  },
  actionButtonText: {
    fontWeight: '700',
  },
  deleteButton: {
    alignSelf: 'stretch',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonLarge: {
    minWidth: 90,
  },
  deleteButtonExtreme: {
    minWidth: 0,
  },
  deleteButtonText: {
    fontWeight: '600',
  },
});
