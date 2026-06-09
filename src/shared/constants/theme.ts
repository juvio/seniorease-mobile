export const fontSizes = {
  small: 12,
  medium: 16,
  large: 20,
  extraLarge: 24,
};

export const spacing = {
  compact: 4,
  normal: 8,
  spacious: 12,
  extraSpacious: 16,
};

export const colors = {
  primary: '#007AFF',
  secondary: '#5AC8FA',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

export const contrastColors = {
  normal: colors,
  high: {
    ...colors,
    text: '#000000',
    background: '#FFFFFF',
    border: '#000000',
  },
  maximum: {
    ...colors,
    text: '#000000',
    background: '#FFFFFF',
    border: '#000000',
    primary: '#0000CC',
  },
};
