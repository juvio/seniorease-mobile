import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Task } from '../../domain/entities/Task';
import { useTasks } from './useTasks';

interface TaskActivityItem {
  id: string;
  title: string;
  reminderText: string;
  statusLabel: string;
  actionLabel: string;
  statusTone: 'warning' | 'neutral' | 'success';
  sourceTask: Task;
}

const getValidDate = (value: Date | string | undefined) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getReminderText = (task: Task) => {
  const dueDate = getValidDate(task.dueDate as Date | string | undefined);

  if (dueDate) {
    const hours = dueDate.getHours().toString().padStart(2, '0');
    const minutes = dueDate.getMinutes().toString().padStart(2, '0');

    return `Lembrete: ${dueDate.toLocaleDateString('pt-BR')} às ${hours}:${minutes}`;
  }

  if (task.reminderTime) {
    return `Lembrete: hoje às ${task.reminderTime}`;
  }

  return 'Lembrete: hoje sem horário definido';
};

const getStatus = (
  task: Task,
): Pick<TaskActivityItem, 'statusLabel' | 'statusTone' | 'actionLabel'> => {
  if (task.completed) {
    return {
      statusLabel: 'Concluída',
      statusTone: 'success',
      actionLabel: 'Ver',
    };
  }

  const dueDate = getValidDate(task.dueDate as Date | string | undefined);

  if (!dueDate) {
    return {
      statusLabel: 'Em breve',
      statusTone: 'warning',
      actionLabel: 'Iniciar',
    };
  }

  const now = new Date();
  const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursDiff <= 24) {
    return {
      statusLabel: 'Hoje',
      statusTone: 'warning',
      actionLabel: 'Abrir',
    };
  }

  return {
    statusLabel: 'Próxima',
    statusTone: 'neutral',
    actionLabel: 'Abrir',
  };
};

export const useTasksScreen = () => {
  const { tasks, loading, addTask, updateTask, loadTasks } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Aviso', 'Digite um título para a atividade');
      return;
    }

    try {
      await addTask(newTaskTitle.trim(), newTaskDescription.trim());
      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowForm(false);
      Alert.alert('Sucesso', 'Atividade criada!');
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível criar a atividade: ' +
          (error instanceof Error ? error.message : 'Erro desconhecido'),
      );
    }
  }, [addTask, newTaskDescription, newTaskTitle]);

  const handlePrimaryAction = useCallback(
    async (task: Task) => {
      if (task.completed) {
        Alert.alert('Atividade concluída', 'Esta atividade já está concluída.');
        return;
      }

      try {
        await updateTask({
          ...task,
          completed: true,
          completedAt: new Date(),
        });
        Alert.alert('Muito bem!', 'Atividade marcada como concluída.');
      } catch (error) {
        console.log('Erro ao atualizar tarefa:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a atividade');
      }
    },
    [updateTask],
  );

  const activityItems = useMemo<TaskActivityItem[]>(() => {
    return tasks.map((task) => {
      const status = getStatus(task);

      return {
        id: task.id,
        title: task.title,
        reminderText: getReminderText(task),
        statusLabel: status.statusLabel,
        statusTone: status.statusTone,
        actionLabel: status.actionLabel,
        sourceTask: task,
      };
    });
  }, [tasks]);

  return {
    isLoading: loading,
    activityItems,
    showForm,
    newTaskTitle,
    newTaskDescription,
    setShowForm,
    setNewTaskTitle,
    setNewTaskDescription,
    onAddTask: handleAddTask,
    onPrimaryAction: handlePrimaryAction,
  };
};
