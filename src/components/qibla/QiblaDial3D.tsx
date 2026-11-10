import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect, G, Line, Polygon } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, RADIUS } from '@/constants/theme';
import { AppText } from '@/components/common';
import { TurnDirection } from '@/hooks/useQiblaCompass';
import { KaabaEmblem3D } from './KaabaEmblem3D';
import { QiblaGuidancePill } from './QiblaGuidancePill';

export interface QiblaDial3DProps {
  relativePointerAngle: number;
  isAligned: boolean;
  turnDirection: TurnDirection;
  turnDegrees: number;
}

const DIAL_SIZE = 280;
const RADIUS_VAL = DIAL_SIZE / 2;

export const QiblaDial3D: React.FC<QiblaDial3DProps> = ({
  relativePointerAngle,
  isAligned,
  turnDirection,
  turnDegrees,
}) => {
  const theme = useTheme();

  const needleColor = isAligned ? theme.colors.accent : theme.colors.primary;
  const needleTailColor = theme.colors.textMuted;

  return (
    <View style={styles.container}>
      {/* Outer Compass Dial Card (Fixed North-Anchored) */}
      <View
        style={[
          styles.dialCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: isAligned ? theme.colors.accent : theme.colors.border,
            shadowColor: isAligned ? theme.colors.accent : theme.colors.border,
          },
        ]}
      >
        {/* Stationary Dial Ring containing Cardinal Points and Rub el Hizb Star */}
        <View style={styles.dialRotator}>
          <Svg width={DIAL_SIZE} height={DIAL_SIZE} viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}>
            <Circle
              cx={RADIUS_VAL}
              cy={RADIUS_VAL}
              r={RADIUS_VAL - 8}
              stroke={isAligned ? theme.colors.accent : theme.colors.border}
              strokeWidth="2.5"
              fill="none"
            />
            <Circle
              cx={RADIUS_VAL}
              cy={RADIUS_VAL}
              r={RADIUS_VAL - 22}
              stroke={theme.colors.border}
              strokeWidth="1"
              strokeDasharray="3 3"
              fill="none"
            />
            <Circle
              cx={RADIUS_VAL}
              cy={RADIUS_VAL}
              r={55}
              stroke={theme.colors.border}
              strokeWidth="1.5"
              fill="none"
            />

            {/* 8-Point Islamic Star (Rub el Hizb) watermark */}
            <G transform={`translate(${RADIUS_VAL}, ${RADIUS_VAL})`}>
              <Rect
                x="-42"
                y="-42"
                width="84"
                height="84"
                stroke={isAligned ? theme.colors.accent : theme.colors.border}
                strokeWidth="1.2"
                fill="none"
              />
              <Rect
                x="-42"
                y="-42"
                width="84"
                height="84"
                stroke={isAligned ? theme.colors.accent : theme.colors.border}
                strokeWidth="1.2"
                fill="none"
                transform="rotate(45)"
              />
            </G>

            {/* Degree tick marks every 30 deg */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <G key={deg} transform={`rotate(${deg} ${RADIUS_VAL} ${RADIUS_VAL})`}>
                <Line
                  x1={RADIUS_VAL}
                  y1={deg === 0 ? 32 : 12}
                  x2={RADIUS_VAL}
                  y2={deg === 0 ? 36 : deg % 90 === 0 ? 20 : 16}
                  stroke={deg === 0 ? theme.colors.accent : theme.colors.textMuted}
                  strokeWidth={deg % 90 === 0 ? '2' : '1'}
                />
              </G>
            ))}
          </Svg>

          {[
            { label: 'N', style: styles.cardinalN, color: theme.colors.accent },
            { label: 'E', style: styles.cardinalE, color: theme.colors.textMuted },
            { label: 'S', style: styles.cardinalS, color: theme.colors.textMuted },
            { label: 'W', style: styles.cardinalW, color: theme.colors.textMuted },
          ].map((c) => (
            <AppText key={c.label} variant="caption" color={c.color} style={[styles.cardinalText, c.style]}>
              {c.label}
            </AppText>
          ))}
        </View>

        {/* 12 O'CLOCK TARGET: Kaaba Emblem sits stationary on the compass rim */}
        <View style={styles.topTargetAnchor}>
          <KaabaEmblem3D isAligned={isAligned} />
        </View>

        {/* ROTATING NEEDLE: Dual-Tone Islamic Arrow pointing toward Kaaba target */}
        <View style={[styles.needleLayer, { transform: [{ rotate: `${relativePointerAngle}deg` }] }]}>
          <Svg width={24} height={180} viewBox="0 0 24 180" style={styles.needleSvg}>
            <Polygon points="12,4 20,44 14,38 14,90 10,90 10,38 4,44" fill={needleColor} />
            <Polygon points="12,176 18,142 14,146 14,90 10,90 10,146 6,142" fill={needleTailColor} />
            <Polygon points="12,78 18,90 12,102 6,90" fill={theme.colors.surface} stroke={needleColor} strokeWidth="2" />
          </Svg>

          <View style={[styles.centerPivotOuter, { backgroundColor: theme.colors.surface, borderColor: needleColor }]}>
            <View style={[styles.centerPivotInner, { backgroundColor: needleColor }]} />
          </View>
        </View>
      </View>

      {/* Seamless Guidance Pill Directly Beneath Dial */}
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
    marginVertical: 4,
  },
  dialCard: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  dialRotator: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTargetAnchor: {
    position: 'absolute',
    top: 6,
    zIndex: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardinalText: {
    position: 'absolute',
    fontWeight: '800',
    fontSize: 12,
  },
  cardinalN: { top: 38 },
  cardinalS: { bottom: 24 },
  cardinalE: { right: 24 },
  cardinalW: { left: 24 },
  needleLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleSvg: {
    position: 'absolute',
  },
  centerPivotOuter: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  centerPivotInner: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
  },
});
