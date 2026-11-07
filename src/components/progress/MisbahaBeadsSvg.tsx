import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';

export const MisbahaBeadsSvg: React.FC = () => {
  return (
    <View style={styles.beadsSvgWrapper}>
      <Svg width={80} height={70} viewBox="0 0 80 70">
        <Defs>
          <RadialGradient id="jadeBead" cx="35%" cy="35%" r="65%">
            <Stop offset="0%" stopColor="#2CD194" />
            <Stop offset="50%" stopColor="#114B36" />
            <Stop offset="100%" stopColor="#08291D" />
          </RadialGradient>
          <RadialGradient id="goldBead" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FFF2D6" />
            <Stop offset="50%" stopColor="#CCA15F" />
            <Stop offset="100%" stopColor="#8A642B" />
          </RadialGradient>
          <LinearGradient id="tasselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#CCA15F" />
            <Stop offset="100%" stopColor="#78531D" />
          </LinearGradient>
        </Defs>

        <Circle cx="16" cy="30" r="6.5" fill="url(#jadeBead)" />
        <Circle cx="26" cy="18" r="6.5" fill="url(#jadeBead)" />
        <Circle cx="40" cy="14" r="7.5" fill="url(#goldBead)" />
        <Circle cx="54" cy="18" r="6.5" fill="url(#jadeBead)" />
        <Circle cx="64" cy="30" r="6.5" fill="url(#jadeBead)" />
        <Circle cx="58" cy="44" r="6.5" fill="url(#jadeBead)" />
        <Circle cx="22" cy="44" r="6.5" fill="url(#jadeBead)" />

        <Path d="M 38 46 L 42 46 L 44 54 L 36 54 Z" fill="url(#goldBead)" />
        <Circle cx="40" cy="45" r="2.5" fill="#FFF2D6" />
        <Path d="M 36 54 C 34 64, 46 64, 44 54 Z" fill="url(#tasselGrad)" />
        <Path d="M 38 60 L 34 68 M 40 60 L 40 69 M 42 60 L 46 68" stroke="#CCA15F" strokeWidth="1" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  beadsSvgWrapper: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
