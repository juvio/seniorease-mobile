import { create } from 'zustand';

export type AppAlertActionStyle = 'default' | 'cancel' | 'destructive';

export interface AppAlertAction {
  text: string;
  style?: AppAlertActionStyle;
  onPress?: () => void | Promise<void>;
}

export interface AppAlertPayload {
  title: string;
  message?: string;
  actions?: AppAlertAction[];
}

interface AlertState {
  currentAlert: AppAlertPayload | null;
  showAlert: (payload: AppAlertPayload) => void;
  closeAlert: () => void;
}

const normalizeActions = (actions?: AppAlertAction[]): AppAlertAction[] => {
  if (!actions || actions.length === 0) {
    return [{ text: 'OK', style: 'default' }];
  }

  return actions;
};

export const useAlertStore = create<AlertState>((set) => ({
  currentAlert: null,
  showAlert: (payload) =>
    set({
      currentAlert: {
        ...payload,
        actions: normalizeActions(payload.actions),
      },
    }),
  closeAlert: () => set({ currentAlert: null }),
}));

export const showAppAlert = (payload: AppAlertPayload) => {
  useAlertStore.getState().showAlert(payload);
};
