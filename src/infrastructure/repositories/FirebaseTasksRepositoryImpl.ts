import { collection, query, getDocs, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ITasksRepository } from '../../domain/repositories/ITasksRepository';
import { Task } from '../../domain/entities/Task';

export class FirebaseTasksRepositoryImpl implements ITasksRepository {
  async getTasks(userId: string): Promise<Task[]> {
    const q = query(collection(db, 'users', userId, 'tasks'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId,
        title: data.title,
        description: data.description,
        steps: data.steps || [],
        completed: data.completed,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        dueDate: data.dueDate?.toDate(),
        reminderTime: data.reminderTime,
      } as Task;
    });
  }

  async createTask(task: Task): Promise<void> {
    const taskData: any = {
      title: task.title,
      description: task.description,
      steps: task.steps,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };

    // Only include optional fields if they have values
    if (task.dueDate !== undefined) taskData.dueDate = task.dueDate;
    if (task.reminderTime !== undefined) taskData.reminderTime = task.reminderTime;

    await setDoc(doc(db, 'users', task.userId, 'tasks', task.id), taskData);
  }

  async updateTask(task: Task): Promise<void> {
    const taskData: any = {
      title: task.title,
      description: task.description,
      steps: task.steps,
      completed: task.completed,
      updatedAt: task.updatedAt,
    };

    // Only include optional fields if they have values
    if (task.dueDate !== undefined) taskData.dueDate = task.dueDate;
    if (task.reminderTime !== undefined) taskData.reminderTime = task.reminderTime;
    if (task.completedAt !== undefined) taskData.completedAt = task.completedAt;

    await updateDoc(doc(db, 'users', task.userId, 'tasks', task.id), taskData);
  }

  async deleteTask(taskId: string): Promise<void> {
    // Note: This is a simplified implementation. In production, you'd need userId
    // For now, we'll handle this in the service layer
    throw new Error('Delete task requires userId in repository');
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    // Note: This is a simplified implementation. In production, you'd need userId
    throw new Error('Get task by ID requires userId in repository');
  }
}
