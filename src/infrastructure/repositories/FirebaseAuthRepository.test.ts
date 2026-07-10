import { FirebaseAuthRepository } from './FirebaseAuthRepository';

const mockCreateUser = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();

const authState: { currentUser: any } = {
  currentUser: null,
};

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUser(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

jest.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}));

jest.mock('../firebase/config', () => ({
  auth: authState,
  db: { mocked: true },
}));

describe('FirebaseAuthRepository', () => {
  const repository = new FirebaseAuthRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    authState.currentUser = null;
  });

  it('signup cria usuario no auth e persiste perfil', async () => {
    mockCreateUser.mockResolvedValue({
      user: { uid: 'u-1', email: 'aluna.mobile@universidade.edu.br' },
    });
    mockDoc.mockReturnValue('user-doc-ref');
    mockSetDoc.mockResolvedValue(undefined);

    const user = await repository.signup('aluna.mobile@universidade.edu.br', 'Senha@123', 'Ana Aluna');

    expect(user.id).toBe('u-1');
    expect(user.displayName).toBe('Ana Aluna');
    expect(mockSetDoc).toHaveBeenCalledTimes(1);
  });

  it('login mapeia dados do firestore com fallback', async () => {
    const createdAt = new Date('2026-02-01T08:00:00.000Z');
    const updatedAt = new Date('2026-02-03T08:00:00.000Z');

    mockSignIn.mockResolvedValue({
      user: { uid: 'u-2', email: 'estudante.backend@universidade.edu.br' },
    });
    mockDoc.mockReturnValue('user-doc-ref');
    mockGetDoc.mockResolvedValue({
      data: () => ({
        displayName: 'Carlos Estudante',
        createdAt: { toDate: () => createdAt },
        updatedAt: { toDate: () => updatedAt },
      }),
    });

    const user = await repository.login('estudante.backend@universidade.edu.br', 'Senha@123');

    expect(user.displayName).toBe('Carlos Estudante');
    expect(user.createdAt).toEqual(createdAt);
    expect(user.updatedAt).toEqual(updatedAt);
  });

  it('getCurrentUser retorna null sem usuario autenticado', async () => {
    authState.currentUser = null;

    const user = await repository.getCurrentUser();

    expect(user).toBeNull();
    expect(mockGetDoc).not.toHaveBeenCalled();
  });

  it('getCurrentUser retorna dados mapeados quando autenticado', async () => {
    authState.currentUser = { uid: 'u-3', email: 'pesquisadora.software@universidade.edu.br' };
    mockDoc.mockReturnValue('user-doc-ref');
    mockGetDoc.mockResolvedValue({
      data: () => ({
        displayName: 'Patricia Pesquisadora',
      }),
    });

    const user = await repository.getCurrentUser();

    expect(user?.id).toBe('u-3');
    expect(user?.displayName).toBe('Patricia Pesquisadora');
  });

  it('updateProfile falha sem usuario autenticado', async () => {
    await expect(repository.updateProfile('Novo Nome')).rejects.toThrow('Usuário não autenticado');
  });

  it('logout chama signOut', async () => {
    mockSignOut.mockResolvedValue(undefined);

    await repository.logout();

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
