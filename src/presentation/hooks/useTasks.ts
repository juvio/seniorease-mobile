import { useCallback } from 'react';
import { appContainer } from '../../application/container';
import { useTasksStore } from '../../shared/stores/tasksStore';
import { useAuthStore } from '../../shared/stores/authStore';
import { Task } from '../../domain/entities/Task';

interface CreateTaskInput {
  title: string;
  dueDate: Date;
  reminderTime?: string;
  description?: string;
  recurrenceType?: Task['recurrenceType'];
  recurrenceIntervalDays?: number;
  seriesId?: string;
}

export const useTasks = () => {
  const user = useAuthStore((state) => state.user);

  const tasks = useTasksStore((state) => state.tasks);
  const loading = useTasksStore((state) => state.loading);
  const error = useTasksStore((state) => state.error);
  const setTasks = useTasksStore((state) => state.setTasks);
  const addTaskToStore = useTasksStore((state) => state.addTask);
  const updateTaskInStore = useTasksStore((state) => state.updateTask);
  const deleteTaskInStore = useTasksStore((state) => state.deleteTask);
  const deleteTasksInStore = useTasksStore((state) => state.deleteTasks);
  const setLoading = useTasksStore((state) => state.setLoading);
  const setError = useTasksStore((state) => state.setError);

  const { tasksService } = appContainer;

  const loadTasks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const loadedTasks = await tasksService.getTasks(user.id);
      setTasks(loadedTasks);
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao carregar tarefas';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setError, tasksService, setTasks]);

  const addTask = useCallback(
    async (input: CreateTaskInput) => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const newTask: Task = {
          id: Date.now().toString(),
          userId: user.id,
          title: input.title,
          description: input.description || '',
          steps: [],
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: input.dueDate,
          reminderTime: input.reminderTime,
          seriesId: input.seriesId,
          recurrenceType: input.recurrenceType,
          recurrenceIntervalDays: input.recurrenceIntervalDays,
        };

        await tasksService.createTask(newTask);
        addTaskToStore(newTask);
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao criar tarefa';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, setLoading, setError, tasksService, addTaskToStore]
  );

  const updateTask = useCallback(
    async (task: Task) => {
      try {
        setLoading(true);
        setError(null);

        const updatedTask = {
          ...task,
          updatedAt: new Date(),
        };

        await tasksService.updateTask(updatedTask);
        updateTaskInStore(updatedTask);
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao atualizar tarefa';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, tasksService, updateTaskInStore]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        await tasksService.deleteTask(user.id, taskId);
        deleteTaskInStore(taskId);
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao excluir tarefa';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, setLoading, setError, tasksService, deleteTaskInStore]
  );

  const deleteTasks = useCallback(
    async (taskIds: string[]) => {
      if (!user || taskIds.length === 0) return;

      try {
        setLoading(true);
        setError(null);

        await Promise.all(taskIds.map((taskId) => tasksService.deleteTask(user.id, taskId)));
        deleteTasksInStore(taskIds);
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao excluir tarefas';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, setLoading, setError, tasksService, deleteTasksInStore]
  );

  return {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks,
  };
};
