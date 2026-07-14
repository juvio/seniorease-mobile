import { fireEvent, render } from '@testing-library/react-native';
import { AppAlertModal } from './AppAlertModal';
import { useAlertStore } from '../../../shared/stores/alertStore';

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
      primaryButtonBackground: '#1E2028',
      primaryButtonText: '#FFFFFF',
      dangerBorder: '#B42318',
      dangerText: '#7A1C15',
      chipBackground: '#ECEDEF',
    },
  }),
}));

describe('AppAlertModal', () => {
  beforeEach(() => {
    useAlertStore.setState({ currentAlert: null });
  });

  it('renderiza botoes com labels acessiveis e executa acao', async () => {
    const onConfirm = jest.fn();

    useAlertStore.getState().showAlert({
      title: 'Confirmar tarefa',
      message: 'Deseja continuar?',
      actions: [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: onConfirm },
      ],
    });

    const { getByLabelText } = await render(<AppAlertModal />);

    const confirmButton = getByLabelText('Acao do alerta: Confirmar');
    fireEvent.press(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(useAlertStore.getState().currentAlert).toBeNull();
  });
});
