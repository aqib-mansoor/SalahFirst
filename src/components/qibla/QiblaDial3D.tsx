import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect, G, Line, Polygon } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { SPACING } from '@/constants/theme';
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
                  y1={deg === 0 ? 10 : 12}
                  x2={RADIUS_VAL}
                  y2={deg === 0 ? 24 : deg % 90 === 0 ? 20 : 16}
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

        {/* ROTATING 1-WAY ARROW WITH KAABA AT TIP */}
        <View style={[styles.needleLayer, { transform: [{ rotate: `${relativePointerAngle}deg` }] }]}>
          {/* Kaaba Emblem mounted directly at the arrow's pointing tip */}
          <View style={styles.arrowTipKaaba}>
            <KaabaEmblem3D isAligned={isAligned} />
          </View>

          {/* Sleek 1-Way Islamic Arrow: Tapered shaft extending from center to Kaaba tip */}
          <Svg width={32} height={140} viewBox="0 0 32 140" style={styles.oneWayArrowSvg}>
            {/* Arrow Head pointing upward toward Kaaba */}
            <Polygon points="16,8 28,42 19,38 19,136 13,136 13,38 4,42" fill={needleColor} />
            {/* Center spine highlight */}
            <Line x1="16" y1="12" x2="16" y2="136" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" />
          </Svg>

          {/* Center Pivot Hub */}
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
  cardinalText: {
    position: 'absolute',
    fontWeight: '800',
    fontSize: 12,
  },
  cardinalN: { top: 26 },
  cardinalS: { bottom: 24 },
  cardinalE: { right: 24 },
  cardinalW: { left: 24 },
  needleLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowTipKaaba: {
    position: 'absolute',
    top: 14,
    zIndex: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oneWayArrowSvg: {
    position: 'absolute',
    top: 36,
  },
  centerPivotOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  centerPivotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
