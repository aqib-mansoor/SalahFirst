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
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.metricLabel}>
            {t('liveHeading')}
          </AppText>
          <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.metricValue}>
            {heading}°
          </AppText>
        </View>

        <View style={[styles.metricDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.metricItem}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.metricLabel}>
            {t('qiblaAngle')}
          </AppText>
          <AppText variant="titleMedium" color={theme.colors.primary} style={styles.metricValueHighlight}>
            {qiblaBearing}° {cardinal}
          </AppText>
        </View>

        <View style={[styles.metricDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.metricItem}>
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.metricLabel}>
            {t('distance')}
          </AppText>
          <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.metricValue}>
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
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  metricDivider: {
    width: 1,
    height: 32,
    opacity: 0.8,
  },
  metricLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: {
    fontWeight: '800',
    fontSize: 15,
  },
  metricValueHighlight: {
    fontWeight: '800',
    fontSize: 15,
  },
});

