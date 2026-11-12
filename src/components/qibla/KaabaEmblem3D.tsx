import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export interface KaabaEmblem3DProps {
  isAligned: boolean;
  size?: number;
}

/**
 * Authentic, precision vector Kaaba emblem.
 * Rendered with accurate proportions, golden Kiswah band (Hizam), and golden door (Bab al-Kaaba).
 */
export const KaabaEmblem3D: React.FC<KaabaEmblem3DProps> = ({ isAligned, size = 38 }) => {
  const theme = useTheme();

  const cubeBg = '#141716'; // Deep authentic basalt black of Kaaba masonry
  const gold = theme.colors.accent; // Authentic Kiswah gold thread

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        {/* Subtle drop shadow base */}
        <Rect
          x="6"
          y="7"
          width="28"
          height="28"
          rx="5"
          fill="rgba(0,0,0,0.25)"
        />

        {/* Main Kaaba Monolith Body */}
        <Rect
          x="6"
          y="6"
          width="28"
          height="28"
          rx="4.5"
          fill={cubeBg}
          stroke={isAligned ? gold : 'rgba(255,255,255,0.18)'}
          strokeWidth="1.2"
        />

        {/* Upper Decorative Gold Border */}
        <Rect
          x="6"
          y="10"
          width="28"
          height="1"
          fill={gold}
          opacity={0.6}
        />

        {/* Master Gold Embroidered Kiswah Belt (Hizam) */}
        <Rect
          x="6"
          y="12.5"
          width="28"
          height="4.5"
          fill={gold}
        />

        {/* Hizam Calligraphic Texture Details */}
        <Path
          d="M 8 14.7 H 12 M 14 14.7 H 20 M 22 14.7 H 32"
          stroke="#000000"
          strokeWidth="0.8"
          opacity={0.55}
          strokeLinecap="round"
        />

        {/* Kaaba Golden Door (Bab al-Kaaba) on Eastern Wall */}
        <Rect
          x="21"
          y="19"
          width="7"
          height="12"
          rx="1"
          fill={gold}
        />
        {/* Door frame & arch detail */}
        <Rect
          x="22.2"
          y="20.5"
          width="4.6"
          height="9"
          rx="0.6"
          fill="none"
          stroke="#000000"
          strokeWidth="0.6"
          opacity={0.5}
        />

        {/* Shadhirwan (Marble Base Ring) */}
        <Path
          d="M 6 33.5 H 34"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
