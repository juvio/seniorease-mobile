import { act, renderHook } from '@testing-library/react-native';
import { useTasksScreen } from './useTasksScreen';

const mockShowAppAlert = jest.fn();

const mockLoadTasks = jest.fn();
const mockAddTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockDeleteTasks = jest.fn();

const mockLoadSettings = jest.fn();

let mockTasksValue: any[] = [];
let mockSettingsValue: any = {
  accessibility: {
    interfaceMode: 'advanced',
    reinforcedFeedback: true,
    confirmCriticalActions: false,
  },
};

jest.mock('./useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasksValue,
    loading: false,
    addTask: mockAddTask,
    updateTask: mockUpdateTask,
    deleteTask: mockDeleteTask,
    deleteTasks: mockDeleteTasks,
    loadTasks: mockLoadTasks,
  }),
}));

jest.mock('./useSettings', () => ({
  useSettings: () => ({
    settings: mockSettingsValue,
    loading: false,
    loadSettings: mockLoadSettings,
  }),
}));

jest.mock('../../shared/stores/alertStore', () => ({
  showAppAlert: (...args: unknown[]) => mockShowAppAlert(...args),
}));

const buildTask = (overrides: Record<string, unknown> = {}) => ({
  id: 'task-1',
  userId: 'user-1',
  title: 'Estudar algoritmos de grafos',
  description: '',
  steps: [],
  completed: false,
  createdAt: new Date('2026-03-05T08:00:00.000Z'),
  updatedAt: new Date('2026-03-05T08:00:00.000Z'),
  dueDate: new Date('2026-03-05T00:00:00.000Z'),
  ...overrides,
});

