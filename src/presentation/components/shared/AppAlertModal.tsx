import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { fontSizes, spacing } from '../../../shared/constants/theme';
import {
  AppAlertAction,
  AppAlertActionStyle,
  useAlertStore,
} from '../../../shared/stores/alertStore';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

const getActionTone = (
  style: AppAlertActionStyle,
  primaryButtonBackground: string,
  primaryButtonText: string,
  dangerBorder: string,
  dangerText: string,
  cardBorder: string,
  chipBackground: string,
  textPrimary: string,
) => {
  if (style === 'destructive') {
    return {
      backgroundColor: chipBackground,
      borderColor: dangerBorder,
      textColor: dangerText,
    };
  }

  if (style === 'cancel') {
    return {
      backgroundColor: chipBackground,
      borderColor: cardBorder,
      textColor: textPrimary,
    };
  }

  return {
    backgroundColor: primaryButtonBackground,
    borderColor: primaryButtonBackground,
    textColor: primaryButtonText,
  };
};

export const AppAlertModal: React.FC = () => {
  const currentAlert = useAlertStore((state) => state.currentAlert);
  const closeAlert = useAlertStore((state) => state.closeAlert);
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();

  const actions = currentAlert?.actions || [];

  const handleActionPress = (action: AppAlertAction) => {
    closeAlert();
    if (action.onPress) {
      void Promise.resolve(action.onPress());
    }
  };

  return (
    <Modal
      visible={Boolean(currentAlert)}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={closeAlert}
    >
      <Pressable style={[styles.backdrop, { backgroundColor: ui.overlay }]} onPress={closeAlert}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          accessibilityRole="alert"
          style={[
            styles.container,
            {
              backgroundColor: ui.screenBackground,
              borderColor: ui.cardBorder,
              padding: scaleSpacing(spacing.spacious + 2),
            },
          ]}
        >
          <Text style={[styles.title, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.medium + 1) }]}>
            {currentAlert?.title}
          </Text>

          {currentAlert?.message ? (
            <Text
              style={[
                styles.message,
                {
                  color: ui.textSecondary,
                  fontSize: scaleFont(fontSizes.small + 1),
                  marginTop: scaleSpacing(spacing.compact + 2),
                },
              ]}
            >
              {currentAlert.message}
            </Text>
          ) : null}

          <View style={[styles.actionsRow, { marginTop: scaleSpacing(spacing.normal + 2), gap: scaleSpacing(spacing.compact + 2) }]}>
            {actions.map((action, index) => {
              const tone = getActionTone(
                action.style || 'default',
                ui.primaryButtonBackground,
                ui.primaryButtonText,
                ui.dangerBorder,
                ui.dangerText,
                ui.cardBorder,
                ui.chipBackground,
                ui.textPrimary,
              );

              return (
                <Pressable
                  key={`${action.text}-${index}`}
                  onPress={() => handleActionPress(action)}
                  accessibilityRole="button"
                  accessibilityLabel={`Acao do alerta: ${action.text}`}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: tone.backgroundColor,
                      borderColor: tone.borderColor,
                      minHeight: scaleSpacing(spacing.extraSpacious * 2),
                      paddingHorizontal: scaleSpacing(spacing.normal + 2),
                    },
                  ]}
                >
                  <Text style={[styles.actionText, { color: tone.textColor, fontSize: scaleFont(fontSizes.small + 1) }]}>
                    {action.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
  },
  title: {
    fontWeight: '700',
  },
  message: {
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontWeight: '700',
  },
});
