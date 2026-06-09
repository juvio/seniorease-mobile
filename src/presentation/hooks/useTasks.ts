import { useCallback } from 'react';
import { TasksService } from '../../application/services/TasksService';
import { useTasksStore } from '../../shared/stores/tasksStore';
import { useAuthStore } from '../../shared/stores/authStore';
import { Task } from '../../domain/entities/Task';

export const useTasks = () => {
  const tasksStore = useTasksStore();
  const authStore = useAuthStore();
  const tasksService = new TasksService();

  const loadTasks = useCallback(async () => {
    if (!authStore.user) return;

    try {
      tasksStore.setLoading(true);
      tasksStore.setError(null);

      const tasks = await tasksService.getTasks(authStore.user.id);
      tasksStore.setTasks(tasks);
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao carregar tarefas';
      tasksStore.setError(errorMessage);
    } finally {
      tasksStore.setLoading(false);
    }
  }, [authStore.user, tasksStore]);

  const addTask = useCallback(
    async (title: string, description: string) => {
      if (!authStore.user) return;

      try {
        tasksStore.setLoading(true);
        tasksStore.setError(null);

        const newTask: Task = {
          id: Date.now().toString(),
          userId: authStore.user.id,
          title,
          description,
          steps: [],
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await tasksService.createTask(newTask);
        tasksStore.addTask(newTask);
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao criar tarefa';
        tasksStore.setError(errorMessage);
      } finally {
        tasksStore.setLoading(false);
      }
    },
    [authStore.user, tasksStore]
  );

  const updateTask = useCallback(
    async (task: Task) => {
      try {
        tasksStore.setLoading(true);
        tasksStore.setError(null);

        const updatedTask = {
          ...task,
          updatedAt: new Date(),
        };

        await tasksService.updateTask(updatedTask);
        tasksStore.updateTask(updatedTask);
      } catch (error: any) {
        const errorMessage = error?.message || 'Erro ao atualizar tarefa';
        tasksStore.setError(errorMessage);
      } finally {
        tasksStore.setLoading(false);
      }
    },
    [tasksStore]
  );

  return {
    tasks: tasksStore.tasks,
    loading: tasksStore.loading,
    error: tasksStore.error,
    loadTasks,
    addTask,
    updateTask,
  };
};
