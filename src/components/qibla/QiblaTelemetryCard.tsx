import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface QiblaTelemetryCardProps {
  heading: number;
  qiblaBearing: number;
  distanceKm: number;
  cardinal: string;
}

export const QiblaTelemetryCard: React.FC<QiblaTelemetryCardProps> = ({
  heading,
  qiblaBearing,
  distanceKm,
  cardinal,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
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
