export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'; // 12px, 16px, 20px, 24px
  contrast: 'normal' | 'high' | 'maximum'; // Normal, High contrast, Maximum contrast
  spacing: 'compact' | 'normal' | 'spacious' | 'extra-spacious'; // Espaçamento entre elementos
  interfaceMode: 'basic' | 'advanced'; // Simplificado ou avançado
  reinforcedFeedback: boolean; // Feedback visual reforçado
  confirmCriticalActions: boolean; // Confirmação adicional antes de ações críticas
}

export interface NotificationSettings {
  enableReminders: boolean;
  reminderTime: string; // HH:mm format
  enableTaskCompletion: boolean;
}

export interface Settings {
  userId: string;
  accessibility: AccessibilitySettings;
  notifications: NotificationSettings;
  createdAt: Date;
  updatedAt: Date;
}
