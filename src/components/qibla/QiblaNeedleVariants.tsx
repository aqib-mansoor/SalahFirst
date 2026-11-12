import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import { QiblaDialThemeSpec } from '@/constants/theme';
import { AppText } from '@/components/common';
import { KaabaEmblem3D } from './KaabaEmblem3D';

export interface QiblaVariantProps {
  dialSize: number;
  heading: number;
  qiblaBearing: number;
  relativePointerAngle: number;
  isAligned: boolean;
  dialTheme: QiblaDialThemeSpec;
}

/**
 * TYPE 1: CLASSIC 3D BIPYRAMID NEEDLE
 * Full-span dual-tone faceted diamond needle from top to bottom.
 */
export const ClassicNeedleVariant: React.FC<QiblaVariantProps> = ({
  dialSize,
  relativePointerAngle,
  dialTheme,
}) => {
  const R = dialSize / 2;
  return (
    <View
      style={[styles.layer, { transform: [{ rotate: `${relativePointerAngle}deg` }] }]}
      pointerEvents="none"
    >
      <Svg width={dialSize} height={dialSize} viewBox={`0 0 ${dialSize} ${dialSize}`}>
        <Polygon points={`${R},24 ${R},${R} ${R - 17},${R}`} fill={dialTheme.needleNorthLeft} />
        <Polygon points={`${R},24 ${R + 17},${R} ${R},${R}`} fill={dialTheme.needleNorthRight} />
        <Polygon points={`${R},${dialSize - 24} ${R - 17},${R} ${R},${R}`} fill={dialTheme.needleSouthLeft} />
        <Polygon points={`${R},${dialSize - 24} ${R},${R} ${R + 17},${R}`} fill={dialTheme.needleSouthRight} />
        <Circle cx={R} cy={R} r="7" fill={dialTheme.hubBg} stroke={dialTheme.hubBorder} strokeWidth="2.5" />
      </Svg>
    </View>
  );
};

/**
 * TYPE 2: 8-POINT NAUTICAL ASTROLABE COMPASS ROSE
 * Rotating 8-point 3D faceted star rose in the center + crimson Qibla spearhead on outer track.
 */
export const AstrolabeRoseVariant: React.FC<QiblaVariantProps> = ({
  dialSize,
  heading,
  relativePointerAngle,
  dialTheme,
}) => {
  const R = dialSize / 2;
  return (
    <>
      {/* 8-Point 3D Faceted Compass Rose rotating with True North (-heading) */}
      <View
        style={[styles.layer, { transform: [{ rotate: `${-heading}deg` }] }]}
        pointerEvents="none"
      >
        <Svg width={dialSize} height={dialSize} viewBox={`0 0 ${dialSize} ${dialSize}`}>
          {/* 4 Diagonal Intercardinal Points (NE, SE, SW, NW) */}
          {[45, 135, 225, 315].map((angle) => (
            <G key={angle} transform={`rotate(${angle} ${R} ${R})`}>
              <Polygon points={`${R},${R - 64} ${R},${R} ${R - 10},${R - 10}`} fill="#A8A29E" />
              <Polygon points={`${R},${R - 64} ${R + 10},${R - 10} ${R},${R}`} fill="#78716C" />
            </G>
          ))}
          {/* 4 Main Cardinal Points (N, E, S, W) */}
          {[0, 90, 180, 270].map((angle) => {
            const isN = angle === 0;
            return (
              <G key={angle} transform={`rotate(${angle} ${R} ${R})`}>
                <Polygon
                  points={`${R},${R - 86} ${R},${R} ${R - 14},${R - 14}`}
                  fill={isN ? dialTheme.needleNorthLeft : '#57534E'}
                />
                <Polygon
                  points={`${R},${R - 86} ${R + 14},${R - 14} ${R},${R}`}
                  fill={isN ? dialTheme.needleNorthRight : '#292524'}
                />
              </G>
            );
          })}
          <Circle cx={R} cy={R} r="9" fill={dialTheme.hubBg} stroke={dialTheme.hubBorder} strokeWidth="2.5" />
        </Svg>
      </View>

      {/* Orbiting Qibla Pointer Arrowhead on the Outer Ring */}
      <View
        style={[styles.layer, { transform: [{ rotate: `${relativePointerAngle}deg` }] }]}
        pointerEvents="none"
      >
        <Svg width={dialSize} height={dialSize} viewBox={`0 0 ${dialSize} ${dialSize}`}>
          <Polygon
            points={`${R},14 ${R - 11},38 ${R},32 ${R + 11},38`}
            fill={dialTheme.needleNorthLeft}
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
        </Svg>
      </View>
    </>
  );
};

/**
 * TYPE 3: PERIMETER KAABA ORBIT & DIGITAL HUD (NO CENTER NEEDLE)
 * Open center displaying live bearing readout + Kaaba emblem orbiting along the inner track.
 */
