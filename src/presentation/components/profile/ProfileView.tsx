import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';
import { ProfileActionCard } from './ProfileActionCard';
import { AppTopBar } from '../shared/AppTopBar';
import { screenScaffoldStyles } from '../shared/screenScaffoldStyles';

interface ProfileActionItem {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  tone?: 'default' | 'danger';
  onPress: () => void;
}

interface ProfileViewProps {
  isLoading: boolean;
  displayName: string;
  email: string;
  initial: string;
  memberSince: string;
  actions: ProfileActionItem[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  isLoading,
  displayName,
  email,
  initial,
  memberSince,
  actions,
}) => {
  if (isLoading) {
    return (
      <View style={screenScaffoldStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={screenScaffoldStyles.container}
      contentContainerStyle={screenScaffoldStyles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <AppTopBar actionLabel="Menu" />

      <Text style={styles.title}>Meu perfil</Text>
      <Text style={styles.subtitle}>Gerencie sua conta, preferencias e seguranca.</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.memberSince}>Membro desde: {memberSince}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <ProfileActionCard
            key={action.id}
            title={action.title}
            subtitle={action.subtitle}
            actionLabel={action.actionLabel}
            tone={action.tone}
            onPress={action.onPress}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    marginTop: spacing.normal,
    color: colors.textSecondary,
    fontSize: fontSizes.medium,
  },
  title: {
    fontSize: fontSizes.extraLarge + 2,
    color: '#1E1B4B',
    fontWeight: '700',
    marginBottom: spacing.normal,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: '#63636B',
    marginBottom: spacing.spacious,
  },
  profileCard: {
    backgroundColor: '#ECEDEF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DADF',
    padding: spacing.spacious,
    marginBottom: spacing.spacious,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4A67F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.normal,
  },
  avatarText: {
    color: colors.background,
    fontSize: fontSizes.large + 6,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.large,
    color: '#2B2B2E',
    fontWeight: '700',
    marginBottom: spacing.compact,
  },
  email: {
    fontSize: fontSizes.medium,
    color: '#5D5D66',
    marginBottom: spacing.compact,
  },
  memberSince: {
    fontSize: fontSizes.small + 1,
    color: '#6A6A71',
  },
  actionsContainer: {
    marginTop: spacing.normal,
  },
});
