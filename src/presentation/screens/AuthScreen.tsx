import React from 'react';
import { AuthView } from '../components/auth/AuthView';
import { useAuthScreen } from '../hooks/useAuthScreen';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const screenState = useAuthScreen({ onLoginSuccess });

  return <AuthView {...screenState} />;
};
