import { useCallback, useEffect, useState } from 'react';
import { AccessibilitySettings } from '../../domain/entities/Settings';
import { useSettings } from './useSettings';
import { useAuth } from './useAuth';
import { showAppAlert } from '../../shared/stores/alertStore';

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
  const { user, logout } = useAuth();
  const [toast, setToast] = useState<{
    visible: boolean;
    type: 'success' | 'warning' | 'error';
    message: string;
  }>({ visible: false, type: 'success', message: '' });

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveSettings = useCallback(async () => {
    if (!settings) return;

    try {
      await updateSettings(settings.accessibility);
      setToast({ visible: true, type: 'success', message: 'Configuracoes salvas!' });
      onSave?.();
    } catch (error) {
      setToast({ visible: true, type: 'error', message: 'Nao foi possivel salvar as configuracoes' });
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

  const handleLogout = useCallback(() => {
    showAppAlert({
      title: 'Sair da conta',
      message: 'Tem certeza que deseja sair?',
      actions: [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (_error) {
              showAppAlert({ title: 'Erro', message: 'Nao foi possivel fazer logout' });
            }
          },
        },
      ],
    });
  }, [logout]);

  return {
    isLoading: loading || !settings,
    displayName: user?.displayName || '',
    email: user?.email || '',
    initial: user?.displayName?.[0]?.toUpperCase() || 'U',
    memberSince: user?.createdAt
      ? (user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt)).toLocaleDateString('pt-BR')
      : '-',
    accessibility: settings?.accessibility,
    fontSizeOptions,
    contrastOptions,
    spacingOptions,
    toast,
    setToast,
    onFontSizeChange: (fontSize: AccessibilitySettings['fontSize']) =>
      updateAccessibilitySettings({ fontSize }),
    onContrastChange: (contrast: AccessibilitySettings['contrast']) =>
      updateAccessibilitySettings({ contrast }),
    onSpacingChange: (spacing: AccessibilitySettings['spacing']) =>
      updateAccessibilitySettings({ spacing }),
    onInterfaceModeToggle: handleInterfaceModeToggle,
    onReinforcedFeedbackToggle: handleReinforcedFeedbackToggle,
    onConfirmCriticalActionsToggle: handleConfirmCriticalActionsToggle,
    onLogoutPress: handleLogout,
    onSave: handleSaveSettings,
  };
};
