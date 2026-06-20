import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';
import { PASSWORD_REQUIREMENTS_TEXT, validateEmail, validatePassword } from '../../shared/utils/validators';

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: string, displayName: string): Promise<User> {
    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!validatePassword(password)) {
      throw new Error(PASSWORD_REQUIREMENTS_TEXT);
    }

    if (displayName.trim().length < 5) {
      throw new Error('Nome completo deve ter no minimo 5 caracteres');
    }

    return this.authRepository.signup(email, password, displayName);
  }
}
