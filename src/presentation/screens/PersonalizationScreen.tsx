import React from 'react';
import { PersonalizationView } from '../components/personalization/PersonalizationView';
import { usePersonalizationScreen } from '../hooks/usePersonalizationScreen';

interface PersonalizationScreenProps {
  onSave?: () => void;
}

export const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({ onSave }) => {
  const screenState = usePersonalizationScreen({ onSave });

  return <PersonalizationView {...screenState} />;
};
