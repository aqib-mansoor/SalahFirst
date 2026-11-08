import React from 'react';
import { StyleSheet, View, Image, StyleProp, ViewStyle } from 'react-native';

export interface BrandLogo3DProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const APP_LOGO = require('../../../assets/splash-icon.png');

export const BrandLogo3D: React.FC<BrandLogo3DProps> = ({ size = 130, style }) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={APP_LOGO}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
});
