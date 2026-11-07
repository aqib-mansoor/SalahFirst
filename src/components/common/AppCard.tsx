import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevated?: boolean;
  padding?: keyof typeof SPACING;
  style?: StyleProp<ViewStyle>;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  onPress,
  elevated = false,
  padding = 'lg',
  style,
}) => {
  const theme = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: elevated
      ? theme.colors.surfaceElevated
      : theme.colors.surface,
    borderColor: theme.colors.border,
    padding: SPACING[padding],
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          cardStyle,
          pressed && { opacity: 0.88 },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.base, cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
});

