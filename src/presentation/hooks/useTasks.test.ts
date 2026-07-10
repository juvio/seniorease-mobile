import { act, renderHook } from '@testing-library/react-native';
import { useTasks } from './useTasks';
import { useAuthStore } from '../../shared/stores/authStore';
import { useTasksStore } from '../../shared/stores/tasksStore';

const mockGetTasks = jest.fn();
const mockCreateTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();

jest.mock('../../application/services/TasksService', () => ({
  TasksService: jest.fn().mockImplementation(() => ({
    getTasks: mockGetTasks,
    createTask: mockCreateTask,
    updateTask: mockUpdateTask,
    deleteTask: mockDeleteTask,
  })),
}));

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-01T09:00:00.000Z'));

    useAuthStore.setState({
      user: { id: 'user-1', email: 'estudante.ti@universidade.edu.br', displayName: 'Estudante TI', createdAt: new Date(), updatedAt: new Date() },
      loading: false,
      error: null,
    });

    useTasksStore.setState({
      tasks: [],
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('loadTasks busca tarefas e atualiza store', async () => {
    mockGetTasks.mockResolvedValue([
      {
        id: 't1',
        userId: 'user-1',
        title: 'Praticar testes unitarios com Jest',
        description: '',
        steps: [],
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const { result } = await renderHook(() => useTasks());

    await act(async () => {
      await result.current.loadTasks();
    });

    expect(mockGetTasks).toHaveBeenCalledWith('user-1');
    expect(useTasksStore.getState().tasks).toHaveLength(1);
    expect(useTasksStore.getState().error).toBeNull();
  });

  it('addTask cria entidade com defaults e persiste no store', async () => {
    mockCreateTask.mockResolvedValue(undefined);
    const { result } = await renderHook(() => useTasks());

    await act(async () => {
      await result.current.addTask({
        title: 'Estudar estruturas de dados para prova',
        dueDate: new Date('2026-03-02T00:00:00.000Z'),
        reminderTime: '08:00',
      });
    });

    expect(mockCreateTask).toHaveBeenCalledTimes(1);
    const task = useTasksStore.getState().tasks[0];
    expect(task.title).toBe('Estudar estruturas de dados para prova');
    expect(task.completed).toBe(false);
    expect(task.steps).toEqual([]);
  });

  it('updateTask atualiza updatedAt e salva no store', async () => {
    mockUpdateTask.mockResolvedValue(undefined);
    const initialTask = {
      id: 't2',
      userId: 'user-1',
      title: 'Praticar desafios de API REST',
      description: '',
      steps: [],
      completed: false,
      createdAt: new Date('2026-03-01T07:00:00.000Z'),
      updatedAt: new Date('2026-03-01T07:00:00.000Z'),
    };
    useTasksStore.setState({ tasks: [initialTask] });

    const { result } = await renderHook(() => useTasks());

    await act(async () => {
      await result.current.updateTask({ ...initialTask, completed: true });
    });

    const updated = useTasksStore.getState().tasks[0];
    expect(updated.completed).toBe(true);
    expect(updated.updatedAt.getTime()).toBeGreaterThan(initialTask.updatedAt.getTime());
  });

  it('deleteTask remove item no fluxo simples', async () => {
    mockDeleteTask.mockResolvedValue(undefined);
    useTasksStore.setState({
      tasks: [
        {
          id: 't-del',
          userId: 'user-1',
          title: 'Excluir',
          description: '',
          steps: [],
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const { result } = await renderHook(() => useTasks());

    await act(async () => {
      await result.current.deleteTask('t-del');
    });

    expect(mockDeleteTask).toHaveBeenCalledWith('user-1', 't-del');
    expect(useTasksStore.getState().tasks).toHaveLength(0);
  });

  it('em erro define mensagem no estado e propaga excecao', async () => {
    mockCreateTask.mockRejectedValue(new Error('falha ao criar'));
    const { result } = await renderHook(() => useTasks());

    await expect(
      act(async () => {
        await result.current.addTask({
          title: 'X',
          dueDate: new Date('2026-03-02T00:00:00.000Z'),
        });
      }),
    ).rejects.toThrow('falha ao criar');

    expect(useTasksStore.getState().error).toBe('falha ao criar');
    expect(useTasksStore.getState().loading).toBe(false);
  });

  it('deleteTasks remove varios itens no fluxo em lote', async () => {
    mockDeleteTask.mockResolvedValue(undefined);
    useTasksStore.setState({
      tasks: [
        {
          id: 't1',
          userId: 'user-1',
          title: 'A',
          description: '',
          steps: [],
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 't2',
          userId: 'user-1',
          title: 'B',
          description: '',
          steps: [],
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const { result } = await renderHook(() => useTasks());

    await act(async () => {
      await result.current.deleteTasks(['t1', 't2']);
    });

    expect(mockDeleteTask).toHaveBeenCalledTimes(2);
    expect(useTasksStore.getState().tasks).toHaveLength(0);
  });

  it('deleteTasks nao executa quando lista vem vazia', async () => {
    const { result } = await renderHook(() => useTasks());

    await act(async () => {
      await result.current.deleteTasks([]);
    });

    expect(mockDeleteTask).not.toHaveBeenCalled();
  });
});
