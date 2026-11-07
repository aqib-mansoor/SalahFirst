import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface QiblaTelemetryCardProps {
  heading: number;
  qiblaBearing: number;
  relativePointerAngle: number;
  distanceKm: number;
  cardinal: string;
  isAligned: boolean;
}

export const QiblaTelemetryCard: React.FC<QiblaTelemetryCardProps> = ({
  heading,
  qiblaBearing,
  relativePointerAngle,
  distanceKm,
  cardinal,
  isAligned,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const diffDegrees = Math.round(
    relativePointerAngle > 180 ? 360 - relativePointerAngle : relativePointerAngle
  );

  return (
    <View style={styles.container}>
      {/* Alignment Guidance Pill */}
      <View
        style={[
          styles.guidancePill,
          {
            backgroundColor: isAligned
              ? theme.colors.mintTint
              : theme.colors.surface,
            borderColor: isAligned
              ? theme.colors.accent
              : theme.colors.border,
          },
        ]}
      >
        <AppText
          variant="bodySmall"
          color={isAligned ? theme.colors.primary : theme.colors.textMuted}
          style={styles.guidanceText}
        >
          {isAligned
            ? t('facingKaaba')
            : `${t('rotatePhone')} (${diffDegrees}°)`}
        </AppText>
      </View>

      {/* Telemetry Metrics Row */}
      <View
        style={[
          styles.metricsRow,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
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
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  guidancePill: {
    paddingHorizontal: SPACING.md + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidanceText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  metricItem: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  metricValue: {
    fontWeight: '800',
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
});

