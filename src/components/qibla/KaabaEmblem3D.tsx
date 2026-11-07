import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export interface KaabaEmblem3DProps {
  isAligned: boolean;
}

export const KaabaEmblem3D: React.FC<KaabaEmblem3DProps> = ({ isAligned }) => {
  const theme = useTheme('light');

  return (
    <View style={styles.kaabaContainer}>
      <Svg width={38} height={38} viewBox="0 0 38 38">
        {/* Isometric Cube Shadow / Aura */}
        <Circle
          cx="19"
          cy="20"
          r="14"
          fill={isAligned ? 'rgba(204,161,95,0.3)' : 'rgba(0,0,0,0.1)'}
        />

        {/* Main Cube Body */}
        <Rect
          x="5"
          y="5"
          width="28"
          height="28"
          rx="6"
          fill="#18181B"
          stroke={isAligned ? theme.colors.accent : '#27272A'}
          strokeWidth="1.5"
        />

        {/* Gold Embroidered Kiswah Ribbon (Hizam) */}
        <Rect
          x="5"
          y="13"
          width="28"
          height="4.5"
          fill={theme.colors.accent}
        />

        {/* Kaaba Golden Door (Bab al-Kaaba) */}
        <Rect
          x="20"
          y="20"
          width="6.5"
          height="10"
          rx="1"
          fill={theme.colors.accent}
        />

        {/* Isometric Top Bevel Highlight */}
        <Path
          d="M 6 10 L 19 6 L 32 10"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.2"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  kaabaContainer: {
    position: 'absolute',
    top: 14,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
