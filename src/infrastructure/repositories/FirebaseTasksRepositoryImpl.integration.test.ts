import { FirebaseTasksRepositoryImpl } from './FirebaseTasksRepositoryImpl';
import { Task } from '../../domain/entities/Task';

const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockGetDocs = jest.fn();
const mockSetDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockDoc = jest.fn();
const mockGetDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
}));

jest.mock('../firebase/config', () => ({
  db: { mocked: true },
}));

describe('FirebaseTasksRepositoryImpl integration mapping', () => {
  const repository = new FirebaseTasksRepositoryImpl();
  const userId = 'user-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps Firestore documents when loading tasks', async () => {
    const createdAt = new Date('2026-06-20T09:00:00.000Z');
    const updatedAt = new Date('2026-06-20T10:00:00.000Z');
    const dueDate = new Date('2026-06-21T00:00:00.000Z');
    const completedAt = new Date('2026-06-20T11:00:00.000Z');

    mockCollection.mockReturnValue('collection-ref');
    mockQuery.mockReturnValue('query-ref');
    mockGetDocs.mockResolvedValue({
      docs: [
        {
          id: 'task-1',
          data: () => ({
            title: 'Tomar remédio',
            description: 'Após almoço',
            steps: [],
            completed: true,
            createdAt: { toDate: () => createdAt },
            updatedAt: { toDate: () => updatedAt },
            dueDate: { toDate: () => dueDate },
            completedAt: { toDate: () => completedAt },
            reminderTime: '14:00',
            seriesId: 'series-1',
            recurrenceType: 'weekly',
            recurrenceIntervalDays: 7,
          }),
        },
      ],
    });

    const result = await repository.getTasks(userId);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'task-1',
      userId,
      title: 'Tomar remédio',
      reminderTime: '14:00',
      seriesId: 'series-1',
      recurrenceType: 'weekly',
      recurrenceIntervalDays: 7,
      completed: true,
    });
    expect(result[0].dueDate).toEqual(dueDate);
    expect(result[0].completedAt).toEqual(completedAt);
  });

  it('persists recurrence and schedule fields when creating task', async () => {
    const task: Task = {
      id: 'task-2',
      userId,
      title: 'Caminhar',
      description: '',
      steps: [],
      completed: false,
      createdAt: new Date('2026-06-20T09:00:00.000Z'),
      updatedAt: new Date('2026-06-20T09:00:00.000Z'),
      dueDate: new Date('2026-06-20T00:00:00.000Z'),
      reminderTime: '08:30',
      seriesId: 'series-2',
      recurrenceType: 'weekly',
      recurrenceIntervalDays: 7,
    };

    mockDoc.mockReturnValue('task-doc-ref');
    mockSetDoc.mockResolvedValue(undefined);

    await repository.createTask(task);

    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    const [, payload] = mockSetDoc.mock.calls[0];
    expect(payload).toMatchObject({
      title: 'Caminhar',
      reminderTime: '08:30',
      seriesId: 'series-2',
      recurrenceType: 'weekly',
      recurrenceIntervalDays: 7,
      completed: false,
    });
    expect(payload.dueDate).toEqual(task.dueDate);
  });

  it('updates completion and recurrence fields', async () => {
    const task: Task = {
      id: 'task-3',
      userId,
      title: 'Exercício',
      description: '',
      steps: [],
      completed: true,
      createdAt: new Date('2026-06-20T09:00:00.000Z'),
      updatedAt: new Date('2026-06-20T11:00:00.000Z'),
      completedAt: new Date('2026-06-20T11:00:00.000Z'),
      dueDate: new Date('2026-06-20T00:00:00.000Z'),
      reminderTime: '10:00',
      seriesId: 'series-3',
      recurrenceType: 'weekly',
      recurrenceIntervalDays: 7,
    };

    mockDoc.mockReturnValue('task-doc-ref');
    mockUpdateDoc.mockResolvedValue(undefined);

    await repository.updateTask(task);

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    const [, payload] = mockUpdateDoc.mock.calls[0];
    expect(payload).toMatchObject({
      completed: true,
      reminderTime: '10:00',
      seriesId: 'series-3',
      recurrenceType: 'weekly',
      recurrenceIntervalDays: 7,
    });
    expect(payload.completedAt).toEqual(task.completedAt);
  });

  it('deletes using user scoped path', async () => {
    mockDoc.mockReturnValue('task-doc-ref');
    mockDeleteDoc.mockResolvedValue(undefined);

    await repository.deleteTask(userId, 'task-4');

    expect(mockDoc).toHaveBeenCalledWith({ mocked: true }, 'users', userId, 'tasks', 'task-4');
    expect(mockDeleteDoc).toHaveBeenCalledWith('task-doc-ref');
  });

  it('gets a task by id with mapped fields', async () => {
    const createdAt = new Date('2026-06-20T09:00:00.000Z');
    const updatedAt = new Date('2026-06-20T10:00:00.000Z');
    const dueDate = new Date('2026-06-21T00:00:00.000Z');

    mockDoc.mockReturnValue('task-doc-ref');
    mockGetDoc.mockResolvedValue({
      id: 'task-5',
      exists: () => true,
      data: () => ({
        title: 'Consulta',
        description: '',
        steps: [],
        completed: false,
        createdAt: { toDate: () => createdAt },
        updatedAt: { toDate: () => updatedAt },
        dueDate: { toDate: () => dueDate },
        reminderTime: '16:00',
      }),
    });

    const result = await repository.getTaskById(userId, 'task-5');

    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      id: 'task-5',
      userId,
      title: 'Consulta',
      reminderTime: '16:00',
      completed: false,
    });
    expect(result?.dueDate).toEqual(dueDate);
  });
});
