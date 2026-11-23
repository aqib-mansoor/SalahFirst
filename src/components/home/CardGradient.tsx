import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export interface CardGradientProps {
  id: string;
  colors?: [string, string];
  angle?: 'vertical' | 'diagonal' | 'horizontal';
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * CardGradient
 * Lightweight, zero-dependency SVG linear gradient for cards and buttons.
 */
export const CardGradient: React.FC<CardGradientProps> = ({
  id,
  colors = ['#0E7D4E', '#043420'],
  angle = 'diagonal',
  borderRadius = 20,
  style,
}) => {
  const coords =
    angle === 'diagonal'
      ? { x1: '0%', y1: '0%', x2: '100%', y2: '100%' }
      : angle === 'horizontal'
      ? { x1: '0%', y1: '50%', x2: '100%', y2: '50%' }
      : { x1: '50%', y1: '0%', x2: '50%', y2: '100%' };

  return (
    <View style={[StyleSheet.absoluteFill, { borderRadius, overflow: 'hidden' }, style]} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} {...coords}>
            <Stop offset="0%" stopColor={colors[0]} stopOpacity={1} />
            <Stop offset="100%" stopColor={colors[1]} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
};

