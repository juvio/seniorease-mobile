import { useTasksStore } from './tasksStore';

const task = (id: string) => ({
  id,
  userId: 'u1',
  title: `Estudo TI ${id}`,
  description: '',
  steps: [],
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('tasksStore', () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: [], loading: false, error: null });
  });

  it('setTasks e addTask atualizam lista', () => {
    useTasksStore.getState().setTasks([task('1') as any]);
    useTasksStore.getState().addTask(task('2') as any);

    expect(useTasksStore.getState().tasks.map((t) => t.id)).toEqual(['1', '2']);
  });

  it('updateTask substitui item por id', () => {
    useTasksStore.setState({ tasks: [task('1') as any, task('2') as any] });

    useTasksStore.getState().updateTask({ ...(task('2') as any), completed: true });

    const current = useTasksStore.getState().tasks.find((t) => t.id === '2');
    expect(current?.completed).toBe(true);
  });

  it('deleteTask e deleteTasks removem itens corretamente', () => {
    useTasksStore.setState({ tasks: [task('1') as any, task('2') as any, task('3') as any] });

    useTasksStore.getState().deleteTask('1');
    useTasksStore.getState().deleteTasks(['2']);

    expect(useTasksStore.getState().tasks.map((t) => t.id)).toEqual(['3']);
  });

  it('setLoading e setError atualizam estado', () => {
    useTasksStore.getState().setLoading(true);
    useTasksStore.getState().setError('falha tarefas');

    expect(useTasksStore.getState().loading).toBe(true);
    expect(useTasksStore.getState().error).toBe('falha tarefas');
  });
});
