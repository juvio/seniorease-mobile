import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { AccessibilitySettings } from '../../domain/entities/Settings';
import { useSettings } from './useSettings';

interface PersonalizationScreenHookParams {
  onSave?: () => void;
}

type Option<T> = {
  value: T;
  label: string;
};

const fontSizeOptions: Option<AccessibilitySettings['fontSize']>[] = [
  { value: 'small', label: 'Pequena' },
  { value: 'medium', label: 'Media' },
  { value: 'large', label: 'Grande' },
  { value: 'extra-large', label: 'Extra' },
];

const contrastOptions: Option<AccessibilitySettings['contrast']>[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'Confortavel' },
  { value: 'maximum', label: 'Alto' },
];

const spacingOptions: Option<AccessibilitySettings['spacing']>[] = [
  { value: 'compact', label: 'Compacto' },
  { value: 'normal', label: 'Confortavel' },
  { value: 'spacious', label: 'Amplo' },
  { value: 'extra-spacious', label: 'Extra' },
];

export const usePersonalizationScreen = ({ onSave }: PersonalizationScreenHookParams) => {
  const { settings, loading, loadSettings, updateSettings, updateAccessibilitySettings } = useSettings();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveSettings = useCallback(async () => {
    if (!settings) return;

    try {
      await updateSettings(settings.accessibility);
      Alert.alert('Sucesso', 'Configuracoes salvas!');
      onSave?.();
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel salvar as configuracoes');
    }
  }, [onSave, settings, updateSettings]);

  const handleInterfaceModeToggle = useCallback(
    (value: boolean) => {
      updateAccessibilitySettings({ interfaceMode: value ? 'basic' : 'advanced' });
    },
    [updateAccessibilitySettings]
  );

  const handleReinforcedFeedbackToggle = useCallback(
    (value: boolean) => {
      updateAccessibilitySettings({ reinforcedFeedback: value });
    },
    [updateAccessibilitySettings]
  );

  const handleConfirmCriticalActionsToggle = useCallback(
    (value: boolean) => {
      updateAccessibilitySettings({ confirmCriticalActions: value });
    },
    [updateAccessibilitySettings]
  );

  return {
    isLoading: loading || !settings,
    accessibility: settings?.accessibility,
    fontSizeOptions,
    contrastOptions,
    spacingOptions,
    onFontSizeChange: (fontSize: AccessibilitySettings['fontSize']) =>
      updateAccessibilitySettings({ fontSize }),
    onContrastChange: (contrast: AccessibilitySettings['contrast']) =>
      updateAccessibilitySettings({ contrast }),
    onSpacingChange: (spacing: AccessibilitySettings['spacing']) =>
      updateAccessibilitySettings({ spacing }),
    onInterfaceModeToggle: handleInterfaceModeToggle,
    onReinforcedFeedbackToggle: handleReinforcedFeedbackToggle,
    onConfirmCriticalActionsToggle: handleConfirmCriticalActionsToggle,
    onSave: handleSaveSettings,
  };
};
