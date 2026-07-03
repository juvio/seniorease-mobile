import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontSizes, spacing } from '../../../shared/constants/theme';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

interface SimpleCalendarPickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingSlots = firstDay.getDay();

  const grid: Array<Date | null> = [];

  for (let i = 0; i < leadingSlots; i += 1) {
    grid.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    grid.push(new Date(year, month, day));
  }

  while (grid.length % 7 !== 0) {
    grid.push(null);
  }

  return grid;
};

const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isPastDay = (date: Date) => startOfDay(date).getTime() < startOfDay(new Date()).getTime();

export const SimpleCalendarPicker: React.FC<SimpleCalendarPickerProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();
  const today = new Date();
  const initial = selectedDate || today;
  const [displayYear, setDisplayYear] = useState(initial.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(initial.getMonth());

  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const displayedMonthStart = new Date(displayYear, displayMonth, 1);
  const canGoToPreviousMonth = displayedMonthStart.getTime() > currentMonthStart.getTime();

  const days = useMemo(() => getMonthDays(displayYear, displayMonth), [displayYear, displayMonth]);

  const goToPreviousMonth = () => {
    if (!canGoToPreviousMonth) {
      return;
    }

    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear((prev) => prev - 1);
      return;
    }

    setDisplayMonth((prev) => prev - 1);
  };

  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear((prev) => prev + 1);
      return;
    }

    setDisplayMonth((prev) => prev + 1);
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
      <View style={[styles.header, { marginBottom: scaleSpacing(spacing.normal) }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: ui.chipBackground },
            !canGoToPreviousMonth && styles.navButtonDisabled,
          ]}
          onPress={goToPreviousMonth}
          disabled={!canGoToPreviousMonth}
          accessibilityRole="button"
          accessibilityLabel="Mês anterior"
        >
          <Text
            style={[
              styles.navButtonText,
              { color: ui.textPrimary, fontSize: scaleFont(fontSizes.medium) },
              !canGoToPreviousMonth && styles.navButtonTextDisabled,
            ]}
          >
            {'<'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.monthLabel, { fontSize: scaleFont(fontSizes.small + 2), color: ui.textPrimary }]}>
          {`${MONTH_NAMES[displayMonth]} ${displayYear}`}
        </Text>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: ui.chipBackground }]} onPress={goToNextMonth}>
          <Text style={[styles.navButtonText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.medium) }]}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.weekHeader, { marginBottom: scaleSpacing(spacing.compact) }]}>
        {WEEKDAYS.map((label, index) => (
          <Text key={`${label}-${index}`} style={[styles.weekday, { color: ui.textSecondary, fontSize: scaleFont(fontSizes.small) }]}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isPast = isPastDay(date);

          return (
            <TouchableOpacity
              key={`${date.toISOString()}-${index}`}
              style={[
                styles.dayCell,
                isPast && styles.dayCellDisabled,
                isSelected && !isPast && styles.dayCellSelected,
                isSelected && !isPast && { backgroundColor: ui.chipSelectedBackground },
              ]}
              onPress={() => onSelectDate(date)}
              disabled={isPast}
              accessibilityRole="button"
              accessibilityLabel={`${isPast ? 'Data indisponível' : 'Selecionar dia'} ${date.toLocaleDateString('pt-BR')}`}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small + 1) },
                  isPast && styles.dayTextDisabled,
                  isSelected && !isPast && styles.dayTextSelected,
                ]}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#EFF0F3',
  },
  navButtonText: {
    fontWeight: '700',
  },
  navButtonTextDisabled: {
    color: '#A1A1AA',
  },
  monthLabel: {
    fontWeight: '700',
  },
  weekHeader: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2857%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dayCellSelected: {
    backgroundColor: '#000000',
  },
  dayCellDisabled: {
    opacity: 0.45,
  },
  dayText: {
    fontWeight: '600',
  },
  dayTextDisabled: {
    color: '#A1A1AA',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
});
