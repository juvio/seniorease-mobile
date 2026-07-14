import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontSizes, spacing } from '../../../shared/constants/theme';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

type FeedbackToastType = 'success' | 'error' | 'warning';

interface FeedbackToastProps {
  visible: boolean;
  type: FeedbackToastType;
  message: string;
  onClose: () => void;
  autoHideMs?: number;
  reinforced?: boolean;
}

const FEEDBACK_TYPE_LABEL: Record<FeedbackToastType, string> = {
  success: 'Sucesso',
  warning: 'Aviso',
  error: 'Erro',
};

const getContainerStyleByType = (type: FeedbackToastType) => {
  if (type === 'success') {
    return styles.success;
  }

  if (type === 'warning') {
    return styles.warning;
  }

  return styles.error;
};

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  visible,
  type,
  message,
  onClose,
  autoHideMs,
  reinforced = false,
}) => {
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();

  React.useEffect(() => {
    if (!visible || !autoHideMs) {
      return undefined;
    }

    const timer = setTimeout(() => {
      onClose();
    }, autoHideMs);

    return () => {
      clearTimeout(timer);
    };
  }, [autoHideMs, onClose, visible]);

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: scaleSpacing(spacing.spacious),
          paddingVertical: scaleSpacing(spacing.normal),
          marginBottom: scaleSpacing(spacing.spacious),
          gap: scaleSpacing(spacing.normal),
        },
        getContainerStyleByType(type),
        type === 'success' && { backgroundColor: ui.successSurface, borderColor: ui.successBorder },
        type === 'warning' && { backgroundColor: ui.warningSurface, borderColor: ui.warningText },
        type === 'error' && { backgroundColor: ui.dangerSurface, borderColor: ui.dangerBorder },
        reinforced && styles.reinforcedContainer,
      ]}
      accessibilityRole="alert"
    >
      <View style={styles.messageContainer}>
        {reinforced ? (
          <Text style={[styles.badgeText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small) }]}>
            {FEEDBACK_TYPE_LABEL[type]}
          </Text>
        ) : null}
        <Text style={[styles.message, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small + 1) }]}>{message}</Text>
      </View>

      <TouchableOpacity
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar mensagem"
      >
        <Text style={[styles.closeText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small) }]}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontWeight: '600',
  },
  messageContainer: {
    flex: 1,
  },
  badgeText: {
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  reinforcedContainer: {
    borderWidth: 2,
  },
  closeText: {
    fontWeight: '700',
  },
  success: {
    backgroundColor: '#DDF7E7',
    borderColor: '#34C759',
  },
  warning: {
    backgroundColor: '#FFF3D9',
    borderColor: '#FF9500',
  },
  error: {
    backgroundColor: '#FDE3E1',
    borderColor: '#FF3B30',
  },
});
