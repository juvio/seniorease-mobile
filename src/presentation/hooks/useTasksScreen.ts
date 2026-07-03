import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Task } from '../../domain/entities/Task';
import { useSettings } from './useSettings';
import { useTasks } from './useTasks';

export interface HomeTaskItem {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel?: string;
  statusLabel: 'Concluída' | 'Pendente';
  hasOverdueWarning: boolean;
  overdueWarningText?: string;
  isCompleted: boolean;
  isRecurring: boolean;
  sourceTask: Task;
}

export interface HomeHistoryItem {
  id: string;
  title: string;
  relevantDateLabel: string;
  relevantDatePrefix: 'Agendado para' | 'Concluída em';
  statusLabel: 'Concluída' | 'Pendente';
}

type HistoryFilter = 'completed' | 'pending';
type DeleteScope = 'single' | 'future';
type FormStep = 'title' | 'dateTime' | 'recurrence';
type RecurrenceChoice = 'none' | 'weekly';

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const parseTaskDate = (task: Task) => {
  if (task.dueDate instanceof Date && !Number.isNaN(task.dueDate.getTime())) {
    return normalizeDateOnly(task.dueDate);
  }

  if (typeof task.dueDate === 'string') {
    const parsed = parseDateString(task.dueDate);
    if (parsed) {
      return parsed;
    }
  }

  return task.createdAt;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');

const normalizeDateOnly = (date: Date) =>
  new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

const parseDateString = (value: string): Date | null => {
  const trimmed = value.trim();

  const ptBrMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ptBrMatch) {
    const [, dayText, monthText, yearText] = ptBrMatch;
    const day = Number(dayText);
    const month = Number(monthText) - 1;
    const year = Number(yearText);
    return new Date(year, month, day);
  }

  const isoDateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, yearText, monthText, dayText] = isoDateMatch;
    const day = Number(dayText);
    const month = Number(monthText) - 1;
    const year = Number(yearText);
    return new Date(year, month, day);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return normalizeDateOnly(parsed);
};

const isPastDate = (date: Date) => startOfDay(date).getTime() < startOfDay(new Date()).getTime();

const buildTaskDateTime = (task: Task) => {
  const baseDate = parseTaskDate(task);
  const date = new Date(baseDate);

  if (!task.reminderTime) {
    return date;
  }

  const [hourText, minuteText] = task.reminderTime.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
    date.setHours(hour, minute, 0, 0);
  }

  return date;
};

const buildSummary = (
  title: string,
  dueDate: Date | null,
  reminderTime: string,
  recurrence: RecurrenceChoice,
  includeRecurrence: boolean,
) => {
  const dateText = dueDate ? formatDate(dueDate) : '-';
  const timeText = reminderTime ? reminderTime : 'A qualquer momento do dia';
  const recurrenceText = recurrence === 'weekly' ? 'Semanal' : 'Não';

  const lines = [
    `Título: ${title}`,
    `Data: ${dateText}`,
    `Horário: ${timeText}`,
  ];

  if (includeRecurrence) {
    lines.push(`Recorrência: ${recurrenceText}`);
  }

  return lines.join('\n');
};

