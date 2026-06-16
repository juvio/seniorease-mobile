import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';
import { validateEmail, validatePassword } from '../../shared/utils/validators';

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: string, displayName: string): Promise<User> {
    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!validatePassword(password)) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    if (displayName.trim().length === 0) {
      throw new Error('Nome é obrigatório');
    }

    return this.authRepository.signup(email, password, displayName);
  }
}
