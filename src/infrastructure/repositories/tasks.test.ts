import { Task, TaskStep } from '../../domain/entities/Task';

// Mock tests for Tasks
describe('TasksRepository', () => {
  describe('Task Model', () => {
    it('should create a valid task', () => {
      const task: Task = {
        id: '1',
        userId: 'user123',
        title: 'Buy groceries',
        description: 'Get milk, bread, eggs',
        steps: [],
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(task).toBeDefined();
      expect(task.title).toBe('Buy groceries');
      expect(task.completed).toBe(false);
    });

    it('should create task with steps', () => {
      const steps: TaskStep[] = [
        {
          id: '1',
          title: 'Go to store',
          description: 'Walk to nearest market',
          completed: false,
          order: 1,
        },
        {
          id: '2',
          title: 'Buy items',
          description: 'Get items from list',
          completed: false,
          order: 2,
        },
      ];

      const task: Task = {
        id: '1',
        userId: 'user123',
        title: 'Shopping',
        description: 'Weekly shopping',
        steps,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(task.steps).toHaveLength(2);
      expect(task.steps[0].title).toBe('Go to store');
    });

    it('should mark task as completed', () => {
      const task: Task = {
        id: '1',
        userId: 'user123',
        title: 'Test task',
        description: 'A test task',
        steps: [],
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const completedTask: Task = {
        ...task,
        completed: true,
        completedAt: new Date(),
      };

      expect(completedTask.completed).toBe(true);
      expect(completedTask.completedAt).toBeDefined();
    });

    it('should track task timestamps', () => {
      const now = new Date();
      const task: Task = {
        id: '1',
        userId: 'user123',
        title: 'Timed task',
        description: 'Task with timestamps',
        steps: [],
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      expect(task.createdAt.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(task.updatedAt.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });

  describe('Task Operations', () => {
    it('should handle empty task list', () => {
      const tasks: Task[] = [];
      expect(tasks).toHaveLength(0);
    });

    it('should filter completed tasks', () => {
      const tasks: Task[] = [
        {
          id: '1',
          userId: 'user1',
          title: 'Task 1',
          description: 'Done',
          steps: [],
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          title: 'Task 2',
          description: 'Pending',
          steps: [],
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const completedTasks = tasks.filter((t) => t.completed);
      const pendingTasks = tasks.filter((t) => !t.completed);

      expect(completedTasks).toHaveLength(1);
      expect(pendingTasks).toHaveLength(1);
    });

    it('should sort tasks by creation date', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const tasks: Task[] = [
        {
          id: '1',
          userId: 'user1',
          title: 'New task',
          description: 'Today',
          steps: [],
          completed: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          userId: 'user1',
          title: 'Old task',
          description: 'Yesterday',
          steps: [],
          completed: false,
          createdAt: yesterday,
          updatedAt: yesterday,
        },
      ];

      const sorted = tasks.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      expect(sorted[0].title).toBe('New task');
      expect(sorted[1].title).toBe('Old task');
    });
  });
});
