import { FirebaseAuthRepository } from '../../infrastructure/repositories/FirebaseAuthRepository';
import { SignupUseCase } from '../../domain/usecases/SignupUseCase';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';
import { User } from '../../domain/entities/User';

export class AuthService {
  private authRepository: FirebaseAuthRepository;
  private signupUseCase: SignupUseCase;
  private loginUseCase: LoginUseCase;

  constructor() {
    this.authRepository = new FirebaseAuthRepository();
    this.signupUseCase = new SignupUseCase(this.authRepository);
    this.loginUseCase = new LoginUseCase(this.authRepository);
  }

  async signup(email: string, password: string, displayName: string): Promise<User> {
    return this.signupUseCase.execute(email, password, displayName);
  }

  async login(email: string, password: string): Promise<User> {
    return this.loginUseCase.execute(email, password);
  }

  async logout(): Promise<void> {
    await this.authRepository.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }

  async updateProfile(displayName: string): Promise<void> {
    return this.authRepository.updateProfile(displayName);
  }
}
