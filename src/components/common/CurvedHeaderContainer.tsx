import React from 'react';
import { StyleSheet, View, Animated, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export interface CurvedHeaderContainerProps {
  scrollY: Animated.Value;
  children: React.ReactNode;
  curveRadius?: number;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const CurvedHeaderContainer: React.FC<CurvedHeaderContainerProps> = ({
  scrollY,
  children,
  curveRadius = 24,
  style,
  onLayout,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const backdropOpacity = scrollY.interpolate({
    inputRange: [0, 36],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[styles.wrapper, style]}
      onLayout={onLayout}
      pointerEvents="box-none"
    >
      {/* Animated Curved Elevated Backdrop Layer */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.backdrop,
          {
            top: -insets.top,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderBottomLeftRadius: curveRadius,
            borderBottomRightRadius: curveRadius,
            opacity: backdropOpacity,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme.isDark ? 0.3 : 0.06,
            shadowRadius: 10,
            elevation: 4,
          },
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomWidth: 1,
  },
});
