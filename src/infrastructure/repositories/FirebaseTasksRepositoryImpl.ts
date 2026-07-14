import {
  collection,
  query,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
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
        seriesId: data.seriesId,
        recurrenceType: data.recurrenceType,
        recurrenceIntervalDays: data.recurrenceIntervalDays,
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
    if (task.seriesId !== undefined) taskData.seriesId = task.seriesId;
    if (task.recurrenceType !== undefined) taskData.recurrenceType = task.recurrenceType;
    if (task.recurrenceIntervalDays !== undefined) {
      taskData.recurrenceIntervalDays = task.recurrenceIntervalDays;
    }

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
    if (task.seriesId !== undefined) taskData.seriesId = task.seriesId;
    if (task.recurrenceType !== undefined) taskData.recurrenceType = task.recurrenceType;
    if (task.recurrenceIntervalDays !== undefined) {
      taskData.recurrenceIntervalDays = task.recurrenceIntervalDays;
    }

    await updateDoc(doc(db, 'users', task.userId, 'tasks', task.id), taskData);
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId, 'tasks', taskId));
  }

  async getTaskById(userId: string, taskId: string): Promise<Task | null> {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      return null;
    }

    const data = taskDoc.data();

    return {
      id: taskDoc.id,
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
      seriesId: data.seriesId,
      recurrenceType: data.recurrenceType,
      recurrenceIntervalDays: data.recurrenceIntervalDays,
    } as Task;
  }
}
