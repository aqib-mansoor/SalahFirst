import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Polygon } from 'react-native-svg';
import {
  SPACING,
  QIBLA_DIAL_THEMES,
  QiblaDialThemeSpec,
} from '@/constants/theme';
import { AppText } from '@/components/common';
import { TurnDirection } from '@/hooks/useQiblaCompass';
import { QiblaGuidancePill } from './QiblaGuidancePill';

export interface QiblaDial3DProps {
  heading: number;
  qiblaBearing: number;
  relativePointerAngle: number;
  isAligned: boolean;
  turnDirection: TurnDirection;
  turnDegrees: number;
  dialTheme?: QiblaDialThemeSpec;
}

const DIAL_SIZE = 284;
const R = DIAL_SIZE / 2;

export const QiblaDial3D: React.FC<QiblaDial3DProps> = ({
  heading,
  relativePointerAngle,
  isAligned,
  turnDirection,
  turnDegrees,
  dialTheme = QIBLA_DIAL_THEMES.classic,
}) => {
  return (
    <View style={styles.container}>
      {/* Soft Luminous Halo Ring around the Compass */}
      <View
        style={[
          styles.glowHalo,
          {
            backgroundColor: isAligned ? dialTheme.haloGlow : 'transparent',
            borderColor: isAligned ? dialTheme.dialBorder : 'transparent',
          },
        ]}
      >
        {/* Main Circular Dial Face */}
        <View
          style={[
            styles.dialCard,
            {
              backgroundColor: dialTheme.dialBg,
              borderColor: isAligned ? dialTheme.needleNorthLeft : dialTheme.dialBorder,
            },
          ]}
        >
          {/* ROTATING COMPASS RING (Oriented to True North via -heading) */}
          <View
            style={[
              styles.rotatingLayer,
              { transform: [{ rotate: `${-heading}deg` }] },
            ]}
          >
            <Svg width={DIAL_SIZE} height={DIAL_SIZE} viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}>
              {/* Subtle Inner Decorative Ring */}
              <Circle
                cx={R}
                cy={R}
                r={R - 46}
                stroke={dialTheme.innerRing}
                strokeWidth="1"
                fill="none"
              />

              {/* Mariners 8-Point Compass Rose Star when 'rose' style is active */}
              {dialTheme.id === 'rose' && (
                <G opacity={0.85}>
                  <Polygon
                    points={`${R},44 ${R + 14},${R - 14} ${DIAL_SIZE - 44},${R} ${R + 14},${R + 14} ${R},${DIAL_SIZE - 44} ${R - 14},${R + 14} 44,${R} ${R - 14},${R - 14}`}
                    fill={dialTheme.innerRing}
                  />
                  <Circle cx={R} cy={R} r={28} stroke={dialTheme.tickMinor} strokeWidth="0.8" fill="none" />
                </G>
              )}

              {/* Kiswah Gold Inner Geometric Ring when 'obsidian' style is active */}
              {dialTheme.id === 'obsidian' && (
                <Circle
                  cx={R}
                  cy={R}
                  r={R - 72}
                  stroke={dialTheme.innerRing}
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  fill="none"
                />
              )}

              {/* 72 Graduation Ticks (every 5 degrees) */}
              {Array.from({ length: 72 }).map((_, i) => {
                const deg = i * 5;
                const isNorth = deg === 0;
                const isCardinal = deg % 90 === 0;
                const isMajor = deg % 30 === 0;
                const tickLen = isCardinal ? 16 : isMajor ? 12 : 7;
                const strokeColor = isNorth
                  ? dialTheme.northTick
                  : isMajor
                  ? dialTheme.tickMajor
                  : dialTheme.tickMinor;

                return (
                  <G key={deg} transform={`rotate(${deg} ${R} ${R})`}>
                    <Line
                      x1={R}
                      y1={8}
                      x2={R}
                      y2={8 + tickLen}
                      stroke={strokeColor}
                      strokeWidth={isCardinal ? '2.4' : isMajor ? '1.8' : '1.1'}
                      strokeLinecap="round"
                    />
                  </G>
                );
              })}
            </Svg>

            {/* Cardinal Letters (N, E, S, W) */}
            <AppText
              variant="titleSmall"
              color={dialTheme.northText}
              style={[styles.cardinalText, styles.cardinalN]}
            >
              N
            </AppText>
            <AppText
              variant="titleSmall"
              color={dialTheme.cardinalText}
              style={[styles.cardinalText, styles.cardinalE]}
            >
              E
            </AppText>
            <AppText
              variant="titleSmall"
              color={dialTheme.cardinalText}
              style={[styles.cardinalText, styles.cardinalS]}
            >
              S
            </AppText>
            <AppText
              variant="titleSmall"
              color={dialTheme.cardinalText}
              style={[styles.cardinalText, styles.cardinalW]}
            >
              W
            </AppText>
          </View>

          {/* DYNAMIC 3D FACETED QIBLA NEEDLE LAYER (Points toward Kaaba) */}
          <View
            style={[
              styles.rotatingLayer,
              { transform: [{ rotate: `${relativePointerAngle}deg` }] },
            ]}
            pointerEvents="none"
          >
            <Svg width={DIAL_SIZE} height={DIAL_SIZE} viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}>
              {/* North / Qibla Tip — Left Lit Facet */}
              <Polygon
                points={`${R},24 ${R},${R} ${R - 17},${R}`}
                fill={dialTheme.needleNorthLeft}
              />
              {/* North / Qibla Tip — Right Shaded Facet */}
              <Polygon
                points={`${R},24 ${R + 17},${R} ${R},${R}`}
                fill={dialTheme.needleNorthRight}
              />
              {/* South Tail — Left Lit Facet */}
              <Polygon
                points={`${R},${DIAL_SIZE - 24} ${R - 17},${R} ${R},${R}`}
                fill={dialTheme.needleSouthLeft}
              />
              {/* South Tail — Right Shaded Facet */}
              <Polygon
                points={`${R},${DIAL_SIZE - 24} ${R},${R} ${R + 17},${R}`}
                fill={dialTheme.needleSouthRight}
              />
              {/* Center Hub Pivot */}
              <Circle
                cx={R}
                cy={R}
                r="7"
                fill={dialTheme.hubBg}
                stroke={dialTheme.hubBorder}
                strokeWidth="2.5"
              />
            </Svg>
          </View>
        </View>
      </View>

      {/* Guidance Pill Directly Below Dial */}
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
    gap: SPACING.sm + 2,
  },
  glowHalo: {
    padding: 10,
    borderRadius: (DIAL_SIZE + 20) / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialCard: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  rotatingLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardinalText: {
    position: 'absolute',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cardinalN: { top: 28 },
  cardinalS: { bottom: 28 },
  cardinalE: { right: 30 },
  cardinalW: { left: 30 },
});
