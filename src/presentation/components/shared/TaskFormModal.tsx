import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSizes, spacing } from '../../../shared/constants/theme';
import { SimpleCalendarPicker } from './SimpleCalendarPicker';
import { SimpleTimePicker } from './SimpleTimePicker';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

type FormStep = 'title' | 'dateTime' | 'recurrence';
type RecurrenceChoice = 'none' | 'weekly';

interface TaskFormModalProps {
  visible: boolean;
  isSimplifiedMode: boolean;
  formStep: FormStep;
  titleInput: string;
  dateInput: string;
  dueDate: Date | null;
  timeInput: string;
  isAnytime: boolean;
  recurrenceChoice: RecurrenceChoice;
  setTitleInput: (value: string) => void;
  onSelectDueDate: (date: Date) => void;
  setTimeInput: (value: string) => void;
  setIsAnytime: (value: boolean) => void;
  setRecurrenceChoice: (value: RecurrenceChoice) => void;
  onClose: () => void;
  onNextStep: () => void;
  onSave: () => void;
  onShowCustomRecurrenceInfo: () => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  isSimplifiedMode,
  formStep,
  titleInput,
  dateInput,
  dueDate,
  timeInput,
  isAnytime,
  recurrenceChoice,
  setTitleInput,
  onSelectDueDate,
  setTimeInput,
  setIsAnytime,
  setRecurrenceChoice,
  onClose,
  onNextStep,
  onSave,
  onShowCustomRecurrenceInfo,
}) => {
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();
  const submitLabel = formStep === 'recurrence' || (isSimplifiedMode && formStep === 'dateTime')
    ? 'Salvar'
    : 'Continuar';

  const handleAnytimeChange = (value: boolean) => {
    setIsAnytime(value);
    if (!value && !timeInput) {
      setTimeInput('08:00');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={[styles.overlay, { backgroundColor: ui.overlay }]} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardWrapper}
          behavior="padding"
        >
          <View style={styles.backdrop}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: ui.screenBackground,
                  borderColor: ui.cardBorder,
                  paddingHorizontal: scaleSpacing(spacing.spacious),
                  paddingTop: scaleSpacing(spacing.spacious),
                },
              ]}
            >
              <ScrollView
                style={styles.formContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                contentContainerStyle={{ paddingBottom: scaleSpacing(spacing.extraSpacious * 2) }}
              >
                  <Text
                    style={[
                      styles.formTitle,
                      {
                        fontSize: scaleFont(fontSizes.large),
                        color: ui.textPrimary,
                        marginBottom: scaleSpacing(spacing.normal),
                      },
                    ]}
                  >
                    Nova tarefa
                  </Text>

                  {formStep === 'title' ? (
                    <View>
                      <Text
                        style={[
                          styles.questionText,
                          {
                            fontSize: scaleFont(fontSizes.medium),
                            color: ui.textPrimary,
                            marginBottom: scaleSpacing(spacing.compact),
                          },
                        ]}
                      >
                        O que você precisa fazer?
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            borderColor: ui.cardBorder,
                            backgroundColor: colors.background,
                            paddingHorizontal: scaleSpacing(spacing.normal),
                            paddingVertical: scaleSpacing(spacing.normal),
                            fontSize: scaleFont(fontSizes.medium),
                            marginBottom: scaleSpacing(spacing.normal),
                            color: ui.textPrimary,
                          },
                        ]}
                        placeholder="Ex: Estudar para a prova"
                        placeholderTextColor={ui.textSecondary}
                        value={titleInput}
                        onChangeText={setTitleInput}
                        accessibilityLabel="Título da tarefa"
                      />
                    </View>
                  ) : null}

                  {formStep === 'dateTime' ? (
                    <View>
                      <Text
                        style={[
                          styles.questionText,
                          {
                            fontSize: scaleFont(fontSizes.medium),
                            color: ui.textPrimary,
                            marginBottom: scaleSpacing(spacing.compact),
                          },
                        ]}
                      >
                        {isSimplifiedMode ? 'Para qual dia é essa tarefa?' : 'Para quando é essa tarefa?'}
                      </Text>

                      <SimpleCalendarPicker selectedDate={dueDate} onSelectDate={onSelectDueDate} />

                      {dateInput ? (
                        <Text
                          style={[
                            styles.selectedDate,
                            {
                              color: ui.textPrimary,
                              fontSize: scaleFont(fontSizes.small + 1),
                              marginBottom: scaleSpacing(spacing.normal),
                            },
                          ]}
                        >
                          Data escolhida: {dateInput}
                        </Text>
                      ) : null}

                      <Text
                        style={[
                          styles.questionText,
                          {
                            fontSize: scaleFont(fontSizes.medium),
                            color: ui.textPrimary,
                            marginBottom: scaleSpacing(spacing.compact),
                          },
                        ]}
                      >
                        Qual horário?
                      </Text>
                      {!isAnytime ? (
                        <SimpleTimePicker
                          value={timeInput || '08:00'}
                          onChange={setTimeInput}
                        />
                      ) : null}

                      <View
                        style={[
                          styles.switchRow,
                          {
                            marginTop: scaleSpacing(spacing.compact),
                            marginBottom: scaleSpacing(spacing.normal),
                            gap: scaleSpacing(spacing.normal),
                          },
                        ]}
                      >
                        <Text style={[styles.switchText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small + 1) }]}>
                          A qualquer momento do dia
                        </Text>
                        <Switch value={isAnytime} onValueChange={handleAnytimeChange} />
                      </View>
                    </View>
                  ) : null}

                  {!isSimplifiedMode && formStep === 'recurrence' ? (
                    <View>
                      <Text
                        style={[
                          styles.questionText,
                          {
                            fontSize: scaleFont(fontSizes.medium),
                            color: ui.textPrimary,
                            marginBottom: scaleSpacing(spacing.compact),
                          },
                        ]}
                      >
                        Recorrência
                      </Text>
                      <View style={[styles.choiceRow, { gap: scaleSpacing(spacing.compact), marginBottom: scaleSpacing(spacing.normal) }]}>
                        <TouchableOpacity
                          style={[
                            styles.choiceButton,
                            {
                              backgroundColor: ui.chipBackground,
                              paddingHorizontal: scaleSpacing(spacing.normal),
                            },
                            recurrenceChoice === 'none' && styles.choiceButtonSelected,
                            recurrenceChoice === 'none' && { backgroundColor: ui.chipSelectedBackground },
                          ]}
                          onPress={() => setRecurrenceChoice('none')}
                        >
                          <Text
                            style={[
                              styles.choiceText,
                              { color: ui.chipText, fontSize: scaleFont(fontSizes.small + 1) },
                              recurrenceChoice === 'none' && styles.choiceTextSelected,
                              recurrenceChoice === 'none' && { color: ui.chipSelectedText },
                            ]}
                          >
                            Não
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.choiceButton,
                            {
                              backgroundColor: ui.chipBackground,
                              paddingHorizontal: scaleSpacing(spacing.normal),
                            },
                            recurrenceChoice === 'weekly' && styles.choiceButtonSelected,
                            recurrenceChoice === 'weekly' && { backgroundColor: ui.chipSelectedBackground },
                          ]}
                          onPress={() => setRecurrenceChoice('weekly')}
                        >
                          <Text
                            style={[
                              styles.choiceText,
                              { color: ui.chipText, fontSize: scaleFont(fontSizes.small + 1) },
                              recurrenceChoice === 'weekly' && styles.choiceTextSelected,
                              recurrenceChoice === 'weekly' && { color: ui.chipSelectedText },
                            ]}
                          >
                            Semanal
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.choiceButton, { backgroundColor: ui.chipBackground, paddingHorizontal: scaleSpacing(spacing.normal) }]}
                          onPress={onShowCustomRecurrenceInfo}
                        >
                          <Text style={[styles.choiceText, { color: ui.chipText, fontSize: scaleFont(fontSizes.small + 1) }]}>Personalizada</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}

              </ScrollView>

              <View
                style={[
                  styles.formFooter,
                  {
                    gap: scaleSpacing(spacing.normal),
                    paddingTop: scaleSpacing(spacing.compact),
                    paddingBottom: scaleSpacing(spacing.normal),
                    borderTopColor: ui.cardBorder,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: ui.chipBackground }]}
                  onPress={onClose}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
                      { color: ui.textPrimary, fontSize: scaleFont(fontSizes.medium) },
                    ]}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: ui.chipSelectedBackground }]}
                  onPress={formStep === 'recurrence' ? onSave : onNextStep}
                >
                  <Text style={[styles.saveButtonText, { color: ui.chipSelectedText, fontSize: scaleFont(fontSizes.medium) }]}>
                    {submitLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  keyboardWrapper: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    height: '94%',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  formContent: {
    flex: 1,
  },
  formTitle: {
    fontWeight: '700',
  },
  questionText: {
    fontWeight: '700',
  },
  selectedDate: {
  },
  input: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchText: {
    flex: 1,
    fontWeight: '600',
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choiceButton: {
    minHeight: 40,
    borderRadius: 999,
    justifyContent: 'center',
  },
  choiceButtonSelected: {
    backgroundColor: '#4A67F0',
  },
  choiceText: {
    fontWeight: '700',
  },
  choiceTextSelected: {
    color: '#FFFFFF',
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D8DADF',
  },
  cancelButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontWeight: '700',
  },
});
