import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';
import { Settings } from '../../domain/entities/Settings';
import { createDefaultSettings } from '../../domain/factories/settingsFactory';

const FIRESTORE_READ_TIMEOUT_MS = 12000;
const FIRESTORE_WRITE_TIMEOUT_MS = 12000;

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(timeoutMessage));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

export class FirebaseSettingsRepository implements ISettingsRepository {
  private async persistSettings(userId: string, settings: Settings): Promise<void> {
    await withTimeout(
      setDoc(doc(db, 'users', userId, 'settings', 'preferences'), {
        accessibility: settings.accessibility,
        notifications: settings.notifications,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      }),
      FIRESTORE_WRITE_TIMEOUT_MS,
      'Timeout ao salvar settings no Firestore',
    );
  }

  async getSettings(userId: string): Promise<Settings> {
    const startedAt = Date.now();

    try {
      const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
      const settingsDoc = await withTimeout(
        getDoc(settingsRef),
        FIRESTORE_READ_TIMEOUT_MS,
        'Timeout ao ler settings no Firestore',
      );

      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        const defaults = createDefaultSettings(userId);

        return {
          ...defaults,
          ...data,
          userId,
          accessibility: data.accessibility || defaults.accessibility,
          notifications: data.notifications || defaults.notifications,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Settings;
      }

      return this.createDefaultSettings(userId);
    } catch (error: any) {
      console.error(
        '[REPO] FirebaseSettingsRepository.getSettings: erro ao buscar em %dms - %s',
        Date.now() - startedAt,
        error?.message,
      );

      const fallback = createDefaultSettings(userId);

      void this.persistSettings(userId, fallback)
        .then(() => undefined)
        .catch((persistError: any) => {
          console.error(
            '[REPO] FirebaseSettingsRepository.getSettings: falha ao persistir fallback -',
            persistError?.message,
          );
        });

      return fallback;
    }
  }

  async updateSettings(settings: Settings): Promise<void> {
    await withTimeout(
      setDoc(
        doc(db, 'users', settings.userId, 'settings', 'preferences'),
        {
          accessibility: settings.accessibility,
          notifications: settings.notifications,
          updatedAt: new Date(),
        },
        { merge: true },
      ),
      FIRESTORE_WRITE_TIMEOUT_MS,
      'Timeout ao atualizar settings no Firestore',
    );
  }

  async createDefaultSettings(userId: string): Promise<Settings> {
    const defaultSettings = createDefaultSettings(userId);

    try {
      await this.persistSettings(userId, defaultSettings);
    } catch (error: any) {
      console.error(
        '[REPO] FirebaseSettingsRepository.createDefaultSettings: erro ao salvar -',
        error?.message,
      );
    }

    return defaultSettings;
  }
}
