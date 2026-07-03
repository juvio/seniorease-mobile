import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSizes, spacing } from '../../../shared/constants/theme';
import { TaskActivityCard } from './TaskActivityCard';
import { AppTopBar } from '../shared/AppTopBar';
import { screenScaffoldStyles } from '../shared/screenScaffoldStyles';
import { KeyboardAwareFormContainer } from '../shared/KeyboardAwareFormContainer';
import { FeedbackToast } from '../shared/FeedbackToast';
import { HomeHistoryItem, HomeTaskItem } from '../../hooks/useTasksScreen';
import { TaskFormModal } from '../shared/TaskFormModal';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

type HistoryFilter = 'completed' | 'pending';
type FormStep = 'title' | 'dateTime' | 'recurrence';
type RecurrenceChoice = 'none' | 'weekly';

interface TasksViewProps {
  isLoading: boolean;
  isSimplifiedMode: boolean;
  reinforcedFeedback: boolean;
  dayTitle: string;
  homeTasks: HomeTaskItem[];
  historyItems: HomeHistoryItem[];
  historyFilter: HistoryFilter;
  showHistoryFilters: boolean;
  showForm: boolean;
  formStep: FormStep;
  titleInput: string;
  dateInput: string;
  dueDate: Date | null;
  timeInput: string;
  isAnytime: boolean;
  recurrenceChoice: RecurrenceChoice;
  showPreviousDayButton: boolean;
  showNextDayButton: boolean;
  toast: { visible: boolean; type: 'success' | 'warning' | 'error'; message: string };
  setShowForm: (value: boolean) => void;
  setTitleInput: (value: string) => void;
  setTimeInput: (value: string) => void;
  setIsAnytime: (value: boolean) => void;
  setHistoryFilter: (value: HistoryFilter) => void;
  setRecurrenceChoice: (value: RecurrenceChoice) => void;
  setToast: (value: { visible: boolean; type: 'success' | 'warning' | 'error'; message: string }) => void;
  onSelectDueDate: (value: Date) => void;
  onGoToPreviousDay: () => void;
  onGoToNextDay: () => void;
  onCloseForm: () => void;
  onNextFormStep: () => void;
  onSaveTask: () => void;
  onCompleteTask: (task: HomeTaskItem['sourceTask']) => void;
  onDeleteTask: (task: HomeTaskItem['sourceTask']) => void;
  onShowCustomRecurrenceInfo: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  isLoading,
  isSimplifiedMode,
  reinforcedFeedback,
  dayTitle,
  homeTasks,
  historyItems,
  historyFilter,
  showHistoryFilters,
  showForm,
  formStep,
  titleInput,
  dateInput,
  dueDate,
  timeInput,
  isAnytime,
  recurrenceChoice,
  showPreviousDayButton,
  showNextDayButton,
  toast,
  setShowForm,
  setTitleInput,
  setTimeInput,
  setIsAnytime,
  setHistoryFilter,
  setRecurrenceChoice,
  setToast,
  onSelectDueDate,
  onGoToPreviousDay,
  onGoToNextDay,
  onCloseForm,
  onNextFormStep,
  onSaveTask,
  onCompleteTask,
  onDeleteTask,
  onShowCustomRecurrenceInfo,
}) => {
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();
  const emptyStateTitle = dayTitle === 'Hoje' ? 'Sem tarefas para hoje' : `Sem tarefas para ${dayTitle}`;

  if (isLoading) {
    return (
      <SafeAreaView
        style={[screenScaffoldStyles.container, { backgroundColor: ui.screenBackground }]}
        edges={['top', 'bottom']}
      >
        <View style={[screenScaffoldStyles.loadingContainer, { backgroundColor: ui.screenBackground }]}>
          <ActivityIndicator size="large" color={ui.chipSelectedBackground} />
          <Text
            style={[
              styles.loadingText,
              {
                marginTop: scaleSpacing(spacing.normal),
                fontSize: scaleFont(fontSizes.medium),
                color: ui.textSecondary,
              },
            ]}
          >
            Carregando tarefas...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAwareFormContainer
      containerStyle={{ backgroundColor: ui.screenBackground }}
      contentContainerStyle={screenScaffoldStyles.contentContainer}
      scrollEnabledWithKeyboardOnly={false}
      safeAreaEdges={['top']}
    >
      <AppTopBar />

      <FeedbackToast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, visible: false })}
        autoHideMs={reinforcedFeedback ? 4200 : 2400}
        reinforced={reinforcedFeedback}
      />

      {isSimplifiedMode ? (
        <View style={[styles.headerRow, { marginBottom: scaleSpacing(spacing.normal), gap: scaleSpacing(spacing.normal) }]}>
          <Text style={[styles.title, { fontSize: scaleFont(fontSizes.large + 2), color: ui.textPrimary }]}>{dayTitle}</Text>
          {!showForm && (
            <TouchableOpacity
              style={[
                styles.newButtonCompact,
                {
                  backgroundColor: ui.primaryButtonBackground,
                  paddingHorizontal: scaleSpacing(spacing.normal),
                },
              ]}
              onPress={() => setShowForm(true)}
              accessibilityRole="button"
              accessibilityLabel="Adicionar nova tarefa"
            >
              <Text style={[styles.newButtonText, { color: ui.primaryButtonText, fontSize: scaleFont(fontSizes.small + 1) }]}>
                + Nova tarefa
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={[styles.navigationRow, { marginBottom: scaleSpacing(spacing.normal), gap: scaleSpacing(spacing.normal) }]}>
          {showPreviousDayButton ? (
            <TouchableOpacity
              style={[styles.dayArrowButton, { backgroundColor: ui.chipBackground }]}
              onPress={onGoToPreviousDay}
              accessibilityRole="button"
              accessibilityLabel="Ir para o dia anterior com tarefas"
            >
              <Text style={[styles.dayArrowText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.medium) }]}>{'<'}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.dayArrowSpacer} />
          )}

          <View style={styles.dayLabelContainer}>
            <Text style={[styles.title, styles.dayLabelCentered, { fontSize: scaleFont(fontSizes.large + 2), color: ui.textPrimary }]}>
              {dayTitle}
            </Text>
          </View>

          {showNextDayButton ? (
            <TouchableOpacity
              style={[styles.dayArrowButton, { backgroundColor: ui.chipBackground }]}
              onPress={onGoToNextDay}
              accessibilityRole="button"
              accessibilityLabel="Ir para o próximo dia com tarefas"
            >
              <Text style={[styles.dayArrowText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.medium) }]}>{'>'}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.dayArrowSpacer} />
          )}
        </View>
      )}

      {!showForm && !isSimplifiedMode ? (
        <View style={[styles.newTaskButtonRow, { marginBottom: scaleSpacing(spacing.normal) }]}>
          <TouchableOpacity
            style={[
              styles.newButtonCompact,
              {
                backgroundColor: ui.primaryButtonBackground,
                paddingHorizontal: scaleSpacing(spacing.normal),
              },
            ]}
            onPress={() => setShowForm(true)}
            accessibilityRole="button"
            accessibilityLabel="Adicionar nova tarefa"
          >
            <Text style={[styles.newButtonText, { color: ui.primaryButtonText, fontSize: scaleFont(fontSizes.small + 1) }]}>+ Nova tarefa</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Text
        style={[
          styles.subtitle,
          { fontSize: scaleFont(fontSizes.small + 1), color: ui.textSecondary, marginBottom: scaleSpacing(spacing.normal) },
        ]}
      >
        Suas tarefas do dia selecionado
      </Text>

      <View
        style={[
          styles.listContainer,
          {
            backgroundColor: ui.cardBackground,
            borderColor: ui.cardBorder,
            padding: scaleSpacing(spacing.normal),
            marginBottom: scaleSpacing(spacing.spacious),
          },
        ]}
      >
        {homeTasks.length === 0 ? (
          <View style={[styles.emptyState, { paddingVertical: scaleSpacing(spacing.extraSpacious * 2) }]}>
            <Text
              style={[
                styles.emptyStateTitle,
                { fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.compact) },
              ]}
            >
              {emptyStateTitle}
            </Text>
            <Text style={[styles.emptyStateDescription, { fontSize: scaleFont(fontSizes.small + 1), color: ui.textSecondary }]}>
              Toque em Nova tarefa para começar.
            </Text>
          </View>
        ) : (
          homeTasks.map((item) => (
            <TaskActivityCard
              key={item.id}
              title={item.title}
              dateLabel={item.dateLabel}
              timeLabel={item.timeLabel}
              statusLabel={item.statusLabel}
              showOverdueWarning={item.hasOverdueWarning}
              overdueWarningText={item.overdueWarningText}
              reinforcedFeedback={reinforcedFeedback}
              onComplete={() => onCompleteTask(item.sourceTask)}
              onDelete={() => onDeleteTask(item.sourceTask)}
            />
          ))
        )}
      </View>

      <TaskFormModal
        visible={showForm}
        isSimplifiedMode={isSimplifiedMode}
        formStep={formStep}
        titleInput={titleInput}
        dateInput={dateInput}
        dueDate={dueDate}
        timeInput={timeInput}
        isAnytime={isAnytime}
        recurrenceChoice={recurrenceChoice}
        setTitleInput={setTitleInput}
        onSelectDueDate={onSelectDueDate}
        setTimeInput={setTimeInput}
        setIsAnytime={setIsAnytime}
        setRecurrenceChoice={setRecurrenceChoice}
        onClose={onCloseForm}
        onNextStep={onNextFormStep}
        onSave={onSaveTask}
        onShowCustomRecurrenceInfo={onShowCustomRecurrenceInfo}
      />

      <View
        style={[
          styles.historyCard,
          {
            marginTop: scaleSpacing(spacing.spacious),
            backgroundColor: ui.cardBackground,
            borderColor: ui.cardBorder,
            padding: scaleSpacing(spacing.spacious),
            marginBottom: scaleSpacing(spacing.spacious),
          },
        ]}
      >
        <Text
          style={[
            styles.historyTitle,
            { fontSize: scaleFont(fontSizes.medium), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.normal) },
          ]}
        >
          Histórico
        </Text>
        {showHistoryFilters ? (
          <View style={[styles.historyFilterRow, { gap: scaleSpacing(spacing.compact), marginBottom: scaleSpacing(spacing.normal) }]}>
            <TouchableOpacity
              style={[
                styles.historyFilterButton,
                { backgroundColor: ui.chipBackground, paddingHorizontal: scaleSpacing(spacing.normal) },
                historyFilter === 'completed' && styles.historyFilterButtonSelected,
                historyFilter === 'completed' && { backgroundColor: ui.chipSelectedBackground },
              ]}
              onPress={() => setHistoryFilter('completed')}
            >
              <Text
                style={[
                  styles.historyFilterText,
                  { color: ui.chipText, fontSize: scaleFont(fontSizes.small) },
                  historyFilter === 'completed' && styles.historyFilterTextSelected,
                  historyFilter === 'completed' && { color: ui.chipSelectedText },
                ]}
              >
                Concluídas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.historyFilterButton,
                { backgroundColor: ui.chipBackground, paddingHorizontal: scaleSpacing(spacing.normal) },
                historyFilter === 'pending' && styles.historyFilterButtonSelected,
                historyFilter === 'pending' && { backgroundColor: ui.chipSelectedBackground },
              ]}
              onPress={() => setHistoryFilter('pending')}
            >
              <Text
                style={[
                  styles.historyFilterText,
                  { color: ui.chipText, fontSize: scaleFont(fontSizes.small) },
                  historyFilter === 'pending' && styles.historyFilterTextSelected,
                  historyFilter === 'pending' && { color: ui.chipSelectedText },
                ]}
              >
                Pendentes
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {historyItems.length === 0 ? (
          <Text style={[styles.historyEmpty, { color: ui.textSecondary, fontSize: scaleFont(fontSizes.small + 1) }]}>
            Sem itens no histórico.
          </Text>
        ) : (
          historyItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.historyItem,
                {
                  borderTopColor: ui.cardBorder,
                  paddingTop: scaleSpacing(spacing.normal),
                  marginTop: scaleSpacing(spacing.normal),
                },
              ]}
            >
              <View style={[styles.historyInfo, { paddingRight: scaleSpacing(spacing.normal) }]}>
                <Text style={[styles.historyItemTitle, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small + 1) }]}>
                  {item.title}
                </Text>
                <Text style={[styles.historyItemMeta, { color: ui.textSecondary, fontSize: scaleFont(fontSizes.small) }]}>
                  {item.relevantDatePrefix} {item.relevantDateLabel}
                </Text>
              </View>
              <View
                style={[
                  styles.historyStatusChip,
                  { paddingHorizontal: scaleSpacing(spacing.normal) },
                  item.statusLabel === 'Concluída' ? styles.historyStatusDone : styles.historyStatusPending,
                  item.statusLabel === 'Concluída'
                    ? { backgroundColor: ui.successSurface }
                    : { backgroundColor: ui.warningSurface },
                ]}
              >
                <Text style={[styles.historyStatusText, { color: ui.textPrimary, fontSize: scaleFont(fontSizes.small) }]}>
                  {item.statusLabel}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </KeyboardAwareFormContainer>
  );
};

