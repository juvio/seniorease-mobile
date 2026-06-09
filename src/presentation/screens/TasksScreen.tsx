import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { fontSizes, spacing, colors } from '../../shared/constants/theme';
import { useTasksStore } from '../../shared/stores/tasksStore';
import { Task } from '../../domain/entities/Task';

export const TasksScreen: React.FC = () => {
  const { tasks, addTask, updateTask } = useTasksStore();
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Aviso', 'Digite um título para a tarefa');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      userId: '', // Would be set from auth store
      title: newTaskTitle,
      description: newTaskDescription,
      steps: [],
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addTask(newTask);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowForm(false);
    Alert.alert('Sucesso', 'Tarefa criada!');
  };

  const handleToggleTask = (task: Task) => {
    updateTask({
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date() : undefined,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhuma tarefa adicionada</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.taskItem, item.completed && styles.taskItemCompleted]}
              onPress={() => handleToggleTask(item)}
              accessible
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.completed }}
              accessibilityLabel={item.title}
            >
              <View style={styles.taskCheckbox}>
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.taskContent}>
                <Text
                  style={[
                    styles.taskTitle,
                    item.completed && styles.taskTitleCompleted,
                  ]}
                >
                  {item.title}
                </Text>
                {item.description && (
                  <Text style={styles.taskDescription}>{item.description}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          style={styles.tasksList}
        />
      )}

      {!showForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Add new task button"
          accessibilityHint="Double tap to add a new task"
        >
          <Text style={styles.addButtonText}>+ Adicionar Tarefa</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Título da tarefa"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel="Task title input"
          />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Descrição (opcional)"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            multiline
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel="Task description input"
          />

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowForm(false);
                setNewTaskTitle('');
                setNewTaskDescription('');
              }}
              accessible
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddTask}
              accessible
              accessibilityRole="button"
            >
              <Text style={styles.submitButtonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.normal,
  },
  title: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.normal,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: fontSizes.medium,
    color: colors.textSecondary,
  },
  tasksList: {
    flex: 1,
    marginBottom: spacing.normal,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.normal,
    paddingVertical: spacing.spacious,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: spacing.normal,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  taskItemCompleted: {
    borderLeftColor: colors.success,
    opacity: 0.7,
  },
  taskCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.normal,
  },
  checkmark: {
    color: colors.primary,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: colors.text,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  taskDescription: {
    fontSize: fontSizes.medium - 2,
    color: colors.textSecondary,
    marginTop: spacing.normal / 2,
  },
  addButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.spacious,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.normal,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.normal,
    paddingVertical: spacing.normal,
    fontSize: fontSizes.medium,
    marginBottom: spacing.normal,
    minHeight: 48,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: spacing.normal,
    marginTop: spacing.normal,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.border,
    paddingVertical: spacing.normal,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: fontSizes.medium,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.normal,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: colors.background,
    fontSize: fontSizes.medium,
    fontWeight: '600',
  },
});
