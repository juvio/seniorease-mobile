import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontSizes, spacing } from '../../../shared/constants/theme';

type FeedbackToastType = 'success' | 'error' | 'warning';

interface FeedbackToastProps {
  visible: boolean;
  type: FeedbackToastType;
  message: string;
  onClose: () => void;
  autoHideMs?: number;
}

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
}) => {
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
    <View style={[styles.container, getContainerStyleByType(type)]} accessibilityRole="alert">
      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar mensagem"
      >
        <Text style={styles.closeText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.spacious,
    paddingVertical: spacing.normal,
    marginBottom: spacing.spacious,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.normal,
  },
  message: {
    flex: 1,
    fontSize: fontSizes.small + 1,
    fontWeight: '600',
    color: '#101218',
  },
  closeText: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: '#101218',
  },
  success: {
    backgroundColor: '#DDF7E7',
    borderColor: colors.success,
  },
  warning: {
    backgroundColor: '#FFF3D9',
    borderColor: colors.warning,
  },
  error: {
    backgroundColor: '#FDE3E1',
    borderColor: colors.error,
  },
});
