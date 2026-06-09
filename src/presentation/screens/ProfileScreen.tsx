import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { fontSizes, spacing, colors } from '../../shared/constants/theme';
import { useAuth } from '../hooks/useAuth';

interface ProfileScreenProps {
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              await logout();
              onLogout?.();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível fazer logout');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.displayName[0]}</Text>
        </View>

        <Text style={styles.name}>{user.displayName}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Membro desde</Text>
          <Text style={styles.infoValue}>
            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Info', 'Funcionalidade em desenvolvimento')}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Edit profile button"
        >
          <Text style={styles.actionButtonText}>✎ Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Info', 'Funcionalidade em desenvolvimento')}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Notifications settings button"
        >
          <Text style={styles.actionButtonText}>🔔 Configurar Notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Info', 'Funcionalidade em desenvolvimento')}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Help button"
        >
          <Text style={styles.actionButtonText}>❓ Ajuda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Logout button"
        >
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>🚪 Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.normal,
  },
  title: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.spacious,
  },
  profileCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.spacious,
    alignItems: 'center',
    marginBottom: spacing.spacious,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.normal,
  },
  avatarText: {
    fontSize: fontSizes.large + 8,
    color: colors.background,
    fontWeight: 'bold',
  },
  name: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.normal / 2,
  },
  email: {
    fontSize: fontSizes.medium,
    color: colors.textSecondary,
    marginBottom: spacing.spacious,
  },
  infoSection: {
    width: '100%',
    paddingVertical: spacing.normal,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoLabel: {
    fontSize: fontSizes.medium - 2,
    color: colors.textSecondary,
    marginBottom: spacing.normal / 2,
  },
  infoValue: {
    fontSize: fontSizes.medium,
    color: colors.text,
    fontWeight: '600',
  },
  section: {
    marginTop: spacing.spacious,
  },
  sectionTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.normal,
  },
  actionButton: {
    paddingVertical: spacing.spacious,
    paddingHorizontal: spacing.normal,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: spacing.normal,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  actionButtonText: {
    fontSize: fontSizes.medium,
    color: colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    borderLeftColor: colors.error,
    marginTop: spacing.spacious,
  },
  logoutButtonText: {
    color: colors.error,
  },
});
