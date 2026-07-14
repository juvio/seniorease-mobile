import React from 'react';
import { AuthView } from '../components/auth/AuthView';
import { useAuthScreen } from '../hooks/useAuthScreen';

export const AuthScreen: React.FC = () => {
  const screenState = useAuthScreen();

  return <AuthView {...screenState} />;
};
