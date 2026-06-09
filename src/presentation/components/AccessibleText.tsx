import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { fontSizes } from '../../shared/constants/theme';
import { useSettingsStore } from '../../shared/stores/settingsStore';

interface AccessibleTextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'small';
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  variant = 'body',
  style,
  ...props
}) => {
  const { settings } = useSettingsStore();

  const getSizeMultiplier = () => {
    switch (settings?.accessibility.fontSize) {
      case 'small':
        return 0.85;
      case 'large':
        return 1.25;
      case 'extra-large':
        return 1.5;
      case 'medium':
      default:
        return 1;
    }
  };

  const getBaseSize = () => {
    switch (variant) {
      case 'title':
        return fontSizes.large;
      case 'subtitle':
        return fontSizes.medium;
      case 'small':
        return fontSizes.medium - 4;
      case 'body':
      default:
        return fontSizes.medium;
    }
  };

  const multiplier = getSizeMultiplier();
  const baseSize = getBaseSize();
  const finalSize = Math.round(baseSize * multiplier);

  return (
    <RNText
      {...props}
      style={[{ fontSize: finalSize }, style]}
      allowFontScaling={false}
    />
  );
};
