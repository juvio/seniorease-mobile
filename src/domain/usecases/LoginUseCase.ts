import { IAuthRepository } from '../../repositories/IAuthRepository';
import { User } from '../../entities/User';
import { validateEmail, validatePassword } from '../../../shared/utils/validators';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!validatePassword(password)) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    return this.authRepository.login(email, password);
  }
}
