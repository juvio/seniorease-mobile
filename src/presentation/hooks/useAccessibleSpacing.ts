import { useSettingsStore } from '../../shared/stores/settingsStore';
import { spacing } from '../../shared/constants/theme';

export const useAccessibleSpacing = () => {
  const { settings } = useSettingsStore();

  const getSpacing = (multiplier: number = 1) => {
    const baseSpacing = spacing.normal;
    const spacingMultiplier = {
      compact: 0.5,
      normal: 1,
      spacious: 1.5,
      'extra-spacious': 2,
    }[settings?.accessibility.spacing || 'normal'] || 1;

    return Math.round(baseSpacing * spacingMultiplier * multiplier);
  };

  return { getSpacing };
};
