import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { fontSizes, spacing, colors } from '../../shared/constants/theme';
import { useSettingsStore } from '../../shared/stores/settingsStore';

interface PersonalizationScreenProps {
  onSave?: () => void;
}

export const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({ onSave }) => {
  const { settings, updateAccessibilitySettings } = useSettingsStore();

  const fontSizeOptions = ['small', 'medium', 'large', 'extra-large'];
  const contrastOptions = ['normal', 'high', 'maximum'];
  const spacingOptions = ['compact', 'normal', 'spacious', 'extra-spacious'];

  if (!settings) {
    return (
      <View style={styles.container}>
        <Text>Carregando configurações...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Personalizar Experiência</Text>

      {/* Tamanho da Fonte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tamanho da Fonte</Text>
        <View style={styles.optionsContainer}>
          {fontSizeOptions.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.option,
                settings.accessibility.fontSize === size && styles.optionSelected,
              ]}
              onPress={() => updateAccessibilitySettings({ fontSize: size as any })}
              accessibilityRole="radio"
              accessibilityState={{ selected: settings.accessibility.fontSize === size }}
              accessibilityLabel={`Font size ${size}`}
            >
              <Text style={styles.optionText}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Contraste */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nível de Contraste</Text>
        <View style={styles.optionsContainer}>
          {contrastOptions.map((contrast) => (
            <TouchableOpacity
              key={contrast}
              style={[
                styles.option,
                settings.accessibility.contrast === contrast && styles.optionSelected,
              ]}
              onPress={() => updateAccessibilitySettings({ contrast: contrast as any })}
              accessibilityRole="radio"
              accessibilityState={{ selected: settings.accessibility.contrast === contrast }}
              accessibilityLabel={`Contrast ${contrast}`}
            >
              <Text style={styles.optionText}>{contrast}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Espaçamento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Espaçamento entre Elementos</Text>
        <View style={styles.optionsContainer}>
          {spacingOptions.map((space) => (
            <TouchableOpacity
              key={space}
              style={[
                styles.option,
                settings.accessibility.spacing === space && styles.optionSelected,
              ]}
              onPress={() => updateAccessibilitySettings({ spacing: space as any })}
              accessibilityRole="radio"
              accessibilityState={{ selected: settings.accessibility.spacing === space }}
              accessibilityLabel={`Spacing ${space}`}
            >
              <Text style={styles.optionText}>{space}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modo Básico/Avançado */}
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.sectionTitle}>Modo Simplificado</Text>
          <Switch
            value={settings.accessibility.interfaceMode === 'basic'}
            onValueChange={(value) =>
              updateAccessibilitySettings({ interfaceMode: value ? 'basic' : 'advanced' })
            }
            accessibilityLabel="Toggle simplified mode"
          />
        </View>
      </View>

      {/* Feedback Reforçado */}
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.sectionTitle}>Feedback Visual Reforçado</Text>
          <Switch
            value={settings.accessibility.reinforcedFeedback}
            onValueChange={(value) =>
              updateAccessibilitySettings({ reinforcedFeedback: value })
            }
            accessibilityLabel="Toggle reinforced feedback"
          />
        </View>
      </View>

      {/* Confirmação de Ações Críticas */}
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.sectionTitle}>Confirmação antes de Ações Importantes</Text>
          <Switch
            value={settings.accessibility.confirmCriticalActions}
            onValueChange={(value) =>
              updateAccessibilitySettings({ confirmCriticalActions: value })
            }
            accessibilityLabel="Toggle critical action confirmation"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          Alert.alert('Sucesso', 'Configurações salvas!');
          onSave?.();
        }}
        accessibilityRole="button"
        accessibilityLabel="Save settings button"
      >
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.normal,
    paddingTop: spacing.normal,
  },
  title: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.spacious,
  },
  section: {
    marginBottom: spacing.spacious,
  },
  sectionTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.normal,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.normal,
  },
  option: {
    paddingHorizontal: spacing.normal,
    paddingVertical: spacing.normal,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: fontSizes.medium,
    color: (styles.optionSelected as any).backgroundColor ? colors.background : colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.normal,
  },
  saveButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.spacious,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: spacing.spacious,
    minHeight: 48,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
});
