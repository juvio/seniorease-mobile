export interface TaskStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

export type TaskRecurrenceType = 'weekly' | 'custom';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  steps: TaskStep[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  reminderTime?: string; // HH:mm format
  seriesId?: string;
  recurrenceType?: TaskRecurrenceType;
  recurrenceIntervalDays?: number;
}
