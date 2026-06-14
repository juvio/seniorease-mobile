import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';

interface AppTopBarProps {
  actionLabel?: string;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({ actionLabel = 'Menu' }) => {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandChip}>
        <Text style={styles.brandText}>SeniorEase</Text>
      </View>
      <View style={styles.menuChip}>
        <Text style={styles.menuText}>{actionLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.spacious,
  },
  brandChip: {
    backgroundColor: '#181A22',
    borderRadius: 12,
    paddingHorizontal: spacing.spacious,
    paddingVertical: spacing.normal,
  },
  brandText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: '700',
  },
  menuChip: {
    backgroundColor: '#FFD93D',
    borderRadius: 999,
    paddingHorizontal: spacing.spacious,
    paddingVertical: spacing.compact + 2,
  },
  menuText: {
    color: '#181A22',
    fontSize: fontSizes.small,
    fontWeight: '700',
  },
});
