import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

export const AppTopBar: React.FC = () => {
  const { scaleFont, scaleSpacing, fontScale, spacingScale, ui } = useAccessibilityTheme();
  const isAdaptiveTopBar = fontScale >= 1.25 || spacingScale >= 1.5;
  const brandFontSize = isAdaptiveTopBar ? scaleFont(fontSizes.large) : scaleFont(fontSizes.large + 1);
  const accentWidth = Math.min(scaleSpacing(spacing.extraSpacious * 3), 46);
  const accentHeight = Math.min(scaleSpacing(spacing.extraSpacious * 2 + 2), 34);
  const accentLargeSize = Math.min(scaleSpacing(spacing.extraSpacious * 2 + 6), 30);
  const accentSmallSize = Math.min(scaleSpacing(spacing.normal + 2), 10);

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
        <Text numberOfLines={1} style={[styles.brandText, { fontSize: brandFontSize }]}>SeniorEase</Text>

        <View style={[styles.accentCluster, { marginLeft: scaleSpacing(spacing.normal), width: accentWidth, height: accentHeight }]}> 
          <View
            style={[
              styles.accentLarge,
              {
                width: accentLargeSize,
                height: accentLargeSize,
                borderRadius: accentLargeSize / 2,
                right: 0,
                top: Math.max(0, Math.round((accentHeight - accentLargeSize) / 2)),
                backgroundColor: ui.topBarActionBackground,
              },
            ]}
          />
          <View
            style={[
              styles.accentSmall,
              {
                width: accentSmallSize,
                height: accentSmallSize,
                borderRadius: accentSmallSize / 2,
                left: Math.max(2, Math.round(accentWidth * 0.15)),
                bottom: Math.max(2, Math.round(accentHeight * 0.14)),
                backgroundColor: ui.chipSelectedBackground,
              },
            ]}
          />
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
    flex: 1,
    color: colors.background,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginRight: 8,
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
