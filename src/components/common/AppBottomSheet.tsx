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
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';
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
            <View style={styles.header}>
              {icon && (
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: theme.isDark
                        ? 'rgba(16, 185, 129, 0.14)'
                        : theme.colors.mintTint,
                      borderColor: theme.isDark
                        ? theme.colors.primaryDark
                        : theme.colors.border,
                    },
                  ]}
                >
                  {icon}
                </View>
              )}

              <View style={styles.headerText}>
                <AppText
                  variant="titleMedium"
                  color={theme.colors.textPrimary}
                  style={styles.title}
                  numberOfLines={1}
                >
                  {title}
                </AppText>

                {(badgeText || subtitleText) && (
                  <View style={styles.subRow}>
                    {badgeText && (
                      <View
                        style={[
                          styles.badgePill,
                          {
                            backgroundColor: theme.isDark
                              ? theme.colors.surfaceSubtle
                              : theme.colors.mintTint,
                            borderColor: theme.isDark
                              ? theme.colors.border
                              : theme.colors.primary,
                          },
                        ]}
                      >
                        <AppText
                          variant="caption"
                          color={theme.colors.primary}
                          style={styles.badgeText}
                        >
                          {badgeText}
                        </AppText>
                      </View>
                    )}
                    {subtitleText && (
                      <AppText
                        variant="caption"
                        color={theme.colors.textSecondary}
                        numberOfLines={1}
                        style={styles.subtitleText}
                      >
                        {badgeText ? `• ${subtitleText}` : subtitleText}
                      </AppText>
                    )}
                  </View>
                )}
              </View>

              {showCloseButton && !disableDismiss && onClose && (
                <Pressable
                  onPress={handleClose}
                  hitSlop={12}
                  style={[styles.closeBtn, { backgroundColor: theme.colors.surfaceSubtle }]}
                >
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M18 6L6 18M6 6l12 12"
                      stroke={theme.colors.textSecondary}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </Svg>
                </Pressable>
              )}
            </View>
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
    borderTopWidth: 1,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    width: '100%',
    elevation: 20,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    width: '100%',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerText: { flex: 1, gap: 3 },
  title: { fontWeight: '800', fontSize: 17, letterSpacing: -0.2 },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs + 2 },
  badgePill: {
    paddingHorizontal: SPACING.xs + 3,
    paddingVertical: 1,
    borderRadius: RADIUS.xs + 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badgeText: { fontWeight: '700', fontSize: 10, letterSpacing: 0.2 },
  subtitleText: { flexShrink: 1 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
