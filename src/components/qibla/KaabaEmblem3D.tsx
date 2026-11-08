import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export interface KaabaEmblem3DProps {
  isAligned: boolean;
}

export const KaabaEmblem3D: React.FC<KaabaEmblem3DProps> = ({ isAligned }) => {
  const theme = useTheme();

  const cubeBg = theme.isDark ? theme.colors.surfaceElevated : theme.colors.text;
  const cubeBorder = isAligned ? theme.colors.accent : theme.colors.border;
  const auraFill = isAligned ? theme.colors.secondaryTint : theme.colors.surfaceElevated;

  return (
    <View style={styles.kaabaContainer}>
      <Svg width={40} height={40} viewBox="0 0 40 40">
        {/* Isometric Cube Shadow / Aura */}
        <Circle
          cx="20"
          cy="20"
          r="16"
          fill={auraFill}
        />

        {/* Main Cube Body */}
        <Rect
          x="6"
          y="6"
          width="28"
          height="28"
          rx="6"
          fill={cubeBg}
          stroke={cubeBorder}
          strokeWidth="1.5"
        />

        {/* Gold Embroidered Kiswah Ribbon (Hizam) */}
        <Rect
          x="6"
          y="14"
          width="28"
          height="4.5"
          fill={theme.colors.accent}
        />

        {/* Kaaba Golden Door (Bab al-Kaaba) */}
        <Rect
          x="22"
          y="21"
          width="6.5"
          height="10"
          rx="1"
          fill={theme.colors.accent}
        />

        {/* Isometric Top Bevel Highlight */}
        <Path
          d="M 7 11 L 20 7 L 33 11"
          stroke={theme.colors.border}
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
