import { SignupUseCase } from './SignupUseCase';
import { LoginUseCase } from './LoginUseCase';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

// Mock repository for testing
class MockAuthRepository implements IAuthRepository {
  private users: Map<string, User> = new Map();

  async signup(email: string, password: string, displayName: string): Promise<User> {
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

  async login(email: string, password: string): Promise<User> {
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

  async updateProfile(displayName: string): Promise<void> {
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
        'test@example.com',
        'password123',
        'Test User'
      );

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.displayName).toBe('Test User');
    });

    it('should reject invalid email', async () => {
      const useCase = new SignupUseCase(mockRepository);

      try {
        await useCase.execute('invalid-email', 'password123', 'Test User');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Email inválido');
      }
    });

    it('should reject weak password', async () => {
      const useCase = new SignupUseCase(mockRepository);

      try {
        await useCase.execute('test@example.com', 'pass', 'Test User');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('6 caracteres');
      }
    });

    it('should reject empty display name', async () => {
      const useCase = new SignupUseCase(mockRepository);

      try {
        await useCase.execute('test@example.com', 'password123', '');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Nome é obrigatório');
      }
    });
  });

  describe('LoginUseCase', () => {
    it('should login with valid credentials', async () => {
      const mockRepo = new MockAuthRepository();
      await mockRepo.signup('test@example.com', 'password123', 'Test User');

      const useCase = new LoginUseCase(mockRepo);
      const user = await useCase.execute('test@example.com', 'password123');

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should reject invalid email', async () => {
      const useCase = new LoginUseCase(mockRepository);

      try {
        await useCase.execute('invalid-email', 'password123');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Email inválido');
      }
    });
  });
});
