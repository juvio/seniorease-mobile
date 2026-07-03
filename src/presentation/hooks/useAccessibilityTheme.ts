import { useMemo } from 'react';
import { AccessibilitySettings } from '../../domain/entities/Settings';
import { useSettingsStore } from '../../shared/stores/settingsStore';

export const FONT_SCALE_BY_SIZE: Record<AccessibilitySettings['fontSize'], number> = {
  small: 0.85,
  medium: 1,
  large: 1.25,
  'extra-large': 1.5,
};

export const SPACING_SCALE_BY_SIZE: Record<AccessibilitySettings['spacing'], number> = {
  compact: 0.5,
  normal: 1,
  spacious: 1.5,
  'extra-spacious': 2,
};

type UiTokens = {
  screenBackground: string;
  cardBackground: string;
  cardBorder: string;
  chipBackground: string;
  chipSelectedBackground: string;
  chipText: string;
  chipSelectedText: string;
  textPrimary: string;
  textSecondary: string;
  primaryButtonBackground: string;
  primaryButtonText: string;
  warningSurface: string;
  warningText: string;
  successSurface: string;
  successBorder: string;
  dangerSurface: string;
  dangerBorder: string;
  dangerText: string;
  topBarBrandBackground: string;
  topBarActionBackground: string;
  topBarActionText: string;
  overlay: string;
};

export const CONTRAST_UI_TOKENS: Record<AccessibilitySettings['contrast'], UiTokens> = {
  normal: {
    screenBackground: '#F3F4F7',
    cardBackground: '#ECEDEF',
    cardBorder: '#D8DADF',
    chipBackground: '#E3E4E8',
    chipSelectedBackground: '#4A67F0',
    chipText: '#2B2B2E',
    chipSelectedText: '#FFFFFF',
    textPrimary: '#2B2B2E',
    textSecondary: '#63636B',
    primaryButtonBackground: '#1E2028',
    primaryButtonText: '#FFFFFF',
    warningSurface: '#FFF3D9',
    warningText: '#9A3412',
    successSurface: '#DDF7E7',
    successBorder: '#34C759',
    dangerSurface: '#FFF2F0',
    dangerBorder: '#F59E8B',
    dangerText: '#A31D0F',
    topBarBrandBackground: '#181A22',
    topBarActionBackground: '#FFD93D',
    topBarActionText: '#181A22',
    overlay: 'rgba(0,0,0,0.35)',
  },
  high: {
    screenBackground: '#FFFFFF',
    cardBackground: '#F7F7FA',
    cardBorder: '#4A4A4A',
    chipBackground: '#E7E8EF',
    chipSelectedBackground: '#2F4CC9',
    chipText: '#151515',
    chipSelectedText: '#FFFFFF',
    textPrimary: '#111111',
    textSecondary: '#2D2D2D',
    primaryButtonBackground: '#101218',
    primaryButtonText: '#FFFFFF',
    warningSurface: '#FFF4CC',
    warningText: '#7C2D12',
    successSurface: '#E3F8EA',
    successBorder: '#1E8E3E',
    dangerSurface: '#FEE7E4',
    dangerBorder: '#B42318',
    dangerText: '#7A1C15',
    topBarBrandBackground: '#101218',
    topBarActionBackground: '#F6C90E',
    topBarActionText: '#111111',
    overlay: 'rgba(0,0,0,0.45)',
  },
  maximum: {
    screenBackground: '#FFFFFF',
    cardBackground: '#FFFFFF',
    cardBorder: '#000000',
    chipBackground: '#FFFFFF',
    chipSelectedBackground: '#000000',
    chipText: '#000000',
    chipSelectedText: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#111111',
    primaryButtonBackground: '#000000',
    primaryButtonText: '#FFFFFF',
    warningSurface: '#FFF7B2',
    warningText: '#000000',
    successSurface: '#D9FBE1',
    successBorder: '#0B6E2B',
    dangerSurface: '#FFE3E0',
    dangerBorder: '#8A0000',
    dangerText: '#000000',
    topBarBrandBackground: '#000000',
    topBarActionBackground: '#FFD400',
    topBarActionText: '#000000',
    overlay: 'rgba(0,0,0,0.55)',
  },
};

export const useAccessibilityTheme = () => {
  const accessibility = useSettingsStore((state) => state.settings?.accessibility);

  const fontSize = accessibility?.fontSize || 'medium';
  const spacing = accessibility?.spacing || 'normal';
  const contrast = accessibility?.contrast || 'normal';

  const fontScale = FONT_SCALE_BY_SIZE[fontSize];
  const spacingScale = SPACING_SCALE_BY_SIZE[spacing];
  const ui = CONTRAST_UI_TOKENS[contrast];

  const helpers = useMemo(
    () => ({
      scaleFont: (baseSize: number) => Math.round(baseSize * fontScale),
      scaleSpacing: (baseSpacing: number) => Math.max(2, Math.round(baseSpacing * spacingScale)),
    }),
    [fontScale, spacingScale],
  );

  return {
    fontSize,
    spacing,
    contrast,
    fontScale,
    spacingScale,
    ui,
    ...helpers,
  };
};
