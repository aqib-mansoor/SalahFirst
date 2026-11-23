import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Polygon, Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export interface KaabaEmblem3DProps {
  isAligned: boolean;
  size?: number;
}

/**
 * Authentic Isometric 3D Kaaba Emblem.
 * Features true isometric perspective, dual-facet illumination (eastern lit / southern shadow),
 * wraparound golden Kiswah band (Hizam), and golden Bab al-Kaaba door.
 */
export const KaabaEmblem3D: React.FC<KaabaEmblem3DProps> = ({ isAligned, size = 38 }) => {
  const theme = useTheme();
  const gold = theme.colors.accent;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 44 44">
        <Defs>
          {/* Subtle Ground Shadow */}
          <LinearGradient id="groundShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </LinearGradient>
          {/* Gold Belt Shading */}
          <LinearGradient id="goldLit" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFE082" />
            <Stop offset="100%" stopColor={gold} />
          </LinearGradient>
        </Defs>

        {/* 1. Ground Drop Shadow */}
        <Polygon points="22,39 37,30 22,23 7,30" fill="url(#groundShadow)" />

        {/* 2. Marble Base Ring (Shadhirwan) */}
        <Polygon
          points="6,29.5 22,38 38,29.5 38,31 22,39.5 6,31"
          fill="rgba(255, 255, 255, 0.45)"
        />

        {/* 3. Right / Southern Face (Deep Basalt Shadow) */}
        <Polygon
          points="22,19 36,11.5 36,29 22,36.5"
          fill="#101412"
        />

        {/* 4. Left / Eastern Face (Lit Basalt Wall) */}
        <Polygon
          points="8,11.5 22,19 22,36.5 8,29"
          fill="#1C221F"
        />

        {/* 5. Top Roof Surface */}
        <Polygon
          points="22,4 36,11.5 22,19 8,11.5"
          fill="#252D29"
          stroke={isAligned ? gold : 'rgba(255, 255, 255, 0.15)'}
          strokeWidth="0.8"
        />

        {/* 6. Kiswah Golden Belt (Hizam) - Left / Eastern Wall */}
        <Polygon
          points="8,15 22,22.5 22,26 8,18.5"
          fill="url(#goldLit)"
        />
        {/* Belt Calligraphic Texture Stitching */}
        <Path
          d="M 10,17.2 L 14,19.3 M 16,20.3 L 20,22.4"
          stroke="#000000"
          strokeWidth="0.6"
          opacity={0.5}
        />

        {/* 7. Kiswah Golden Belt (Hizam) - Right / Southern Wall */}
        <Polygon
          points="22,22.5 36,15 36,18.5 22,26"
          fill={gold}
          opacity={0.82}
        />

        {/* 8. Golden Door (Bab al-Kaaba) on Eastern Wall */}
        <Polygon
          points="13,22.8 19,26 19,33.5 13,30.3"
          fill="url(#goldLit)"
        />
        {/* Door Inset Arch Detail */}
        <Polygon
          points="14.2,24.2 17.8,26.1 17.8,32.3 14.2,30.4"
          fill="none"
          stroke="#000000"
          strokeWidth="0.5"
          opacity={0.6}
        />

        {/* 9. Top Wall Bevel Rim (Light Edge) */}
        <Path
          d="M 8,11.5 L 22,19 L 36,11.5"
          stroke={isAligned ? gold : 'rgba(255, 255, 255, 0.35)'}
          strokeWidth="0.7"
          fill="none"
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
