import { Settings } from '../../domain/entities/Settings';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';

export class SettingsService {
  private settingsRepository: ISettingsRepository;

  constructor(settingsRepository: ISettingsRepository) {
    this.settingsRepository = settingsRepository;
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
