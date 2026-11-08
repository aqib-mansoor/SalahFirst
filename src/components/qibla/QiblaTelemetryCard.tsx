import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { TurnDirection } from '@/hooks/useQiblaCompass';

export interface QiblaTelemetryCardProps {
  heading: number;
  qiblaBearing: number;
  distanceKm: number;
  cardinal: string;
  isAligned: boolean;
  turnDirection: TurnDirection;
  turnDegrees: number;
}

export const QiblaTelemetryCard: React.FC<QiblaTelemetryCardProps> = ({
  heading,
  qiblaBearing,
  distanceKm,
  cardinal,
  isAligned,
  turnDirection,
  turnDegrees,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const guidanceText = isAligned
    ? t('facingKaaba')
    : turnDirection === 'left'
    ? (t('turnLeftDegrees', { degrees: turnDegrees }) || `Turn left ${turnDegrees}° towards Qibla`)
    : (t('turnRightDegrees', { degrees: turnDegrees }) || `Turn right ${turnDegrees}° towards Qibla`);

  return (
    <View style={styles.container}>
      {/* Dynamic Directional Guidance Banner */}
      <View
        style={[
          styles.guidanceBanner,
          {
            backgroundColor: isAligned
              ? theme.colors.secondaryTint
              : theme.colors.surface,
            borderColor: isAligned
              ? theme.colors.primary
              : theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.guidanceIconWrapper,
            {
              backgroundColor: isAligned
                ? theme.colors.primary
                : theme.colors.surfaceElevated,
            },
          ]}
        >
          {isAligned ? (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 6L9 17L4 12"
                stroke={theme.colors.textOnPrimary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : turnDirection === 'left' ? (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                stroke={theme.colors.primary}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M14 5l7 7m0 0l-7 7m7-7H3"
                stroke={theme.colors.primary}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>

        <AppText
          variant="bodyMedium"
          color={isAligned ? theme.colors.primary : theme.colors.text}
          style={styles.guidanceText}
          numberOfLines={1}
        >
          {guidanceText}
        </AppText>
      </View>

      {/* 3-Metric Unified Telemetry Track */}
      <View
        style={[
          styles.metricsRow,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.metricItem}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.metricLabel}>
            {t('liveHeading')}
          </AppText>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.metricValue}>
            {heading}°
          </AppText>
        </View>

        <View style={[styles.metricDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.metricItem}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.metricLabel}>
            {t('qiblaAngle')}
          </AppText>
          <AppText variant="titleSmall" color={theme.colors.primary} style={styles.metricValue}>
            {qiblaBearing}° {cardinal}
          </AppText>
        </View>

        <View style={[styles.metricDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.metricItem}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.metricLabel}>
            {t('distance')}
          </AppText>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.metricValue}>
            {distanceKm.toLocaleString()} km
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  guidanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    gap: SPACING.sm,
  },
  guidanceIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidanceText: {
    flex: 1,
    fontWeight: '700',
    fontSize: 13,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    fontWeight: '800',
    fontSize: 14,
  },
  metricDivider: {
    width: 1,
    height: 28,
  },
});
