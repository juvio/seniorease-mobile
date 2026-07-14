import React from 'react';
import { ProfileView } from '../components/profile/ProfileView';
import { useProfileScreen } from '../hooks/useProfileScreen';

export const ProfileScreen: React.FC = () => {
  const screenState = useProfileScreen();

  return <ProfileView {...screenState} />;
};
