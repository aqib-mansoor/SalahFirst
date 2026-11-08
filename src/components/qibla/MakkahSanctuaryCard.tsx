import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface MakkahSanctuaryCardProps {
  distanceKm: number;
  qiblaBearing: number;
}

export const MakkahSanctuaryCard: React.FC<MakkahSanctuaryCardProps> = ({
  distanceKm,
  qiblaBearing,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [makkahTime, setMakkahTime] = useState<string>('--:--');

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Riyadh',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date());
        setMakkahTime(`${formatted} AST`);
      } catch {
        setMakkahTime('UTC+3');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint }]}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Rect
                x="5"
                y="5"
                width="14"
                height="14"
                rx="3"
                stroke={theme.colors.primary}
                strokeWidth="2"
              />
              <Path
                d="M5 10h14"
                stroke={theme.colors.accent}
                strokeWidth="2"
              />
              <Path
                d="M13 14h3v5h-3z"
                fill={theme.colors.accent}
              />
            </Svg>
          </View>
          <View style={styles.headerText}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldTitle}>
              {t('makkahSanctuary')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
              {t('makkahSubtitle')}
            </AppText>
          </View>
        </View>

        {/* 2x2 Telemetry Metric Grid */}
        <View style={styles.grid}>
          <View
            style={[
              styles.metricCell,
              { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border },
            ]}
          >
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.metricLabel}>
              {t('makkahLocalTime')}
            </AppText>
            <AppText variant="titleSmall" color={theme.colors.primary} style={styles.metricValue}>
              {makkahTime}
            </AppText>
          </View>

          <View
            style={[
              styles.metricCell,
              { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border },
            ]}
          >
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.metricLabel}>
              {t('kaabaCoordinates')}
            </AppText>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.metricValue}>
              21.42° N, 39.82° E
            </AppText>
          </View>

          <View
            style={[
              styles.metricCell,
              { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border },
            ]}
          >
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.metricLabel}>
              {t('distance')}
            </AppText>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.metricValue}>
              {distanceKm.toLocaleString()} km
            </AppText>
          </View>

          <View
            style={[
              styles.metricCell,
              { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border },
            ]}
          >
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.metricLabel}>
              {t('qiblaAngle')}
            </AppText>
            <AppText variant="titleSmall" color={theme.colors.primary} style={styles.metricValue}>
              {qiblaBearing}° Azimuth
            </AppText>
          </View>
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
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  boldTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  metricCell: {
    flexBasis: '48%',
    flexGrow: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});
