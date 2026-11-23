import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { RADIUS, SPACING, ELEVATION } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export type CardElevationVariant = keyof typeof ELEVATION;

export interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevated?: boolean;
  elevationVariant?: CardElevationVariant;
  beveled?: boolean;
  padding?: keyof typeof SPACING;
  style?: StyleProp<ViewStyle>;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  onPress,
  elevated = false,
  elevationVariant = 'card',
  beveled = true,
  padding = 'lg',
  style,
}) => {
  const theme = useTheme();

  const elevationStyle = ELEVATION[elevationVariant] || ELEVATION.card;

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
          elevationStyle,
          cardStyle,
          {
            opacity: pressed ? 0.94 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.base, elevationStyle, cardStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
});
