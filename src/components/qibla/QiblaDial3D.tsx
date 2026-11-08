import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect, G, Line } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { SPACING } from '@/constants/theme';
import { AppText } from '@/components/common';
import { TurnDirection } from '@/hooks/useQiblaCompass';
import { KaabaEmblem3D } from './KaabaEmblem3D';
import { QiblaGuidancePill } from './QiblaGuidancePill';

export interface QiblaDial3DProps {
  heading: number;
  relativePointerAngle: number;
  isAligned: boolean;
  turnDirection: TurnDirection;
  turnDegrees: number;
}

const DIAL_SIZE = 280;
const RADIUS_VAL = DIAL_SIZE / 2;

export const QiblaDial3D: React.FC<QiblaDial3DProps> = ({
  heading,
  relativePointerAngle,
  isAligned,
  turnDirection,
  turnDegrees,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Outer Compass Dial Card */}
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
        {/* Rotating Dial Ring containing Cardinal Points and Rub el Hizb Star */}
        <View
          style={[
            styles.dialRotator,
            { transform: [{ rotate: `${-heading}deg` }] },
          ]}
        >
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
                  y1={12}
                  x2={RADIUS_VAL}
                  y2={deg % 90 === 0 ? 20 : 16}
                  stroke={deg === 0 ? theme.colors.accent : theme.colors.textMuted}
                  strokeWidth={deg % 90 === 0 ? '2' : '1'}
                />
              </G>
            ))}
          </Svg>

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

        {/* Needle pointing towards Qibla direction with Kaaba Emblem */}
        <View
          style={[
            styles.needleLayer,
            { transform: [{ rotate: `${relativePointerAngle}deg` }] },
          ]}
        >
          <View
            style={[
              styles.needleShaft,
              {
                backgroundColor: isAligned ? theme.colors.accent : theme.colors.primary,
                borderColor: isAligned ? theme.colors.accent : theme.colors.primary,
              },
            ]}
          />

          <KaabaEmblem3D isAligned={isAligned} />

          {/* Center Pivot Point */}
          <View
            style={[
              styles.centerPivotOuter,
              {
                backgroundColor: theme.colors.surface,
                borderColor: isAligned ? theme.colors.accent : theme.colors.primary,
              },
            ]}
          >
            <View
              style={[
                styles.centerPivotInner,
                { backgroundColor: isAligned ? theme.colors.accent : theme.colors.primary },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Guidance Pill Sub-component */}
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
  cardinalN: { top: 24 },
  cardinalS: { bottom: 24 },
  cardinalE: { right: 24 },
  cardinalW: { left: 24 },
  needleLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleShaft: {
    position: 'absolute',
    top: 40,
    width: 4,
    height: RADIUS_VAL - 40,
    borderRadius: 2,
    borderWidth: 0.5,
  },
  centerPivotOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerPivotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
