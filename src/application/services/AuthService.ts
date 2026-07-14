import { SignupUseCase } from '../../domain/usecases/SignupUseCase';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class AuthService {
  private authRepository: IAuthRepository;
  private signupUseCase: SignupUseCase;
  private loginUseCase: LoginUseCase;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
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
