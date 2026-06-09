import { User } from '../entities/User';

export interface IAuthRepository {
  signup(email: string, password: string, displayName: string): Promise<User>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateProfile(displayName: string): Promise<void>;
}
