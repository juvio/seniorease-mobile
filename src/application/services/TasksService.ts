import { FirebaseTasksRepositoryImpl } from '../../infrastructure/repositories/FirebaseTasksRepositoryImpl';
import { Task } from '../../domain/entities/Task';

export class TasksService {
  private tasksRepository: FirebaseTasksRepositoryImpl;

  constructor() {
    this.tasksRepository = new FirebaseTasksRepositoryImpl();
  }

  async getTasks(userId: string): Promise<Task[]> {
    return this.tasksRepository.getTasks(userId);
  }

  async createTask(task: Task): Promise<void> {
    return this.tasksRepository.createTask(task);
  }

  async updateTask(task: Task): Promise<void> {
    return this.tasksRepository.updateTask(task);
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.tasksRepository.deleteTask(userId, taskId);
  }
}
