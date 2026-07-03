import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontSizes, spacing } from '../../../shared/constants/theme';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

interface SimpleTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const pad = (value: number) => value.toString().padStart(2, '0');

const parseTime = (value: string) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return { hours: 8, minutes: 0 };
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return { hours: 8, minutes: 0 };
  }

  return {
    hours: Math.min(23, Math.max(0, hours)),
    minutes: Math.min(59, Math.max(0, minutes)),
  };
};

export const SimpleTimePicker: React.FC<SimpleTimePickerProps> = ({ value, onChange }) => {
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();
  const { hours, minutes } = useMemo(() => parseTime(value), [value]);

  const apply = (nextHours: number, nextMinutes: number) => {
    onChange(`${pad(nextHours)}:${pad(nextMinutes)}`);
  };

  const incrementHour = (delta: number) => {
    const next = (hours + delta + 24) % 24;
    apply(next, minutes);
  };

  const incrementMinute = (delta: number) => {
    const next = (minutes + delta + 60) % 60;
    apply(hours, next);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: ui.cardBorder,
          backgroundColor: ui.cardBackground,
          padding: scaleSpacing(spacing.normal),
          marginBottom: scaleSpacing(spacing.normal),
        },
      ]}
    >
      <View style={[styles.controlsRow, { gap: scaleSpacing(spacing.normal) }]}>
        <View style={[styles.controlGroup, { gap: scaleSpacing(spacing.compact) }]}>
          <Text style={[styles.controlLabel, { color: ui.textSecondary, fontSize: scaleFont(fontSizes.small) }]}>Hora</Text>
          <View style={[styles.fieldBox, { borderColor: ui.cardBorder, backgroundColor: ui.cardBackground, paddingVertical: scaleSpacing(spacing.compact) }]}>
            <TouchableOpacity
              style={[styles.adjustButton, { backgroundColor: ui.chipBackground, paddingHorizontal: scaleSpacing(spacing.normal) }]}
              onPress={() => incrementHour(1)}
              accessibilityRole="button"
              accessibilityLabel="Aumentar hora"
            >
              <Text style={[styles.adjustButtonText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small + 1) }]}>+</Text>
            </TouchableOpacity>
            <Text style={[styles.fieldValue, { marginVertical: scaleSpacing(spacing.compact), color: ui.textPrimary, fontSize: scaleFont(fontSizes.large) }]}>
              {pad(hours)}
            </Text>
            <TouchableOpacity
              style={[styles.adjustButton, { backgroundColor: ui.chipBackground, paddingHorizontal: scaleSpacing(spacing.normal) }]}
              onPress={() => incrementHour(-1)}
              accessibilityRole="button"
              accessibilityLabel="Diminuir hora"
            >
              <Text style={[styles.adjustButtonText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small + 1) }]}>-</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.controlGroup, { gap: scaleSpacing(spacing.compact) }]}>
          <Text style={[styles.controlLabel, { color: ui.textSecondary, fontSize: scaleFont(fontSizes.small) }]}>Minuto</Text>
          <View style={[styles.fieldBox, { borderColor: ui.cardBorder, backgroundColor: ui.cardBackground, paddingVertical: scaleSpacing(spacing.compact) }]}>
            <TouchableOpacity
              style={[styles.adjustButton, { backgroundColor: ui.chipBackground, paddingHorizontal: scaleSpacing(spacing.normal) }]}
              onPress={() => incrementMinute(1)}
              accessibilityRole="button"
              accessibilityLabel="Aumentar minuto"
            >
              <Text style={[styles.adjustButtonText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small + 1) }]}>+</Text>
            </TouchableOpacity>
            <Text style={[styles.fieldValue, { marginVertical: scaleSpacing(spacing.compact), color: ui.textPrimary, fontSize: scaleFont(fontSizes.large) }]}>
              {pad(minutes)}
            </Text>
            <TouchableOpacity
              style={[styles.adjustButton, { backgroundColor: ui.chipBackground, paddingHorizontal: scaleSpacing(spacing.normal) }]}
              onPress={() => incrementMinute(-1)}
              accessibilityRole="button"
              accessibilityLabel="Diminuir minuto"
            >
              <Text style={[styles.adjustButtonText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small + 1) }]}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlGroup: {
    flex: 1,
  },
  controlLabel: {
    fontWeight: '700',
    textAlign: 'center',
  },
  fieldBox: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  adjustButton: {
    minHeight: 34,
    minWidth: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    fontWeight: '700',
  },
  fieldValue: {
    fontWeight: '700',
  },
});