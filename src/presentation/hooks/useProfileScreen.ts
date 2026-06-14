import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';

interface ProfileScreenHookParams {
  onLogout?: () => void;
}

interface ProfileActionItem {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  tone?: 'default' | 'danger';
  onPress: () => void;
}

const formatJoinDate = (value: Date | string | undefined) => {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
};

export const useProfileScreen = ({ onLogout }: ProfileScreenHookParams) => {
  const { user, loading, logout } = useAuth();

  const handleLogout = useCallback(() => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            onLogout?.();
          } catch (error) {
            Alert.alert('Erro', 'Nao foi possivel fazer logout');
          }
        },
      },
    ]);
  }, [logout, onLogout]);

  const handlePlaceholderAction = useCallback((label: string) => {
    Alert.alert('Em desenvolvimento', `${label} estara disponivel em breve.`);
  }, []);

  const actions = useMemo<ProfileActionItem[]>(
    () => [
      {
        id: 'edit-profile',
        title: 'Dados pessoais',
        subtitle: 'Edite nome e dados da conta',
        actionLabel: 'Editar',
        onPress: () => handlePlaceholderAction('Editar dados pessoais'),
      },
      {
        id: 'notifications',
        title: 'Notificacoes',
        subtitle: 'Ajuste lembretes e alertas',
        actionLabel: 'Configurar',
        onPress: () => handlePlaceholderAction('Configurar notificacoes'),
      },
      {
        id: 'help',
        title: 'Ajuda',
        subtitle: 'Veja orientacoes e suporte',
        actionLabel: 'Abrir',
        onPress: () => handlePlaceholderAction('Abrir ajuda'),
      },
      {
        id: 'logout',
        title: 'Encerrar sessao',
        subtitle: 'Sair da conta neste dispositivo',
        actionLabel: 'Sair',
        tone: 'danger',
        onPress: handleLogout,
      },
    ],
    [handleLogout, handlePlaceholderAction]
  );

  return {
    isLoading: loading || !user,
    displayName: user?.displayName || '',
    email: user?.email || '',
    initial: user?.displayName?.[0]?.toUpperCase() || 'U',
    memberSince: formatJoinDate(user?.createdAt),
    actions,
  };
};
