import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: false, error: null });
  });

  it('setUser atualiza usuario autenticado', () => {
    useAuthStore.getState().setUser({
      id: 'u1',
      email: 'aluno.ti@universidade.edu.br',
      displayName: 'Aluno TI',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(useAuthStore.getState().user?.id).toBe('u1');
  });

  it('setLoading e setError atualizam estado transiente', () => {
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().setError('falha');

    expect(useAuthStore.getState().loading).toBe(true);
    expect(useAuthStore.getState().error).toBe('falha');
  });

  it('logout limpa user e error', () => {
    useAuthStore.setState({
      user: { id: 'u2', email: 'estudante.dev@universidade.edu.br', displayName: 'Estudante Dev', createdAt: new Date(), updatedAt: new Date() },
      loading: false,
      error: 'erro',
    });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
