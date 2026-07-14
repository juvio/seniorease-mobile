import { AuthService } from './services/AuthService';
import { SettingsService } from './services/SettingsService';
import { TasksService } from './services/TasksService';
import { FirebaseAuthRepository } from '../infrastructure/repositories/FirebaseAuthRepository';
import { FirebaseSettingsRepository } from '../infrastructure/repositories/FirebaseSettingsRepository';
import { FirebaseTasksRepositoryImpl } from '../infrastructure/repositories/FirebaseTasksRepositoryImpl';

const authRepository = new FirebaseAuthRepository();
const settingsRepository = new FirebaseSettingsRepository();
const tasksRepository = new FirebaseTasksRepositoryImpl();

export const appContainer = {
  authService: new AuthService(authRepository),
  settingsService: new SettingsService(settingsRepository),
  tasksService: new TasksService(tasksRepository),
};
