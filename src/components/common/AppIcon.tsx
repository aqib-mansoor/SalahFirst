import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, StyleProp, ImageStyle } from 'react-native';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | number;

export interface AppIconProps {
  source: ImageSourcePropType;
  size?: IconSize;
  tintColor?: string;
  style?: StyleProp<ImageStyle>;
}

const SIZE_MAP: Record<'sm' | 'md' | 'lg' | 'xl', number> = {
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48,
};

export const AppIcon: React.FC<AppIconProps> = ({
  source,
  size = 'md',
  tintColor,
  style,
}) => {
  const dimension = typeof size === 'number' ? size : SIZE_MAP[size];

  return (
    <Image
      source={source}
      style={[
        { width: dimension, height: dimension },
        tintColor ? { tintColor } : null,
        style,
      ]}
      resizeMode="contain"
    />
  );
};

