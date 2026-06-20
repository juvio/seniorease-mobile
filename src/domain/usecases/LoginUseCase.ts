import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';
import { validateEmail } from '../../shared/utils/validators';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!password.trim()) {
      throw new Error('Senha e obrigatoria');
    }

    return this.authRepository.login(email, password);
  }
}
