import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { PrayerTimeIcon } from '@/components/common';
import { RADIUS } from '@/constants/theme';

export interface AnimatedCelestialEmblemProps {
  prayerName: string;
  size?: number;
}

export const AnimatedCelestialEmblem: React.FC<AnimatedCelestialEmblemProps> = ({
  prayerName,
  size = 38,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth levitating float loop (up and down by 3.5px)
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -3.5,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle breathing ambient halo pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [floatAnim, pulseAnim]);

  const haloOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.75],
  });

  const haloScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.08],
  });

  return (
    <View style={styles.container}>
      {/* Animated Breathing Ambient Halo */}
      <Animated.View
        style={[
          styles.glowAura,
          {
            opacity: haloOpacity,
            transform: [{ scale: haloScale }],
          },
        ]}
      />

      {/* Floating 3D Celestial Pedestal */}
      <Animated.View
        style={[
          styles.emblemChassis,
          {
            transform: [{ translateY: floatAnim }],
          },
        ]}
      >
        <PrayerTimeIcon prayer={prayerName} size={size} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowAura: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(247, 207, 87, 0.20)',
    borderWidth: 1,
    borderColor: 'rgba(247, 207, 87, 0.35)',
  },
  emblemChassis: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderWidth: 1.5,
    borderColor: 'rgba(247, 207, 87, 0.60)',
    borderTopColor: 'rgba(255, 255, 255, 0.70)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});

