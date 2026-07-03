import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

export const AppTopBar: React.FC = () => {
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();

  return (
    <View style={[styles.topBar, { marginBottom: scaleSpacing(spacing.compact + 2) }]}>
      <View
        style={[
          styles.brandContainer,
          {
            backgroundColor: ui.topBarBrandBackground,
            borderColor: ui.cardBorder,
            paddingHorizontal: scaleSpacing(spacing.normal + 2),
            paddingVertical: scaleSpacing(spacing.normal),
          },
        ]}
      >
        <Text style={[styles.brandText, { fontSize: scaleFont(fontSizes.large + 1) }]}>SeniorEase</Text>

        <View style={[styles.accentCluster, { marginLeft: scaleSpacing(spacing.normal) }]}>
          <View style={[styles.accentLarge, { backgroundColor: ui.topBarActionBackground }]} />
          <View style={[styles.accentSmall, { backgroundColor: ui.chipSelectedBackground }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
  },
  brandContainer: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  brandText: {
    color: colors.background,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  accentCluster: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 34,
    borderRadius: 999,
    position: 'relative',
  },
  accentLarge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    right: 0,
    top: 1,
  },
  accentSmall: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    left: 7,
    bottom: 5,
  },
});