describe('useTasksScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-05T09:00:00.000Z'));

    mockTasksValue = [];
    mockSettingsValue = {
      accessibility: {
        interfaceMode: 'advanced',
        reinforcedFeedback: true,
        confirmCriticalActions: false,
      },
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('carrega tarefas e settings ao montar hook', async () => {
    await renderHook(() => useTasksScreen());

    expect(mockLoadTasks).toHaveBeenCalledTimes(1);
    expect(mockLoadSettings).toHaveBeenCalledTimes(1);
  });

  it('ao salvar sem titulo mostra aviso e volta para etapa title', async () => {
    const { result } = await renderHook(() => useTasksScreen());

    await act(async () => {
      result.current.onSaveTask();
    });

    expect(result.current.toast.visible).toBe(true);
    expect(result.current.toast.type).toBe('warning');
    expect(result.current.formStep).toBe('title');
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('salva tarefa simples com dados validos', async () => {
    mockAddTask.mockResolvedValue(undefined);
    const { result } = await renderHook(() => useTasksScreen());

    await act(async () => {
      result.current.setTitleInput('  Resolver lista de estruturas de dados  ');
      result.current.onSelectDueDate(new Date('2026-03-06T00:00:00.000Z'));
      result.current.setIsAnytime(true);
    });

    await act(async () => {
      await result.current.onSaveTask();
    });

    expect(mockAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Resolver lista de estruturas de dados',
        recurrenceType: undefined,
      }),
    );
    expect(result.current.toast.type).toBe('success');
  });

  it('nao permite concluir tarefa de dia passado', async () => {
    const { result } = await renderHook(() => useTasksScreen());
    const pastTask = buildTask({ dueDate: new Date('2026-03-04T00:00:00.000Z') });

    await act(async () => {
      await result.current.onCompleteTask(pastTask as any);
    });

    expect(mockUpdateTask).not.toHaveBeenCalled();
    expect(result.current.toast.type).toBe('warning');
  });

  it('conclui tarefa do dia atual e atualiza status', async () => {
    mockUpdateTask.mockResolvedValue(undefined);
    const { result } = await renderHook(() => useTasksScreen());
    const todayTask = buildTask();

    await act(async () => {
      await result.current.onCompleteTask(todayTask as any);
    });

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({ completed: true, id: 'task-1', completedAt: expect.any(Date) }),
    );
    expect(result.current.toast.type).toBe('success');
  });

  it('exclusao simples abre confirmacao e remove tarefa', async () => {
    mockDeleteTask.mockResolvedValue(undefined);
    const { result } = await renderHook(() => useTasksScreen());
    const task = buildTask({ seriesId: undefined, recurrenceType: undefined });

    await act(async () => {
      result.current.onDeleteTask(task as any);
    });

    expect(mockShowAppAlert).toHaveBeenCalledTimes(1);
    const firstAlert = mockShowAppAlert.mock.calls[0][0];
    const deleteAction = firstAlert.actions.find((a: any) => a.text === 'Excluir');

    await act(async () => {
      await deleteAction.onPress();
    });

    expect(mockDeleteTask).toHaveBeenCalledWith('task-1');
    expect(result.current.toast.type).toBe('success');
  });

  it('quando confirmacao critica esta ativa, salvar abre alerta de confirmacao', async () => {
    mockSettingsValue = {
      accessibility: {
        interfaceMode: 'advanced',
        reinforcedFeedback: true,
        confirmCriticalActions: true,
      },
    };
    const { result } = await renderHook(() => useTasksScreen());

    await act(async () => {
      result.current.setTitleInput('Revisar requisitos do TCC');
      result.current.onSelectDueDate(new Date('2026-03-06T00:00:00.000Z'));
      result.current.setIsAnytime(true);
    });

    await act(async () => {
      await result.current.onSaveTask();
    });

    expect(mockShowAppAlert).toHaveBeenCalled();
    const confirmAlert = mockShowAppAlert.mock.calls[mockShowAppAlert.mock.calls.length - 1][0];
    const saveAction = confirmAlert.actions.find((a: any) => a.text === 'Salvar');

    mockAddTask.mockResolvedValue(undefined);
    await act(async () => {
      await saveAction.onPress();
    });

    expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({ title: 'Revisar requisitos do TCC' }));
  });

  it('close form com rascunho e confirmacao critica ativa abre alerta de saida', async () => {
    mockSettingsValue = {
      accessibility: {
        interfaceMode: 'advanced',
        reinforcedFeedback: true,
        confirmCriticalActions: true,
      },
    };
    const { result } = await renderHook(() => useTasksScreen());

    await act(async () => {
      result.current.setShowForm(true);
      result.current.setTitleInput('Rascunho');
    });

    await act(async () => {
      result.current.onCloseForm();
    });

    expect(mockShowAppAlert).toHaveBeenCalled();
    const alert = mockShowAppAlert.mock.calls[mockShowAppAlert.mock.calls.length - 1][0];
    expect(alert.title).toBe('Sair sem salvar');
  });

  it('nextFormStep em modo simplificado salva diretamente apos data valida', async () => {
    mockSettingsValue = {
      accessibility: {
        interfaceMode: 'basic',
        reinforcedFeedback: true,
        confirmCriticalActions: false,
      },
    };
    mockAddTask.mockResolvedValue(undefined);
    const { result } = await renderHook(() => useTasksScreen());

    await act(async () => {
      result.current.setTitleInput('Preparar seminario de arquitetura de software');
    });

    await act(async () => {
      result.current.onNextFormStep();
    });

    await act(async () => {
      result.current.onSelectDueDate(new Date('2026-03-06T00:00:00.000Z'));
    });

    await act(async () => {
      await result.current.onNextFormStep();
    });

    expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({ title: 'Preparar seminario de arquitetura de software' }));
  });

  it('filtro de historico completed retorna apenas concluidas', async () => {
    mockTasksValue = [
      buildTask({ id: 'done', completed: true, completedAt: new Date('2026-03-05T10:00:00.000Z') }),
      buildTask({ id: 'pending', completed: false, dueDate: new Date('2026-03-06T00:00:00.000Z') }),
    ];

    const { result } = await renderHook(() => useTasksScreen());

    await act(async () => {
      result.current.setHistoryFilter('completed');
    });

    expect(result.current.historyItems).toHaveLength(1);
    expect(result.current.historyItems[0].statusLabel).toBe('Concluído');
  });

  it('callback de recorrencia personalizada abre alerta informativo', async () => {
    const { result } = await renderHook(() => useTasksScreen());

    await act(async () => {
      result.current.onShowCustomRecurrenceInfo();
    });

    expect(mockShowAppAlert).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Recorrência personalizada' }),
    );
  });

  it('navega entre dias com tarefas quando existem datas anteriores e posteriores', async () => {
    mockTasksValue = [
      buildTask({ id: 'yesterday', dueDate: new Date('2026-03-04T00:00:00.000Z') }),
      buildTask({ id: 'tomorrow', dueDate: new Date('2026-03-06T00:00:00.000Z') }),
    ];

    const { result } = await renderHook(() => useTasksScreen());

    expect(result.current.showPreviousDayButton).toBe(true);
    expect(result.current.showNextDayButton).toBe(true);

    await act(async () => {
      result.current.onGoToPreviousDay();
    });

    expect(result.current.dayTitle).toBe('04/03/2026');

    await act(async () => {
      result.current.onGoToNextDay();
    });

    expect(result.current.dayTitle).toBe('Hoje');
  });
});
