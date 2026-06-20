import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';
import { Task } from '../../../domain/entities/Task';
import { TaskActivityCard } from './TaskActivityCard';
import { AppTopBar } from '../shared/AppTopBar';
import { screenScaffoldStyles } from '../shared/screenScaffoldStyles';
import { KeyboardAwareFormContainer } from '../shared/KeyboardAwareFormContainer';

interface TaskActivityItem {
  id: string;
  title: string;
  reminderText: string;
  statusLabel: string;
  actionLabel: string;
  statusTone: 'warning' | 'neutral' | 'success';
  sourceTask: Task;
}

interface TasksViewProps {
  isLoading: boolean;
  activityItems: TaskActivityItem[];
  showForm: boolean;
  newTaskTitle: string;
  newTaskDescription: string;
  setShowForm: (value: boolean) => void;
  setNewTaskTitle: (value: string) => void;
  setNewTaskDescription: (value: string) => void;
  onAddTask: () => void;
  onPrimaryAction: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  isLoading,
  activityItems,
  showForm,
  newTaskTitle,
  newTaskDescription,
  setShowForm,
  setNewTaskTitle,
  setNewTaskDescription,
  onAddTask,
  onPrimaryAction,
}) => {
  if (isLoading) {
    return (
      <SafeAreaView style={screenScaffoldStyles.container} edges={['top', 'bottom']}>
        <View style={screenScaffoldStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando atividades...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAwareFormContainer
      contentContainerStyle={screenScaffoldStyles.contentContainer}
      scrollEnabledWithKeyboardOnly={false}
    >
      <AppTopBar actionLabel="Menu" />

      <Text style={styles.title}>Atividades de hoje</Text>
      <Text style={styles.subtitle}>
        Lista simples com lembretes, status e uma ação principal por atividade.
      </Text>

      <View style={styles.listContainer}>
        {activityItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Sem atividades por enquanto</Text>
            <Text style={styles.emptyStateDescription}>
              Toque em "Nova atividade" para começar.
            </Text>
          </View>
        ) : (
          activityItems.map((item) => (
            <TaskActivityCard
              key={item.id}
              title={item.title}
              reminderText={item.reminderText}
              statusLabel={item.statusLabel}
              actionLabel={item.actionLabel}
              statusTone={item.statusTone}
              onPrimaryAction={() => onPrimaryAction(item.sourceTask)}
            />
          ))
        )}
      </View>

      {!showForm && (
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setShowForm(true)}
          accessibilityRole="button"
          accessibilityLabel="Criar nova atividade"
        >
          <Text style={styles.newButtonText}>+ Nova atividade</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nova atividade</Text>
          <TextInput
            style={styles.input}
            placeholder="Título da atividade"
            placeholderTextColor={colors.textSecondary}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            accessibilityLabel="Título da atividade"
          />
          <TextInput
            style={[styles.input, styles.inputDescription]}
            placeholder="Descrição (opcional)"
            placeholderTextColor={colors.textSecondary}
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            multiline
            accessibilityLabel="Descrição da atividade"
          />

          <View style={styles.formFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowForm(false);
                setNewTaskTitle('');
                setNewTaskDescription('');
              }}
              accessibilityRole="button"
              accessibilityLabel="Cancelar criação de atividade"
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={onAddTask}
              accessibilityRole="button"
              accessibilityLabel="Salvar atividade"
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAwareFormContainer>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    marginTop: spacing.normal,
    fontSize: fontSizes.medium,
    color: colors.textSecondary,
  },
  title: {
    fontSize: fontSizes.extraLarge + 2,
    color: '#1E1B4B',
    fontWeight: '700',
    marginBottom: spacing.normal,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: '#63636B',
    marginBottom: spacing.spacious,
  },
  listContainer: {
    backgroundColor: '#ECEDEF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DADF',
    padding: spacing.normal,
    marginBottom: spacing.spacious,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.extraSpacious * 2,
  },
  emptyStateTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.compact,
  },
  emptyStateDescription: {
    fontSize: fontSizes.small + 1,
    color: colors.textSecondary,
  },
  newButton: {
    backgroundColor: '#1E2028',
    minHeight: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newButtonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: '700',
  },
  formCard: {
    marginTop: spacing.normal,
    backgroundColor: '#ECEDEF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DADF',
    padding: spacing.spacious,
  },
  formTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.normal,
  },
  input: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFD1D7',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.normal,
    paddingVertical: spacing.normal,
    fontSize: fontSizes.medium,
    marginBottom: spacing.normal,
    color: colors.text,
  },
  inputDescription: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#DADCE2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.normal,
  },
  cancelButtonText: {
    color: '#2E3036',
    fontSize: fontSizes.medium,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#4A67F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: '700',
  },
});