export const PerimeterOrbitVariant: React.FC<QiblaVariantProps> = ({
  dialSize,
  heading,
  qiblaBearing,
  relativePointerAngle,
  isAligned,
  dialTheme,
}) => {
  const R = dialSize / 2;
  return (
    <>
      {/* Stationary Center Digital Readout HUD */}
      <View style={styles.layer} pointerEvents="none">
        <Svg width={dialSize} height={dialSize} viewBox={`0 0 ${dialSize} ${dialSize}`}>
          <Circle
            cx={R}
            cy={R}
            r={54}
            fill="rgba(0, 0, 0, 0.18)"
            stroke={isAligned ? '#FBBF24' : dialTheme.innerRing}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        </Svg>
        <View style={styles.hudCenter}>
          <AppText variant="caption" color={dialTheme.cardinalText} style={styles.hudLabel}>
            QIBLA
          </AppText>
          <AppText variant="titleLarge" color="#FFFFFF" style={styles.hudDegrees}>
            {qiblaBearing}°
          </AppText>
          <AppText variant="caption" color={dialTheme.northText} style={styles.hudSub}>
            HDG {heading}°
          </AppText>
        </View>
      </View>

      {/* Orbiting Kaaba Badge + Guidance Ray on Perimeter */}
      <View
        style={[styles.layer, { transform: [{ rotate: `${relativePointerAngle}deg` }] }]}
        pointerEvents="none"
      >
        <Svg width={dialSize} height={dialSize} viewBox={`0 0 ${dialSize} ${dialSize}`}>
          <Line
            x1={R}
            y1={56}
            x2={R}
            y2={R - 56}
            stroke={ dialTheme.northTick }
            strokeWidth="2.5"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />
          <Polygon points={`${R},16 ${R - 7},28 ${R + 7},28`} fill={dialTheme.northTick} />
        </Svg>
        <View style={styles.orbitKaabaWrap}>
          <KaabaEmblem3D isAligned={isAligned} size={30} />
        </View>
      </View>
    </>
  );
};

/**
 * TYPE 4: ROYAL KISWAH RUB EL HIZB (۞) & GOLDEN CRESCENT POINTER
 * Ornate 8-pointed Islamic geometric medallion with a golden crescent-tipped pointer.
 */
export const KiswahMedallionVariant: React.FC<QiblaVariantProps> = ({
  dialSize,
  relativePointerAngle,
  dialTheme,
}) => {
  const R = dialSize / 2;
  const boxSize = 52;
  const half = boxSize / 2;

  return (
    <View
      style={[styles.layer, { transform: [{ rotate: `${relativePointerAngle}deg` }] }]}
      pointerEvents="none"
    >
      <Svg width={dialSize} height={dialSize} viewBox={`0 0 ${dialSize} ${dialSize}`}>
        {/* Golden Tapered Spear Shaft */}
        <Polygon
          points={`${R},24 ${R - 6},${R - 22} ${R + 6},${R - 22}`}
          fill={dialTheme.needleNorthLeft}
        />
        <Polygon
          points={`${R},24 ${R + 6},${R - 22} ${R},${R - 22}`}
          fill={dialTheme.needleNorthRight}
        />

        {/* Golden Crescent Finial near Tip */}
        <Path
          d={`M ${R - 12} 48 A 12 12 0 1 0 ${R + 12} 48 A 9.5 9.5 0 1 1 ${R - 12} 48 Z`}
          fill={dialTheme.needleNorthLeft}
        />

        {/* Counterweight Tail */}
        <Line
          x1={R}
          y1={R + 26}
          x2={R}
          y2={R + 68}
          stroke={dialTheme.needleNorthRight}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Circle cx={R} cy={R + 70} r="4.5" fill={dialTheme.needleNorthLeft} />

        {/* Rub el Hizb (۞) 8-Pointed Islamic Star Medallion at Center */}
        <Rect
          x={R - half}
          y={R - half}
          width={boxSize}
          height={boxSize}
          rx="4"
          fill={dialTheme.hubBg}
          stroke={dialTheme.hubBorder}
          strokeWidth="2"
        />
        <G transform={`rotate(45 ${R} ${R})`}>
          <Rect
            x={R - half}
            y={R - half}
            width={boxSize}
            height={boxSize}
            rx="4"
            fill={dialTheme.hubBg}
            stroke={dialTheme.hubBorder}
            strokeWidth="2"
          />
        </G>
        <Circle cx={R} cy={R} r="10" fill={dialTheme.needleNorthLeft} />
        <Circle cx={R} cy={R} r="4.5" fill={dialTheme.hubBg} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  hudLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  hudDegrees: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  hudSub: {
    fontSize: 10,
    fontWeight: '700',
  },
  orbitKaabaWrap: {
    position: 'absolute',
    top: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
