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

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold';
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
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
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
  textColor: customTextColor,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    const isPrimary = variant === 'primary';
    const isGold = variant === 'gold';
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';

    const isFilled = isPrimary || isGold;

    return {
      backgroundColor: isPrimary
        ? pressed
          ? theme.colors.primaryPressed
          : theme.colors.primary
        : isGold
        ? pressed
          ? theme.colors.buttonGoldPressed
          : theme.colors.buttonGold
        : isSecondary
        ? theme.colors.surfaceElevated
        : 'transparent',
      borderColor: isOutline ? theme.colors.border : isFilled ? theme.colors.bevelShadow : 'transparent',
      borderTopColor: isFilled ? (isPrimary ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.35)') : isOutline ? theme.colors.border : 'transparent',
      borderBottomColor: isFilled ? 'rgba(0, 0, 0, 0.25)' : isOutline ? theme.colors.border : 'transparent',
      borderWidth: isFilled || isOutline ? 1 : 0,
      opacity: disabled ? 0.6 : 1,
      elevation: isFilled ? 3 : 0,
      shadowColor: '#0A2419',
      shadowOffset: { width: 0, height: isFilled ? 2 : 0 },
      shadowOpacity: isFilled ? 0.08 : 0,
      shadowRadius: isFilled ? 6 : 0,
    };
  };

  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: { paddingVertical: SPACING.xs + 2, paddingHorizontal: SPACING.md, minHeight: 36 },
    md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, minHeight: 48 },
    lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, minHeight: 56 },
  };

  const resolvedTextColor =
    customTextColor ||
    (variant === 'primary'
      ? theme.colors.textInverse
      : variant === 'gold'
      ? theme.colors.buttonGoldText
      : theme.colors.text);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        getContainerStyle(pressed),
        { transform: [{ scale: pressed ? 0.98 : 1.0 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={resolvedTextColor} size="small" />
      ) : (
        <>
          {leftIcon}
          <AppText
            variant={size === 'sm' ? 'bodySmall' : 'titleSmall'}
            color={resolvedTextColor}
            numberOfLines={1}
            adjustsFontSizeToFit
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
