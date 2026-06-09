import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';
import { Settings } from '../../domain/entities/Settings';

export class FirebaseSettingsRepository implements ISettingsRepository {
  async getSettings(userId: string): Promise<Settings> {
    const settingsDoc = await getDoc(doc(db, 'users', userId, 'settings', 'preferences'));

    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      return {
        userId,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Settings;
    }

    // Return default settings if not found
    return this.createDefaultSettings(userId);
  }

  async updateSettings(settings: Settings): Promise<void> {
    await setDoc(
      doc(db, 'users', settings.userId, 'settings', 'preferences'),
      {
        accessibility: settings.accessibility,
        notifications: settings.notifications,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  async createDefaultSettings(userId: string): Promise<Settings> {
    const defaultSettings: Settings = {
      userId,
      accessibility: {
        fontSize: 'medium',
        contrast: 'normal',
        spacing: 'normal',
        interfaceMode: 'basic',
        reinforcedFeedback: true,
        confirmCriticalActions: true,
      },
      notifications: {
        enableReminders: true,
        reminderTime: '09:00',
        enableTaskCompletion: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(
      doc(db, 'users', userId, 'settings', 'preferences'),
      {
        accessibility: defaultSettings.accessibility,
        notifications: defaultSettings.notifications,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    return defaultSettings;
  }
}
