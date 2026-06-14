import React from 'react';
import { ProfileView } from '../components/profile/ProfileView';
import { useProfileScreen } from '../hooks/useProfileScreen';

interface ProfileScreenProps {
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const screenState = useProfileScreen({ onLogout });

  return <ProfileView {...screenState} />;
};
