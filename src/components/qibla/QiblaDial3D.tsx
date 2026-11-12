import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { SPACING } from '@/constants/theme';
import { AppText } from '@/components/common';
import { TurnDirection } from '@/hooks/useQiblaCompass';
import { KaabaEmblem3D } from './KaabaEmblem3D';
import { QiblaGuidancePill } from './QiblaGuidancePill';

export interface QiblaDial3DProps {
  heading: number;
  qiblaBearing: number;
  relativePointerAngle: number;
  isAligned: boolean;
  turnDirection: TurnDirection;
  turnDegrees: number;
}

const DIAL_SIZE = 290;
const RADIUS_VAL = DIAL_SIZE / 2;

export const QiblaDial3D: React.FC<QiblaDial3DProps> = ({
  heading,
  qiblaBearing,
  relativePointerAngle,
  isAligned,
  turnDirection,
  turnDegrees,
}) => {
  const theme = useTheme();

  const accentColor = isAligned ? theme.colors.accent : theme.colors.primary;
  const needleGlow = isAligned ? 'rgba(243, 196, 64, 0.28)' : 'rgba(14, 116, 73, 0.15)';

  return (
    <View style={styles.container}>
      {/* Outer Glow Halo Ring when Aligned */}
      <View
        style={[
          styles.glowHalo,
          {
            borderColor: isAligned ? theme.colors.accent : 'transparent',
            backgroundColor: isAligned ? theme.colors.accentTint : 'transparent',
          },
        ]}
      >
        {/* Main Circular Dial Instrument */}
        <View
          style={[
            styles.dialCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: isAligned ? theme.colors.accent : theme.colors.border,
            },
          ]}
        >
          {/* ROTATING COMPASS DIAL (Oriented to True North via heading) */}
          <View
            style={[
              styles.rotatingCompassRing,
              { transform: [{ rotate: `${-heading}deg` }] },
            ]}
          >
            <Svg width={DIAL_SIZE} height={DIAL_SIZE} viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}>
              {/* Outer Outer Instrument Ring */}
              <Circle
                cx={RADIUS_VAL}
                cy={RADIUS_VAL}
                r={RADIUS_VAL - 8}
                stroke={theme.colors.border}
                strokeWidth="1.5"
                fill="none"
              />

              {/* Sub-degree Track */}
              <Circle
                cx={RADIUS_VAL}
                cy={RADIUS_VAL}
                r={RADIUS_VAL - 22}
                stroke={theme.colors.border}
                strokeWidth="0.8"
                strokeDasharray="2 4"
                fill="none"
              />

              {/* Inner Concentric Horizon Circle */}
              <Circle
                cx={RADIUS_VAL}
                cy={RADIUS_VAL}
                r={RADIUS_VAL - 58}
                stroke={theme.colors.border}
                strokeWidth="1"
                fill="none"
              />

              {/* 72 Compass Graduation Ticks (every 5 deg) */}
              {Array.from({ length: 72 }).map((_, i) => {
                const deg = i * 5;
                const isMajor = deg % 30 === 0;
                const isCardinal = deg % 90 === 0;
                const tickLen = isCardinal ? 14 : isMajor ? 10 : 5;
                const strokeColor = isCardinal
                  ? deg === 0
                    ? theme.colors.accent
                    : theme.colors.text
                  : isMajor
                  ? theme.colors.textSecondary
                  : theme.colors.border;

                return (
                  <G key={deg} transform={`rotate(${deg} ${RADIUS_VAL} ${RADIUS_VAL})`}>
                    <Line
                      x1={RADIUS_VAL}
                      y1={10}
                      x2={RADIUS_VAL}
                      y2={10 + tickLen}
                      stroke={strokeColor}
                      strokeWidth={isCardinal ? '2' : isMajor ? '1.4' : '0.9'}
                      strokeLinecap="round"
                    />
                  </G>
                );
              })}
            </Svg>

            {/* Cardinal Letters (N, E, S, W) rotated with the compass dial */}
            <AppText
              variant="caption"
              color={theme.colors.accent}
              style={[styles.cardinalText, styles.cardinalN]}
            >
              N
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              style={[styles.cardinalText, styles.cardinalE]}
            >
              E
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              style={[styles.cardinalText, styles.cardinalS]}
            >
              S
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              style={[styles.cardinalText, styles.cardinalW]}
            >
              W
            </AppText>
          </View>

          {/* STATIONARY TOP APEX BEZEL (Device Heading Indicator) */}
          <View style={styles.topApexIndicator}>
            <View
              style={[
                styles.topApexMarker,
                { borderTopColor: isAligned ? theme.colors.accent : theme.colors.primary },
              ]}
            />
          </View>

          {/* DYNAMIC QIBLA POINTER LAYER (Rotates relative to device forward axis) */}
          <View
            style={[
              styles.qiblaPointerLayer,
              { transform: [{ rotate: `${relativePointerAngle}deg` }] },
            ]}
          >
            {/* Kaaba Monument stationed at outer perimeter */}
            <View style={styles.kaabaPerimeterAnchor}>
              <View
                style={[
                  styles.kaabaHalo,
                  { backgroundColor: needleGlow, borderColor: accentColor },
                ]}
              >
                <KaabaEmblem3D isAligned={isAligned} size={32} />
              </View>
            </View>

            {/* High-Precision Instrument Pointer Shaft */}
            <View style={[styles.pointerStem, { backgroundColor: accentColor }]} />
            <View style={[styles.pointerStemGlow, { backgroundColor: needleGlow }]} />

            {/* Center Chrono Hub */}
            <View
              style={[
                styles.centerHubOuter,
                { backgroundColor: theme.colors.surface, borderColor: accentColor },
              ]}
            >
              <View style={[styles.centerHubInner, { backgroundColor: accentColor }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Modern Guidance Pill Directly Below Dial */}
      <QiblaGuidancePill
        isAligned={isAligned}
        turnDirection={turnDirection}
        turnDegrees={turnDegrees}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginVertical: SPACING.xs,
  },
  glowHalo: {
    padding: 6,
    borderRadius: (DIAL_SIZE + 12) / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialCard: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  rotatingCompassRing: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardinalText: {
    position: 'absolute',
    fontWeight: '800',
    fontSize: 12,
  },
  cardinalN: { top: 25 },
  cardinalS: { bottom: 25 },
  cardinalE: { right: 26 },
  cardinalW: { left: 26 },
  topApexIndicator: {
    position: 'absolute',
    top: -2,
    zIndex: 40,
    alignItems: 'center',
  },
  topApexMarker: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  qiblaPointerLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  kaabaPerimeterAnchor: {
    position: 'absolute',
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 35,
  },
  kaabaHalo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointerStem: {
    position: 'absolute',
    top: 68,
    width: 3.5,
    height: RADIUS_VAL - 74,
    borderRadius: 2,
    zIndex: 25,
  },
  pointerStemGlow: {
    position: 'absolute',
    top: 68,
    width: 8,
    height: RADIUS_VAL - 74,
    borderRadius: 4,
    zIndex: 24,
  },
  centerHubOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  centerHubInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
