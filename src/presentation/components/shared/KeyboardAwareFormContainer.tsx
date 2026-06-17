import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { screenScaffoldStyles } from './screenScaffoldStyles';

interface KeyboardAwareFormContainerProps {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
  scrollEnabledWithKeyboardOnly?: boolean;
}

export const KeyboardAwareFormContainer: React.FC<KeyboardAwareFormContainerProps> = ({
  children,
  containerStyle,
  contentContainerStyle,
  keyboardVerticalOffset = 0,
  scrollEnabledWithKeyboardOnly = true,
}) => {
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      Keyboard.dismiss();
    };
  }, []);

  const scrollEnabled = scrollEnabledWithKeyboardOnly ? keyboardVisible : true;

  return (
    <KeyboardAvoidingView
      style={[screenScaffoldStyles.container, containerStyle]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        contentContainerStyle={[styles.defaultScrollContent, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContent}>{children}</View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  defaultScrollContent: {
    flexGrow: 1,
  } as ViewStyle,
  innerContent: {
    flex: 1,
  } as ViewStyle,
};
