import { SignupUseCase } from './SignupUseCase';
import { LoginUseCase } from './LoginUseCase';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

// Mock repository for testing
class MockAuthRepository implements IAuthRepository {
  private users: Map<string, User> = new Map();

  async signup(email: string, _password: string, displayName: string): Promise<User> {
    void _password;

    const user: User = {
      id: Date.now().toString(),
      email,
      displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(email, user);
    return user;
  }

  async login(email: string, _password: string): Promise<User> {
    void _password;

    const user = this.users.get(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  async logout(): Promise<void> {
    // Mock implementation
  }

  async getCurrentUser(): Promise<User | null> {
    return null;
  }

  async updateProfile(_displayName: string): Promise<void> {
    void _displayName;

    // Mock implementation
  }
}

describe('AuthService', () => {
  let mockRepository: MockAuthRepository;

  beforeEach(() => {
    mockRepository = new MockAuthRepository();
  });

  describe('SignupUseCase', () => {
    it('should create a new user with valid credentials', async () => {
      const useCase = new SignupUseCase(mockRepository);

      const user = await useCase.execute(
        'aluno.fullstack@universidade.edu.br',
        'Password@123',
        'Aluno Full Stack'
      );

      expect(user).toBeDefined();
      expect(user.email).toBe('aluno.fullstack@universidade.edu.br');
      expect(user.displayName).toBe('Aluno Full Stack');
    });

    it('should reject invalid email', async () => {
      const useCase = new SignupUseCase(mockRepository);

      try {
        await useCase.execute('invalid-email', 'Password@123', 'Aluno Full Stack');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Email inválido');
      }
    });

    it('should reject weak password', async () => {
      const useCase = new SignupUseCase(mockRepository);

      try {
        await useCase.execute('aluno.fullstack@universidade.edu.br', 'pass', 'Aluno Full Stack');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('8 caracteres');
      }
    });

    it('should reject display name shorter than 5 characters', async () => {
      const useCase = new SignupUseCase(mockRepository);

      try {
        await useCase.execute('aluno.fullstack@universidade.edu.br', 'Password@123', 'Ana');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('5 caracteres');
      }
    });
  });

  describe('LoginUseCase', () => {
    it('should login with valid credentials', async () => {
      const mockRepo = new MockAuthRepository();
      await mockRepo.signup('aluno.fullstack@universidade.edu.br', 'Password@123', 'Aluno Full Stack');

      const useCase = new LoginUseCase(mockRepo);
      const user = await useCase.execute('aluno.fullstack@universidade.edu.br', 'Password@123');

      expect(user).toBeDefined();
      expect(user.email).toBe('aluno.fullstack@universidade.edu.br');
    });

    it('should reject invalid email', async () => {
      const useCase = new LoginUseCase(mockRepository);

      try {
        await useCase.execute('invalid-email', 'Password@123');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Email inválido');
      }
    });
  });
});
