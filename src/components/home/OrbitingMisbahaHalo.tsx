import React, { useRef } from 'react';
import { StyleSheet, View, Pressable, Animated, Vibration } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Theme } from '@/constants/theme';
import { AppText } from '@/components/common';

const BEAD_COUNT = 11;
const RADIUS_HALO = 46;
const CENTER = 56;
const BEAD_R = 4.5;

export interface OrbitingMisbahaHaloProps {
  count: number;
  target: number;
  onPress: () => void;
  theme: Theme;
}

export const OrbitingMisbahaHalo: React.FC<OrbitingMisbahaHaloProps> = ({
  count,
  target,
  onPress,
  theme,
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Compute 11 bead coordinate positions around the circle
  const beads = Array.from({ length: BEAD_COUNT }, (_, i) => {
    const angle = (i * 2 * Math.PI) / BEAD_COUNT - Math.PI / 2;
    const cx = CENTER + RADIUS_HALO * Math.cos(angle);
    const cy = CENTER + RADIUS_HALO * Math.sin(angle);
    return { id: i, cx, cy };
  });

  const handlePress = () => {
    // 1. Spring-scale bounce on central counter button
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 60, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 45, useNativeDriver: true }),
    ]).start();

    // 2. Step rotation along orbital track (1 step = 360 / 11 degrees)
    Animated.spring(rotationAnim, {
      toValue: (count + 1) * (360 / BEAD_COUNT),
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    try {
      if (count + 1 >= target) {
        Vibration.vibrate([0, 35, 50, 35]);
      } else {
        Vibration.vibrate(12);
      }
    } catch {}

    onPress();
  };

  const spinInterpolation = rotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.wrapper}>
      {/* Orbiting Misbaha Beads SVG Ring with Hardware-Accelerated Rotation */}
      <Animated.View
        style={[
          styles.haloContainer,
          { transform: [{ rotate: spinInterpolation }] },
        ]}
        pointerEvents="none"
      >
        <Svg width={112} height={112} viewBox="0 0 112 112">
          <Defs>
            <RadialGradient id="activeGoldBead" cx="35%" cy="35%" r="65%">
              <Stop offset="0%" stopColor="#FFF9E6" />
              <Stop offset="50%" stopColor={theme.colors.accent} />
              <Stop offset="100%" stopColor="#9C7820" />
            </RadialGradient>
            <RadialGradient id="jadeOrbitBead" cx="35%" cy="35%" r="65%">
              <Stop offset="0%" stopColor="#A7F3D0" />
              <Stop offset="50%" stopColor={theme.colors.secondary} />
              <Stop offset="100%" stopColor="#044328" />
            </RadialGradient>
          </Defs>

          {/* Dotted Orbital Guide Path */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS_HALO}
            stroke="rgba(243, 196, 64, 0.22)"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
          />

          {/* 11 Misbaha Beads */}
          {beads.map((b, idx) => {
            const isApex = idx === 0;
            return (
              <Circle
                key={b.id}
                cx={b.cx}
                cy={b.cy}
                r={isApex ? BEAD_R + 1 : BEAD_R}
                fill={isApex ? 'url(#activeGoldBead)' : 'url(#jadeOrbitBead)'}
              />
            );
          })}
        </Svg>
      </Animated.View>

      {/* Central Tactile Pressable Counter Button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={`Count ${count} of ${target}. Tap to step bead`}
          style={[
            styles.centerButton,
            {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.accent,
            },
          ]}
        >
          <AppText style={styles.countText}>{count}</AppText>
          <AppText variant="caption" color={theme.colors.accent} style={styles.tapLabel}>
            TAP
          </AppText>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  haloContainer: {
    position: 'absolute',
    width: 112,
    height: 112,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
  },
  tapLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