export const useTasksScreen = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, deleteTasks, loadTasks } = useTasks();
  const { settings, loading: settingsLoading, loadSettings } = useSettings();

  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>('title');
  const [titleInput, setTitleInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [timeInput, setTimeInput] = useState('');
  const [isAnytime, setIsAnytime] = useState(true);
  const [recurrenceChoice, setRecurrenceChoice] = useState<RecurrenceChoice>('none');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('pending');
  const [toast, setToast] = useState<{
    visible: boolean;
    type: 'success' | 'warning' | 'error';
    message: string;
  }>({ visible: false, type: 'success', message: '' });

  useEffect(() => {
    loadTasks();
    loadSettings();
  }, [loadSettings, loadTasks]);

  const isSimplifiedMode = settings?.accessibility.interfaceMode === 'basic';
  const reinforcedFeedback = Boolean(settings?.accessibility.reinforcedFeedback);
  const confirmCriticalActions = Boolean(settings?.accessibility.confirmCriticalActions);

  useEffect(() => {
    if (isSimplifiedMode) {
      setSelectedDate(startOfDay(new Date()));
    }
  }, [isSimplifiedMode]);

  const notify = useCallback(
    (type: 'success' | 'warning' | 'error', message: string) => {
      setToast({ visible: true, type, message });
    },
    [],
  );

  const resetFormState = useCallback(() => {
    setShowForm(false);
    setFormStep('title');
    setTitleInput('');
    setDateInput('');
    setDueDate(null);
    setTimeInput('');
    setIsAnytime(true);
    setRecurrenceChoice('none');
  }, []);

  const closeForm = useCallback(() => {
    const hasDraft = titleInput.trim() || dateInput.trim() || timeInput.trim() || dueDate;

    if (confirmCriticalActions && hasDraft) {
      Alert.alert('Sair sem salvar', 'Você tem alterações não salvas. Deseja sair mesmo?', [
        { text: 'Continuar editando', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: resetFormState },
      ]);
      return;
    }

    resetFormState();
  }, [confirmCriticalActions, dateInput, dueDate, resetFormState, timeInput, titleInput]);

  const submitTask = useCallback(async () => {
    if (!titleInput.trim()) {
      notify('warning', 'O que você precisa fazer?');
      setFormStep('title');
      return;
    }

    if (!dueDate) {
      notify('warning', 'Escolha uma data para continuar.');
      setFormStep('dateTime');
      return;
    }

    if (isPastDate(dueDate)) {
      notify('warning', 'Escolha uma data de hoje em diante para continuar.');
      setFormStep('dateTime');
      return;
    }

    const reminderTime = isAnytime ? undefined : timeInput.trim() || undefined;
    const recurrenceType = recurrenceChoice === 'weekly' ? 'weekly' : undefined;
    const seriesId = recurrenceType ? `${Date.now()}-${Math.random().toString(16).slice(2)}` : undefined;

    const executeSave = async () => {
      try {
        await addTask({
          title: titleInput.trim(),
          dueDate,
          reminderTime,
          recurrenceType,
          recurrenceIntervalDays: recurrenceType === 'weekly' ? 7 : undefined,
          seriesId,
        });

        resetFormState();
        notify('success', 'Tarefa criada com sucesso.');
      } catch (error) {
        notify('error', error instanceof Error ? error.message : 'Não foi possível criar a tarefa.');
      }
    };

    if (confirmCriticalActions) {
      Alert.alert(
        'Confirmar tarefa',
        `Deseja realmente salvar?\n\n${buildSummary(
          titleInput.trim(),
          dueDate,
          reminderTime || '',
          recurrenceChoice,
          !(isSimplifiedMode && recurrenceChoice === 'none'),
        )}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salvar', onPress: () => void executeSave() },
        ],
      );
      return;
    }

    await executeSave();
  }, [
    addTask,
    confirmCriticalActions,
    dueDate,
    isAnytime,
    isSimplifiedMode,
    notify,
    recurrenceChoice,
    resetFormState,
    timeInput,
    titleInput,
  ]);

  const createNextRecurringOccurrence = useCallback(
    async (task: Task) => {
      if (!task.recurrenceType || !task.seriesId) return;

      const currentDate = parseTaskDate(task);
      const daysInterval = task.recurrenceType === 'weekly' ? 7 : task.recurrenceIntervalDays || 7;
      const nextDate = addDays(currentDate, daysInterval);

      const alreadyExists = tasks.some((item) => {
        if (item.seriesId !== task.seriesId || item.id === task.id) return false;
        return (
          isSameDay(parseTaskDate(item), nextDate) &&
          (item.reminderTime || '') === (task.reminderTime || '')
        );
      });

      if (alreadyExists) return;

      await addTask({
        title: task.title,
        dueDate: nextDate,
        reminderTime: task.reminderTime,
        recurrenceType: task.recurrenceType,
        recurrenceIntervalDays: task.recurrenceIntervalDays,
        seriesId: task.seriesId,
      });
    },
    [addTask, tasks],
  );

  const completeTask = useCallback(
    async (task: Task) => {
      if (task.completed) return;

      const execute = async () => {
        try {
          await updateTask({ ...task, completed: true, completedAt: new Date() });
          await createNextRecurringOccurrence(task);
          notify('success', 'Muito bem. Você concluiu esta tarefa.');
        } catch (error) {
          notify('error', error instanceof Error ? error.message : 'Não foi possível concluir a tarefa.');
        }
      };

      if (confirmCriticalActions) {
        Alert.alert('Confirmar conclusão', 'Confirmar conclusão desta tarefa?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => void execute() },
        ]);
        return;
      }

      await execute();
    },
    [confirmCriticalActions, createNextRecurringOccurrence, notify, updateTask],
  );

  const applyDelete = useCallback(
    async (task: Task, scope: DeleteScope) => {
      try {
        if (scope === 'single' || !task.seriesId) {
          await deleteTask(task.id);
          notify('success', 'Tarefa excluída.');
          return;
        }

        const referenceDate = parseTaskDate(task).getTime();
        const taskIds = tasks
          .filter((item) => item.seriesId === task.seriesId)
          .filter((item) => parseTaskDate(item).getTime() >= referenceDate)
          .map((item) => item.id);

        await deleteTasks(taskIds);
        notify('success', 'Tarefa e próximas excluídas.');
      } catch (error) {
        notify('error', error instanceof Error ? error.message : 'Não foi possível excluir a tarefa.');
      }
    },
    [deleteTask, deleteTasks, notify, tasks],
  );

  const deleteWithRequiredConfirmations = useCallback(
    (task: Task) => {
      Alert.alert('Excluir tarefa', 'Deseja realmente excluir esta tarefa?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            if (!task.seriesId || !task.recurrenceType) {
              void applyDelete(task, 'single');
              return;
            }

            Alert.alert(
              'Escopo da recorrência',
              'O que deseja excluir? Só esta tarefa ou Esta e as próximas?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Só esta', onPress: () => void applyDelete(task, 'single') },
                { text: 'Esta e próximas', onPress: () => void applyDelete(task, 'future') },
              ],
            );
          },
        },
      ]);
    },
    [applyDelete],
  );

  const allTaskDates = useMemo(() => {
    const unique = new Set<string>();

    tasks.forEach((task) => {
      unique.add(startOfDay(parseTaskDate(task)).toISOString());
    });

    return [...unique].map((value) => new Date(value)).sort((a, b) => a.getTime() - b.getTime());
  }, [tasks]);

  const navigableDates = useMemo(() => {
    const today = startOfDay(new Date());
    const unique = new Set(allTaskDates.map((date) => startOfDay(date).toISOString()));
    unique.add(today.toISOString());

    return [...unique].map((value) => new Date(value)).sort((a, b) => a.getTime() - b.getTime());
  }, [allTaskDates]);

  const previousTaskDate = useMemo(() => {
    const selected = startOfDay(selectedDate).getTime();
    let previous: Date | null = null;

    for (const date of navigableDates) {
      if (date.getTime() < selected) {
        previous = date;
        continue;
      }

      break;
    }

    return previous;
  }, [navigableDates, selectedDate]);

  const nextTaskDate = useMemo(() => {
    const selected = startOfDay(selectedDate).getTime();
    return navigableDates.find((date) => date.getTime() > selected) || null;
  }, [navigableDates, selectedDate]);

  const dayTasks = useMemo(() => {
    return tasks
      .filter((task) => isSameDay(parseTaskDate(task), selectedDate))
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return Number(a.completed) - Number(b.completed);
        }

        const aDate = buildTaskDateTime(a).getTime();
        const bDate = buildTaskDateTime(b).getTime();
        return aDate - bDate;
      });
  }, [selectedDate, tasks]);

  const homeTasks = useMemo<HomeTaskItem[]>(() => {
    const now = new Date();

    return dayTasks.map((task) => {
      const taskDate = parseTaskDate(task);
      const isOverdue =
        !task.completed && Boolean(task.reminderTime) && buildTaskDateTime(task).getTime() < now.getTime();

      return {
        id: task.id,
        title: task.title,
        dateLabel: formatDate(taskDate),
        timeLabel: task.reminderTime || undefined,
        statusLabel: task.completed ? 'Concluída' : 'Pendente',
        hasOverdueWarning: isOverdue,
        overdueWarningText: isOverdue ? 'Horário previsto já passou.' : undefined,
        isCompleted: task.completed,
        isRecurring: Boolean(task.recurrenceType),
        sourceTask: task,
      };
    });
  }, [dayTasks]);

  const historyItems = useMemo<HomeHistoryItem[]>(() => {
    const filtered = tasks.filter((task) => {
      if (historyFilter === 'completed') return task.completed;
      return !task.completed;
    });

    const getRelevantDate = (task: Task) => {
      if (task.completed) {
        return task.completedAt instanceof Date ? task.completedAt : task.updatedAt;
      }

      return parseTaskDate(task);
    };

    return filtered
      .sort((a, b) => getRelevantDate(b).getTime() - getRelevantDate(a).getTime())
      .map((task) => ({
        id: task.id,
        title: task.title,
        relevantDateLabel: formatDate(getRelevantDate(task)),
        relevantDatePrefix: task.completed ? 'Concluída em' : 'Agendado para',
        statusLabel: task.completed ? 'Concluída' : 'Pendente',
      }));
  }, [historyFilter, tasks]);

  const dayTitle = useMemo(() => {
    const today = startOfDay(new Date());
    if (isSameDay(selectedDate, today)) {
      return 'Hoje';
    }

    return formatDate(selectedDate);
  }, [selectedDate]);

  const goToPreviousDay = useCallback(() => {
    if (!previousTaskDate) {
      return;
    }

    setSelectedDate(startOfDay(previousTaskDate));
  }, [previousTaskDate]);

  const goToNextDay = useCallback(() => {
    if (!nextTaskDate) {
      return;
    }

    setSelectedDate(startOfDay(nextTaskDate));
  }, [nextTaskDate]);

  const onSelectDueDate = useCallback((date: Date) => {
    const normalized = startOfDay(date);
    setDueDate(normalized);
    setDateInput(formatDate(normalized));
  }, []);

  const nextFormStep = useCallback(() => {
    if (formStep === 'title') {
      if (!titleInput.trim()) {
        notify('warning', 'O que você precisa fazer?');
        return;
      }

      setFormStep('dateTime');
      return;
    }

    if (formStep === 'dateTime') {
      if (!dueDate) {
        notify('warning', 'Escolha uma data para continuar.');
        return;
      }

      if (isPastDate(dueDate)) {
        notify('warning', 'Escolha uma data de hoje em diante para continuar.');
        return;
      }

      if (isSimplifiedMode) {
        void submitTask();
        return;
      }

      setFormStep('recurrence');
      return;
    }

    void submitTask();
  }, [dueDate, formStep, isSimplifiedMode, notify, submitTask, titleInput]);

  return {
    isLoading: loading || settingsLoading,
    isSimplifiedMode,
    reinforcedFeedback,
    dayTitle,
    homeTasks,
    historyItems,
    historyFilter,
    showHistoryFilters: !isSimplifiedMode,
    showForm,
    formStep,
    titleInput,
    dateInput,
    dueDate,
    timeInput,
    isAnytime,
    recurrenceChoice,
    showPreviousDayButton: !isSimplifiedMode && Boolean(previousTaskDate),
    showNextDayButton: !isSimplifiedMode && Boolean(nextTaskDate),
    toast,
    setShowForm,
    setTitleInput,
    setTimeInput,
    setIsAnytime,
    setHistoryFilter,
    setRecurrenceChoice,
    setToast,
    onSelectDueDate,
    onGoToPreviousDay: goToPreviousDay,
    onGoToNextDay: goToNextDay,
    onCloseForm: closeForm,
    onNextFormStep: nextFormStep,
    onSaveTask: submitTask,
    onCompleteTask: completeTask,
    onDeleteTask: deleteWithRequiredConfirmations,
    onShowCustomRecurrenceInfo: () =>
      Alert.alert('Recorrência personalizada', 'Esta opção estará disponível em breve.'),
  };
};
