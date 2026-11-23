import React, { useState, useEffect, ReactNode } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Keyboard,
  Platform,
  ViewStyle,
  StyleProp,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { AppBottomSheetHeader } from './AppBottomSheetHeader';
import { SPACING, RADIUS } from '@/constants/theme';

export interface AppBottomSheetProps {
  visible: boolean;
  onClose?: () => void;
  disableDismiss?: boolean;
  title?: string;
  badgeText?: string;
  subtitleText?: string;
  icon?: ReactNode;
  showCloseButton?: boolean;
  maxHeight?: number | `${number}%`;
  minHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/**
 * Reusable Bottom Sheet matching the "What's New" sheet design language.
 * Automatically shifts above the keyboard when an input is focused and
 * returns to its exact bottom position when the keyboard closes.
 */
export const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  visible,
  onClose,
  disableDismiss = false,
  title,
  badgeText,
  subtitleText,
  icon,
  showCloseButton = true,
  maxHeight = '84%',
  minHeight,
  containerStyle,
  children,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates?.height || 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  if (!visible) return null;

  const isKeyboardOpen = keyboardHeight > 0;
  const bottomPadding = isKeyboardOpen
    ? SPACING.md
    : Math.max(insets.bottom, SPACING.md) + SPACING.sm;

  const availableAboveKeyboard = Math.max(
    260,
    windowHeight - keyboardHeight - Math.max(insets.top, SPACING.lg) - SPACING.md
  );

  const handleClose = () => {
    Keyboard.dismiss();
    onClose?.();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
      onRequestClose={disableDismiss ? undefined : handleClose}
    >
      <View
        style={[
          styles.backdrop,
          isKeyboardOpen && { paddingBottom: keyboardHeight },
        ]}
      >
        {!disableDismiss && onClose && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
            accessibilityLabel="Close bottom sheet"
          />
        )}

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: bottomPadding,
              maxHeight: isKeyboardOpen ? availableAboveKeyboard : maxHeight,
              minHeight: isKeyboardOpen && minHeight ? Math.min(minHeight, availableAboveKeyboard) : minHeight,
            },
            containerStyle,
          ]}
        >
          <View style={[styles.handleBar, { backgroundColor: theme.colors.border }]} />

          {title && (
            <AppBottomSheetHeader
              title={title}
              badgeText={badgeText}
              subtitleText={subtitleText}
              icon={icon}
              showCloseButton={showCloseButton}
              disableDismiss={disableDismiss}
              onClose={handleClose}
            />
          )}

          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    borderTopWidth: 1.2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingTop: SPACING.sm + 2,
    paddingHorizontal: SPACING.xl,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.md,
    opacity: 0.7,
  },
});
