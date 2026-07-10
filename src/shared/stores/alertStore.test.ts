import { showAppAlert, useAlertStore } from './alertStore';

describe('alertStore', () => {
  beforeEach(() => {
    useAlertStore.setState({ currentAlert: null });
  });

  it('showAlert cria acao padrao OK quando actions nao e enviada', () => {
    useAlertStore.getState().showAlert({ title: 'Titulo teste' });

    const state = useAlertStore.getState();
    expect(state.currentAlert?.title).toBe('Titulo teste');
    expect(state.currentAlert?.actions).toEqual([{ text: 'OK', style: 'default' }]);
  });

  it('closeAlert limpa alerta atual', () => {
    useAlertStore.getState().showAlert({ title: 'Alerta ativo', actions: [{ text: 'Fechar' }] });
    expect(useAlertStore.getState().currentAlert).not.toBeNull();

    useAlertStore.getState().closeAlert();
    expect(useAlertStore.getState().currentAlert).toBeNull();
  });

  it('showAppAlert usa store global para exibir alerta', () => {
    showAppAlert({
      title: 'Confirmacao',
      message: 'Deseja continuar?',
      actions: [{ text: 'Cancelar', style: 'cancel' }, { text: 'Salvar' }],
    });

    const state = useAlertStore.getState();
    expect(state.currentAlert?.title).toBe('Confirmacao');
    expect(state.currentAlert?.message).toBe('Deseja continuar?');
    expect(state.currentAlert?.actions).toHaveLength(2);
  });
});
