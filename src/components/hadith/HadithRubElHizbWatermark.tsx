import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export const HadithRubElHizbWatermark: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.watermarkLayer} pointerEvents="none">
      <Svg width={110} height={110} viewBox="0 0 110 110">
        <G transform="translate(55, 55)">
          <Rect
            x="-36"
            y="-36"
            width="72"
            height="72"
            stroke={theme.colors.accent}
            strokeWidth="1.3"
            fill="none"
            opacity={0.4}
          />
          <Rect
            x="-36"
            y="-36"
            width="72"
            height="72"
            stroke={theme.colors.accent}
            strokeWidth="1.3"
            fill="none"
            transform="rotate(45)"
            opacity={0.4}
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  watermarkLayer: {
    position: 'absolute',
    top: -15,
    left: -15,
  },
});
