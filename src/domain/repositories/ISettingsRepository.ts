import { Settings } from '../entities/Settings';

export interface ISettingsRepository {
  getSettings(userId: string): Promise<Settings>;
  updateSettings(settings: Settings): Promise<void>;
  createDefaultSettings(userId: string): Promise<Settings>;
}
