import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { RADIUS, SPACING, QiblaDialThemeSpec } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { KaabaEmblem3D } from './KaabaEmblem3D';

export interface QiblaMapBannerProps {
  qiblaBearing: number;
  distanceKm: number;
  isAligned: boolean;
  dialTheme: QiblaDialThemeSpec;
}

export const QiblaMapBanner: React.FC<QiblaMapBannerProps> = ({
  qiblaBearing,
  distanceKm,
  isAligned,
  dialTheme,
}) => {
  const theme = useTheme();
  const activeColor = isAligned ? theme.colors.primary : dialTheme.mapAccent;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.mapCard,
          {
            borderColor: isAligned ? theme.colors.primary : theme.colors.border,
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 360 110" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <LinearGradient id="qiblaOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.isDark ? '#0B2938' : '#38BDF8'} />
              <Stop offset="55%" stopColor={theme.isDark ? '#083344' : '#0284C7'} />
              <Stop offset="100%" stopColor={theme.isDark ? '#062430' : '#0369A1'} />
            </LinearGradient>
            <LinearGradient id="qiblaDesertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.isDark ? '#1E3A2F' : '#FEF3C7'} />
              <Stop offset="100%" stopColor={theme.isDark ? '#132A22' : '#D9F99D'} />
            </LinearGradient>
            <LinearGradient id="qiblaLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.isDark ? '#144332' : '#86EFAC'} />
              <Stop offset="100%" stopColor={theme.isDark ? '#0F3325' : '#4ADE80'} />
            </LinearGradient>
          </Defs>

          {/* Ocean Base */}
          <Path d="M0 0H360V110H0Z" fill="url(#qiblaOceanGrad)" />

          {/* Arabian Peninsula & Red Sea Landmass (Left) */}
          <Path
            d="M0 0H118L130 22L112 46L138 66L92 92L52 78L28 38L16 55L0 42Z"
            fill="url(#qiblaDesertGrad)"
          />

          {/* South & Central Asia Landmass (Center-Right) */}
          <Path
            d="M142 0H360V95L322 76L294 88L268 58L228 96L194 48L158 42L142 18Z"
            fill="url(#qiblaLandGrad)"
          />

          {/* Dashed Geodesic Trajectory Curve from User Location to Makkah */}
          <Path
            d="M 245 48 Q 165 26 68 38"
            stroke={activeColor}
            strokeWidth="2.2"
            strokeDasharray="5 4"
            fill="none"
            strokeLinecap="round"
          />

          {/* User Origin Pulse Marker */}
          <Circle cx="245" cy="48" r="7" fill={activeColor} opacity={0.28} />
          <Circle cx="245" cy="48" r="4" fill={activeColor} stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Makkah Destination Marker on Arabian Peninsula */}
          <Circle cx="66" cy="38" r="11" fill="#FFFFFF" stroke={activeColor} strokeWidth="2" />
          <Path d="M61 33H71V43H61Z" fill="#141716" />
          <Path d="M61 36.2H71" stroke="#F3C440" strokeWidth="1.6" />
        </Svg>

        {/* Top-Right Bearing & Distance Overlay Pill */}
        <View
          style={[
            styles.telemetryBadge,
            {
              backgroundColor: theme.isDark ? 'rgba(7, 24, 18, 0.84)' : 'rgba(255, 255, 255, 0.92)',
              borderColor: theme.colors.border,
            },
          ]}
        >
          <AppText variant="caption" color={theme.colors.text} style={styles.badgeText}>
            Qibla: {qiblaBearing}° • {distanceKm.toLocaleString()} km
          </AppText>
        </View>
      </View>

      {/* Bottom-Center Kaaba Alignment Badge + Vertical Guide Line into Compass Apex */}
      <View style={styles.apexAnchor}>
        <View
          style={[
            styles.kaabaCircle,
            {
              backgroundColor: theme.colors.surface,
              borderColor: activeColor,
            },
          ]}
        >
          <KaabaEmblem3D isAligned={isAligned} size={26} />
        </View>
        <View style={[styles.verticalGuideLine, { backgroundColor: activeColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginBottom: -8,
    zIndex: 20,
  },
  mapCard: {
    width: '100%',
    height: 94,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  telemetryBadge: {
    position: 'absolute',
    top: 8,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  apexAnchor: {
    alignItems: 'center',
    marginTop: -22,
    zIndex: 30,
  },
  kaabaCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 4,
  },
  verticalGuideLine: {
    width: 2.5,
    height: 14,
    borderRadius: 2,
  },
});

