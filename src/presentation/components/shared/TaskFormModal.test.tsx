import { render } from '@testing-library/react-native';
import { TaskFormModal } from './TaskFormModal';

jest.mock('../../hooks/useAccessibilityTheme', () => ({
  useAccessibilityTheme: () => ({
    scaleFont: (value: number) => value,
    scaleSpacing: (value: number) => value,
    ui: {
      overlay: 'rgba(0,0,0,0.35)',
      screenBackground: '#FFFFFF',
      cardBorder: '#D8DADF',
      textPrimary: '#111111',
      textSecondary: '#666666',
      chipBackground: '#ECEDEF',
      chipSelectedBackground: '#4A67F0',
      chipText: '#111111',
      chipSelectedText: '#FFFFFF',
    },
  }),
}));

describe('TaskFormModal accessibility', () => {
  it('expoe controles de recorrencia e acao com labels acessiveis', async () => {
    const { getByLabelText } = await render(
      <TaskFormModal
        visible
        isSimplifiedMode={false}
        formStep="recurrence"
        titleInput="Estudar"
        dateInput="14/07/2026"
        dueDate={new Date('2026-07-14T00:00:00.000Z')}
        timeInput="09:00"
        isAnytime={false}
        recurrenceChoice="weekly"
        setTitleInput={() => undefined}
        onSelectDueDate={() => undefined}
        setTimeInput={() => undefined}
        setIsAnytime={() => undefined}
        setRecurrenceChoice={() => undefined}
        onClose={() => undefined}
        onNextStep={() => undefined}
        onSave={() => undefined}
        onShowCustomRecurrenceInfo={() => undefined}
      />
    );

    expect(getByLabelText('Recorrencia nao')).toBeTruthy();
    expect(getByLabelText('Recorrencia semanal')).toBeTruthy();
    expect(getByLabelText('Recorrencia personalizada')).toBeTruthy();
    expect(getByLabelText('Salvar tarefa')).toBeTruthy();
  });
});
