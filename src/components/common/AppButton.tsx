import React from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
}) => {
  const theme = useTheme();

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';

    return {
      backgroundColor: isPrimary
        ? pressed
          ? theme.colors.buttonGoldPressed
          : theme.colors.buttonGold
        : isSecondary
        ? theme.colors.surfaceElevated
        : 'transparent',
      borderColor: isOutline ? theme.colors.border : 'transparent',
      borderWidth: isOutline ? 1 : 0,
      opacity: disabled ? 0.6 : 1,
    };
  };

  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: { paddingVertical: SPACING.xs + 2, paddingHorizontal: SPACING.md, minHeight: 36 },
    md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, minHeight: 48 },
    lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, minHeight: 56 },
  };

  const textColor =
    variant === 'primary' ? theme.colors.buttonGoldText : theme.colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        getContainerStyle(pressed),
        { transform: [{ scale: pressed ? 0.98 : 1.0 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leftIcon}
          <AppText
            variant={size === 'sm' ? 'bodySmall' : 'titleSmall'}
            color={textColor}
            style={styles.label}
          >
            {label}
          </AppText>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  label: {
    fontWeight: '700',
  },
});
