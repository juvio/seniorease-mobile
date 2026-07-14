import { useCallback, useMemo } from 'react';
import { showAppAlert } from '../../shared/stores/alertStore';
import { useAuth } from './useAuth';

interface ProfileActionItem {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  onPress: () => void;
}

const formatJoinDate = (value: Date | string | undefined) => {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
};

export const useProfileScreen = () => {
  const { user, loading } = useAuth();

  const handlePlaceholderAction = useCallback((label: string) => {
    showAppAlert({
      title: 'Em desenvolvimento',
      message: `${label} estara disponivel em breve.`,
    });
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
    ],
    [handlePlaceholderAction]
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
