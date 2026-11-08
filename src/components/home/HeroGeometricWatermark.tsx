import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

export interface HeroGeometricWatermarkProps {
  color?: string;
  opacity?: number;
}

export const HeroGeometricWatermark: React.FC<HeroGeometricWatermarkProps> = ({
  color = '#F7CF57',
  opacity = 0.12,
}) => {
  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={220} height={220} viewBox="0 0 200 200" opacity={opacity}>
        {/* Outer Concentric Circle */}
        <Circle cx="100" cy="100" r="88" stroke={color} strokeWidth="1" fill="none" />
        
        {/* Tilted Sacred Square (45 degrees) */}
        <Rect
          x="38"
          y="38"
          width="124"
          height="124"
          stroke={color}
          strokeWidth="1"
          fill="none"
          transform="rotate(45 100 100)"
        />

        {/* Regular Upright Square */}
        <Rect
          x="38"
          y="38"
          width="124"
          height="124"
          stroke={color}
          strokeWidth="0.8"
          strokeDasharray="3 3"
          fill="none"
        />

        {/* Middle Concentric Circle */}
        <Circle cx="100" cy="100" r="54" stroke={color} strokeWidth="1" fill="none" />

        {/* Inner Circle & Center Node */}
        <Circle cx="100" cy="100" r="24" stroke={color} strokeWidth="0.9" fill="none" />
        <Circle cx="100" cy="100" r="6" fill={color} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -15,
    right: -25,
    zIndex: 0,
  },
});
