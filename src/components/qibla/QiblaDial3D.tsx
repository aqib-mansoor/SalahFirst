import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';
import {
  SPACING,
  QIBLA_DIAL_THEMES,
  QiblaDialThemeSpec,
} from '@/constants/theme';
import { AppText } from '@/components/common';
import { TurnDirection } from '@/hooks/useQiblaCompass';
import { QiblaGuidancePill } from './QiblaGuidancePill';
import {
  ClassicNeedleVariant,
  AstrolabeRoseVariant,
  PerimeterOrbitVariant,
  KiswahMedallionVariant,
} from './QiblaNeedleVariants';

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
  qiblaBearing,
  relativePointerAngle,
  isAligned,
  turnDirection,
  turnDegrees,
  dialTheme = QIBLA_DIAL_THEMES.classic,
}) => {
  const variantProps = {
    dialSize: DIAL_SIZE,
    heading,
    qiblaBearing,
    relativePointerAngle,
    isAligned,
    dialTheme,
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.glowHalo,
          {
            backgroundColor: isAligned ? dialTheme.haloGlow : 'transparent',
            borderColor: isAligned ? dialTheme.dialBorder : 'transparent',
          },
        ]}
      >
        <View
          style={[
            styles.dialCard,
            {
              backgroundColor: dialTheme.dialBg,
              borderColor: isAligned ? dialTheme.needleNorthLeft : dialTheme.dialBorder,
            },
          ]}
        >
          {/* ROTATING COMPASS BEZEL RING (Oriented to True North via -heading) */}
          <View
            style={[
              styles.rotatingLayer,
              { transform: [{ rotate: `${-heading}deg` }] },
            ]}
          >
            <Svg width={DIAL_SIZE} height={DIAL_SIZE} viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}>
              {/* Style-Specific Ring Architecture */}
              {dialTheme.id === 'rose' && (
                <>
                  <Circle cx={R} cy={R} r={R - 10} stroke={dialTheme.tickMinor} strokeWidth="1.2" fill="none" />
                  <Circle cx={R} cy={R} r={R - 26} stroke={dialTheme.tickMinor} strokeWidth="1" fill="none" />
                </>
              )}

              {dialTheme.id === 'obsidian' && (
                <>
                  <Circle cx={R} cy={R} r={R - 8} stroke={dialTheme.tickMajor} strokeWidth="1.6" fill="none" />
                  <Circle
                    cx={R}
                    cy={R}
                    r={R - 46}
                    stroke={dialTheme.innerRing}
                    strokeWidth="1.4"
                    strokeDasharray="6 4"
                    fill="none"
                  />
                </>
              )}

              {dialTheme.id === 'emerald' ? (
                /* Dot-Matrix Perimeter Ring for Kaaba Orbit Style */
                Array.from({ length: 36 }).map((_, i) => {
                  const deg = i * 10;
                  const isNorth = deg === 0;
                  const isCardinal = deg % 90 === 0;
                  return (
                    <G key={deg} transform={`rotate(${deg} ${R} ${R})`}>
                      <Circle
                        cx={R}
                        cy={14}
                        r={isNorth ? 4 : isCardinal ? 3 : 1.6}
                        fill={isNorth ? dialTheme.northTick : isCardinal ? dialTheme.tickMajor : dialTheme.tickMinor}
                      />
                    </G>
                  );
                })
              ) : (
                /* 72 Graduation Ticks for Classic, Rose & Kiswah Styles */
                Array.from({ length: 72 }).map((_, i) => {
                  const deg = i * 5;
                  const isNorth = deg === 0;
                  const isCardinal = deg % 90 === 0;
                  const isMajor = deg % 30 === 0;
                  const tickLen = isCardinal ? 16 : isMajor ? 11 : 6;
                  const strokeColor = isNorth
                    ? dialTheme.northTick
                    : isMajor
                    ? dialTheme.tickMajor
                    : dialTheme.tickMinor;

                  return (
                    <G key={deg} transform={`rotate(${deg} ${R} ${R})`}>
                      <Line
                        x1={R}
                        y1={10}
                        x2={R}
                        y2={10 + tickLen}
                        stroke={strokeColor}
                        strokeWidth={isCardinal ? '2.4' : isMajor ? '1.6' : '1'}
                        strokeLinecap="round"
                      />
                    </G>
                  );
                })
              )}
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

          {/* DISTINCT POINTER & CENTER INSTRUMENT BY STYLE */}
          {dialTheme.id === 'classic' && <ClassicNeedleVariant {...variantProps} />}
          {dialTheme.id === 'rose' && <AstrolabeRoseVariant {...variantProps} />}
          {dialTheme.id === 'emerald' && <PerimeterOrbitVariant {...variantProps} />}
          {dialTheme.id === 'obsidian' && <KiswahMedallionVariant {...variantProps} />}
        </View>
      </View>

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
    fontSize: 15,
    letterSpacing: 0.5,
  },
  cardinalN: { top: 28 },
  cardinalS: { bottom: 28 },
  cardinalE: { right: 30 },
  cardinalW: { left: 30 },
});
