import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Svg, { Rect, Circle, G } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { WELCOME_THEME } from '@/constants/theme';

export interface IslamicWatermarkProps {
  size?: number;
  opacity?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const IslamicWatermark: React.FC<IslamicWatermarkProps> = ({
  size = 280,
  opacity = 0.35,
  color,
  style,
}) => {
  const theme = useTheme();
  const strokeColor = color || theme.colors.watermark || WELCOME_THEME.watermark;
  const half = size / 2;
  const squareSize = size * 0.62;
  const squareOffset = (size - squareSize) / 2;

  return (
    <View style={[styles.container, { width: size, height: size, opacity }, style]} pointerEvents="none">
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G stroke={strokeColor} strokeWidth="1.6" fill="none">
          {/* Base Square */}
          <Rect
            x={squareOffset}
            y={squareOffset}
            width={squareSize}
            height={squareSize}
          />

          {/* 45-degree Rotated Square (Rub el Hizb) */}
          <Rect
            x={squareOffset}
            y={squareOffset}
            width={squareSize}
            height={squareSize}
            transform={`rotate(45 ${half} ${half})`}
          />

          {/* Outer Concentric Circle */}
          <Circle cx={half} cy={half} r={size * 0.22} strokeWidth="1.4" />

          {/* Inner Concentric Circle */}
          <Circle cx={half} cy={half} r={size * 0.12} strokeWidth="1.2" />

          {/* Center Subtle Dot */}
          <Circle cx={half} cy={half} r={3} fill={strokeColor} />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
