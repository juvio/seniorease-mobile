import { Task } from '../entities/Task';

export interface ITasksRepository {
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: Task): Promise<void>;
  updateTask(task: Task): Promise<void>;
  deleteTask(userId: string, taskId: string): Promise<void>;
  getTaskById(userId: string, taskId: string): Promise<Task | null>;
}
