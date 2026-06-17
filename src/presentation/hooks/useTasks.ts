import { useCallback, useRef } from 'react';
import { TasksService } from '../../application/services/TasksService';
import { useTasksStore } from '../../shared/stores/tasksStore';
import { useAuthStore } from '../../shared/stores/authStore';
import { Task } from '../../domain/entities/Task';

export const useTasks = () => {
  const user = useAuthStore((state) => state.user);

  const tasks = useTasksStore((state) => state.tasks);
  const loading = useTasksStore((state) => state.loading);
  const error = useTasksStore((state) => state.error);
  const setTasks = useTasksStore((state) => state.setTasks);
  const addTaskToStore = useTasksStore((state) => state.addTask);
  const updateTaskInStore = useTasksStore((state) => state.updateTask);
  const setLoading = useTasksStore((state) => state.setLoading);
  const setError = useTasksStore((state) => state.setError);

  const tasksService = useRef(new TasksService()).current;

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
    async (title: string, description: string) => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const newTask: Task = {
          id: Date.now().toString(),
          userId: user.id,
          title,
          description,
          steps: [],
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
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

  return {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask,
  };
};
