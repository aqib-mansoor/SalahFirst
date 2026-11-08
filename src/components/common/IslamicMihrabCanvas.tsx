import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect, G } from 'react-native-svg';

export interface IslamicMihrabCanvasProps {
  style?: ViewStyle;
  goldColor?: string;
  opacity?: number;
}

/**
 * IslamicMihrabCanvas
 * Lightweight, high-performance SVG canvas rendering an architectural Mihrab
 * (prayer arch) silhouette with fine arabesque geometric lattice.
 */
export const IslamicMihrabCanvas: React.FC<IslamicMihrabCanvasProps> = ({
  style,
  goldColor = '#F7CF57',
  opacity = 0.16,
}) => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container, style]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="goldArchGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={goldColor} stopOpacity={opacity * 1.5} />
            <Stop offset="40%" stopColor={goldColor} stopOpacity={opacity * 0.9} />
            <Stop offset="100%" stopColor={goldColor} stopOpacity={0.02} />
          </LinearGradient>
          <LinearGradient id="emeraldDepth" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.06} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0.18} />
          </LinearGradient>
        </Defs>

        {/* Subtle Ambient Depth Layer */}
        <Rect x="0" y="0" width="360" height="220" fill="url(#emeraldDepth)" />

        {/* Central Architectural Mihrab Pointed Arch */}
        <G stroke={goldColor} strokeWidth="1" fill="none" opacity={opacity}>
          {/* Outer Grand Arch */}
          <Path
            d="M 60,220 L 60,110 Q 60,40 180,10 Q 300,40 300,110 L 300,220"
            strokeWidth="1.4"
          />
          {/* Inner Cusped Mihrab Line */}
          <Path
            d="M 80,220 L 80,120 Q 80,60 180,32 Q 280,60 280,120 L 280,220"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          {/* Arch Apex Finial & Star Emblem */}
          <Path
            d="M 180,10 L 180,2 C 180,0 180,0 180,0"
            strokeWidth="2"
          />
          <Path
            d="M 180,16 L 183,23 L 190,20 L 187,27 L 194,30 L 187,33 L 190,40 L 183,37 L 180,44 L 177,37 L 170,40 L 173,33 L 166,30 L 173,27 L 170,20 L 177,23 Z"
            fill="url(#goldArchGlow)"
            strokeWidth="0.6"
          />

          {/* Right & Left Classical Arabesque Rosettes */}
          <Path
            d="M 30,30 L 45,30 M 37.5,22.5 L 37.5,37.5 M 32,25 L 43,35 M 32,35 L 43,25"
            strokeWidth="0.75"
            opacity={0.6}
          />
          <Path
            d="M 330,30 L 315,30 M 322.5,22.5 L 322.5,37.5 M 328,25 L 317,35 M 328,35 L 317,25"
            strokeWidth="0.75"
            opacity={0.6}
          />

          {/* Geometric Spandrel Lattice Lines */}
          <Path d="M 0,0 L 90,90 M 0,40 L 70,110 M 40,0 L 110,70" strokeWidth="0.5" opacity={0.35} />
          <Path d="M 360,0 L 270,90 M 360,40 L 290,110 M 320,0 L 250,70" strokeWidth="0.5" opacity={0.35} />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 20,
  },
});

