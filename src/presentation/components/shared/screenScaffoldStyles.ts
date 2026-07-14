import { StyleSheet } from 'react-native';
import { spacing } from '../../../shared/constants/theme';

export const screenScaffoldStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F7',
  },
  contentContainer: {
    paddingHorizontal: spacing.normal,
    paddingTop: spacing.spacious,
    paddingBottom: spacing.spacious,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F7',
  },
});
