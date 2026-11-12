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
          <AppText variant="titleMedium" color={theme.colors.text} style={styles.metricValue}>
            {heading}°
          </AppText>
        </View>

        <View style={[styles.metricDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.metricItem}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.metricLabel}>
            {t('qiblaAngle')}
          </AppText>
          <AppText variant="titleMedium" color={theme.colors.primary} style={styles.metricValue}>
            {qiblaBearing}° {cardinal}
          </AppText>
        </View>

        <View style={[styles.metricDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.metricItem}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.metricLabel}>
            {t('distance')}
          </AppText>
          <AppText variant="titleMedium" color={theme.colors.text} style={styles.metricValue}>
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
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  metricDivider: {
    width: 1,
    height: 32,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontWeight: '800',
    fontSize: 15,
  },
});
