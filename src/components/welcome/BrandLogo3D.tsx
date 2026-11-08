import React from 'react';
import { StyleSheet, View, Image, StyleProp, ViewStyle } from 'react-native';

export interface BrandLogo3DProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const APP_LOGO = require('../../../assets/icons/app-logo-tight.png');

export const BrandLogo3D: React.FC<BrandLogo3DProps> = ({ size = 120, style }) => {
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
});
