import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Path,
  G,
  Circle,
} from 'react-native-svg';
import { RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface BrandLogo3DProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const BrandLogo3D: React.FC<BrandLogo3DProps> = ({ size = 112, style }) => {
  const theme = useTheme();
  const half = size / 2;
  const starSquare = size * 0.44;
  const starOffset = (size - starSquare) / 2;

  return (
    <View style={[styles.shadowWrapper, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* 3D Metallic Gold Gradient for Borders & Emblem */}
          <LinearGradient id="metallicGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.accentLight} />
            <Stop offset="50%" stopColor={theme.colors.accent} />
            <Stop offset="100%" stopColor={theme.colors.buttonGoldPressed} />
          </LinearGradient>

          {/* 3D Background Gradient for the Emblem Container */}
          <RadialGradient
            id="squircleBg"
            cx="50%"
            cy="35%"
            rx="60%"
            ry="60%"
            fx="50%"
            fy="30%"
          >
            <Stop offset="0%" stopColor={theme.colors.surfaceElevated} />
            <Stop offset="70%" stopColor={theme.colors.surface} />
            <Stop offset="100%" stopColor={theme.colors.textInverse} />
          </RadialGradient>
        </Defs>

        {/* Squircle Base with 3D Depth */}
        <Rect
          x={2}
          y={2}
          width={size - 4}
          height={size - 4}
          rx={RADIUS.xxl}
          fill="url(#squircleBg)"
          stroke="url(#metallicGold)"
          strokeWidth="1.8"
        />

        {/* Inner Subtle Golden Inset Rim */}
        <Rect
          x={5}
          y={5}
          width={size - 10}
          height={size - 10}
          rx={RADIUS.xxl - 3}
          fill="none"
          stroke={theme.colors.accentLight}
          strokeWidth="0.5"
          opacity="0.3"
        />

        {/* Geometric Rub el Hizb (Overlapping Rotated Squares) */}
        <G stroke="url(#metallicGold)" strokeWidth="1.2" fill="none" opacity="0.6">
          <Rect
            x={starOffset}
            y={starOffset}
            width={starSquare}
            height={starSquare}
          />
          <Rect
            x={starOffset}
            y={starOffset}
            width={starSquare}
            height={starSquare}
            transform={`rotate(45 ${half} ${half})`}
          />
        </G>

        {/* Central Mosque Icon (Dome with Finial & Arch Door) */}
        <G stroke="url(#metallicGold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Crescent / Finial Pin on top of dome */}
          <Circle cx={half} cy={half - 17} r="1.2" fill="url(#metallicGold)" />

          {/* Main Mosque Dome Silhouette */}
          <Path
            d={`
              M ${half - 15} ${half + 13}
              L ${half - 15} ${half + 1}
              C ${half - 15} ${half - 7}, ${half - 6} ${half - 15}, ${half} ${half - 15}
              C ${half + 6} ${half - 15}, ${half + 15} ${half - 7}, ${half + 15} ${half + 1}
              L ${half + 15} ${half + 13}
              Z
            `}
          />

          {/* Base Foundation Line */}
          <Path d={`M ${half - 19} ${half + 13} L ${half + 19} ${half + 13}`} strokeWidth="2.4" />

          {/* Center Arched Doorway */}
          <Path
            d={`
              M ${half - 5} ${half + 13}
              L ${half - 5} ${half + 5}
              C ${half - 5} ${half + 1}, ${half + 5} ${half + 1}, ${half + 5} ${half + 5}
              L ${half + 5} ${half + 13}
            `}
            strokeWidth="1.8"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