const styles = StyleSheet.create({
  loadingText: {
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateNavRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayArrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayArrowSpacer: {
    width: 44,
    height: 44,
  },
  dayArrowText: {
    fontWeight: '800',
  },
  dayLabelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabelCentered: {
    textAlign: 'center',
  },
  navButton: {
    borderRadius: 999,
    minHeight: 40,
    justifyContent: 'center',
  },
  navButtonText: {
    fontWeight: '700',
  },
  listContainer: {
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontWeight: '700',
  },
  emptyStateDescription: {
  },
  newButton: {
    backgroundColor: '#1E2028',
    minHeight: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newButtonText: {
    fontWeight: '700',
  },
  newButtonCompact: {
    minHeight: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newTaskButtonRow: {
    alignItems: 'flex-end',
  },
  historyCard: {
    borderRadius: 16,
    borderWidth: 1,
  },
  historyTitle: {
    fontWeight: '700',
  },
  historyFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  historyFilterButton: {
    borderRadius: 999,
    minHeight: 36,
    justifyContent: 'center',
  },
  historyFilterButtonSelected: {
    backgroundColor: '#4A67F0',
  },
  historyFilterText: {
    fontWeight: '700',
  },
  historyFilterTextSelected: {
    color: '#FFFFFF',
  },
  historyEmpty: {
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  historyInfo: {
    flex: 1,
  },
  historyItemTitle: {
    fontWeight: '700',
    marginBottom: 2,
  },
  historyItemMeta: {
  },
  historyStatusChip: {
    minHeight: 28,
    borderRadius: 999,
    justifyContent: 'center',
  },
  historyStatusDone: {
    backgroundColor: '#CFEEDB',
  },
  historyStatusPending: {
    backgroundColor: '#F2E8B9',
  },
  historyStatusText: {
    fontWeight: '700',
  },
});
