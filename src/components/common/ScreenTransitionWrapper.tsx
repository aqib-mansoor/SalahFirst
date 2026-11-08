import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface ScreenTransitionWrapperProps {
  transitionKey: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ScreenTransitionWrapper: React.FC<ScreenTransitionWrapperProps> = ({
  transitionKey,
  children,
  style,
}) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(5)).current;

  useEffect(() => {
    opacity.setValue(0.2);
    translateY.setValue(5);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 190,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 190,
        useNativeDriver: true,
      }),
    ]).start();
  }, [transitionKey]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

