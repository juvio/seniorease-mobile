import { FirebaseSettingsRepository } from '@infrastructure/repositories/FirebaseSettingsRepository';
import { Settings } from '../../domain/entities/Settings';

export class SettingsService {
  private settingsRepository: FirebaseSettingsRepository;

  constructor() {
    this.settingsRepository = new FirebaseSettingsRepository();
  }

  async getSettings(userId: string): Promise<Settings> {
    return this.settingsRepository.getSettings(userId);
  }

  async updateSettings(settings: Settings): Promise<void> {
    await this.settingsRepository.updateSettings(settings);
  }

  async createDefaultSettings(userId: string): Promise<Settings> {
    return this.settingsRepository.createDefaultSettings(userId);
  }
}
