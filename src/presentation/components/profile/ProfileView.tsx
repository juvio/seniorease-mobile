import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSizes, spacing, colors } from '../../../shared/constants/theme';
import { ProfileActionCard } from './ProfileActionCard';
import { AppTopBar } from '../shared/AppTopBar';
import { screenScaffoldStyles } from '../shared/screenScaffoldStyles';
import { KeyboardAwareFormContainer } from '../shared/KeyboardAwareFormContainer';
import { useAccessibilityTheme } from '../../hooks/useAccessibilityTheme';

interface ProfileActionItem {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
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
  const { scaleFont, scaleSpacing, ui } = useAccessibilityTheme();

  if (isLoading) {
    return (
      <SafeAreaView style={[screenScaffoldStyles.container, { backgroundColor: ui.screenBackground }]} edges={['top', 'bottom']}>
        <View style={[screenScaffoldStyles.loadingContainer, { backgroundColor: ui.screenBackground }]}>
          <ActivityIndicator size="large" color={ui.chipSelectedBackground} />
          <Text style={[styles.loadingText, { marginTop: scaleSpacing(spacing.normal), color: ui.textSecondary, fontSize: scaleFont(fontSizes.medium) }]}>
            Carregando perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAwareFormContainer
      containerStyle={{ backgroundColor: ui.screenBackground }}
      contentContainerStyle={screenScaffoldStyles.contentContainer}
      scrollEnabledWithKeyboardOnly={false}
      safeAreaEdges={['top']}
    >
        <AppTopBar />

      <Text style={[styles.title, { fontSize: scaleFont(fontSizes.extraLarge + 2), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.normal) }]}>
        Meu perfil
      </Text>
      <Text style={[styles.subtitle, { fontSize: scaleFont(fontSizes.medium), color: ui.textSecondary, marginBottom: scaleSpacing(spacing.spacious) }]}>
        Gerencie sua conta, preferencias e seguranca.
      </Text>

      <View style={[styles.profileCard, { backgroundColor: ui.cardBackground, borderColor: ui.cardBorder, padding: scaleSpacing(spacing.spacious), marginBottom: scaleSpacing(spacing.spacious) }]}>
        <View style={[styles.avatar, { backgroundColor: ui.chipSelectedBackground, marginRight: scaleSpacing(spacing.normal) }]}>
          <Text style={[styles.avatarText, { fontSize: scaleFont(fontSizes.large + 6) }]}>{initial}</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={[styles.name, { fontSize: scaleFont(fontSizes.large), color: ui.textPrimary, marginBottom: scaleSpacing(spacing.compact) }]}>{displayName}</Text>
          <Text style={[styles.email, { fontSize: scaleFont(fontSizes.medium), color: ui.textSecondary, marginBottom: scaleSpacing(spacing.compact) }]}>{email}</Text>
          <Text style={[styles.memberSince, { fontSize: scaleFont(fontSizes.small + 1), color: ui.textSecondary }]}>Membro desde: {memberSince}</Text>
        </View>
      </View>

        <View style={[styles.actionsContainer, { marginTop: scaleSpacing(spacing.normal) }]}>
          {actions.map((action) => (
            <ProfileActionCard
              key={action.id}
              title={action.title}
              subtitle={action.subtitle}
              actionLabel={action.actionLabel}
              onPress={action.onPress}
            />
          ))}
        </View>
    </KeyboardAwareFormContainer>
  );
};

const styles = StyleSheet.create({
  loadingText: {
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.background,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
  },
  email: {
  },
  memberSince: {
  },
  actionsContainer: {
  },
});
