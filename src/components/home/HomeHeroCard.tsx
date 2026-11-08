import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas } from '@/components/common';
import { IslamicWatermark } from '@/components/welcome/IslamicWatermark';
import { useTranslation } from '@/context/LocalizationContext';
import type { PrayerPeriodCategory } from '@/types';
import { HeroFocusButton } from './HeroFocusButton';

export interface HomeHeroCardProps {
  currentPrayerName: string;
  currentTimeFormatted: string;
  nextPrayerName: string;
  nextPrayerTimeFormatted: string;
  countdownText: string;
  isCurrentCompleted?: boolean;
  onStartPrayerFocus?: () => void;
  periodCategory?: PrayerPeriodCategory;
  periodSubtitleKey?: string;
  periodId?: string;
}

export const HomeHeroCard: React.FC<HomeHeroCardProps> = ({
  currentPrayerName,
  currentTimeFormatted,
  nextPrayerName,
  nextPrayerTimeFormatted,
  countdownText,
  isCurrentCompleted = false,
  onStartPrayerFocus,
  periodCategory = 'obligatory',
  periodSubtitleKey,
  periodId,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const localizedCurrentPrayer =
    (t(currentPrayerName as any) as string) ||
    (t(currentPrayerName.toLowerCase() as any) as string) ||
    currentPrayerName;
  const localizedNextPrayer =
    (t(nextPrayerName.toLowerCase() as any) as string) || nextPrayerName;

  let statusText = isCurrentCompleted ? `${t('completed')} ✓` : t('pending');
  let statusPillStyle = isCurrentCompleted ? styles.statusPillCompleted : styles.statusPill;
  let statusTextColor = isCurrentCompleted ? theme.colors.accent : 'rgba(255, 255, 255, 0.85)';
  let dotColor = theme.colors.accent;

  if (periodCategory === 'prohibited') {
    statusText = t('prohibited');
    statusPillStyle = styles.statusPillProhibited;
    statusTextColor = '#FF8A80';
    dotColor = '#FF8A80';
  } else if (periodCategory === 'nafl') {
    statusText = periodId === 'tahajjud_last_third' ? t('lastThirdPill') : t('nafl');
    statusPillStyle = styles.statusPillNafl;
    statusTextColor = theme.colors.accent;
    dotColor = theme.colors.accent;
  } else if (periodCategory === 'informational') {
    statusText = t('detectingLocation');
    statusPillStyle = styles.statusPill;
    statusTextColor = 'rgba(255, 255, 255, 0.85)';
    dotColor = theme.colors.secondary;
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.primaryHero }]}>
      <IslamicMihrabCanvas
        goldColor={theme.colors.accent}
        opacity={0.16}
      />
      <IslamicWatermark
        size={240}
        opacity={0.07}
        color={theme.colors.accent}
        style={styles.watermarkTopRight}
      />

      {/* Top Section: Pill + Status */}
      <View style={styles.topSection}>
        <View style={styles.topRow}>
          <View style={[styles.currentTag, { borderColor: 'rgba(243, 196, 64, 0.35)', backgroundColor: 'rgba(0, 0, 0, 0.18)' }]}>
            <View style={[styles.goldDot, { backgroundColor: dotColor }]} />
            <AppText variant="caption" color={theme.colors.accentLight} style={styles.currentText}>
              {t('currentPrayer')}: {localizedCurrentPrayer} ({currentTimeFormatted})
            </AppText>
          </View>

          <View style={[styles.statusPill, statusPillStyle]}>
            <AppText variant="caption" color={statusTextColor} style={styles.completedTag}>
              {statusText}
            </AppText>
          </View>
        </View>
      </View>

      {/* Center Countdown & Azan Time */}
      <View style={styles.centerRow}>
        <View style={styles.leftCountdown}>
          <AppText variant="bodySmall" color={theme.colors.accentLight} style={styles.nextPrayerLabel}>
            {t('nextPrayer')} • <AppText color={theme.colors.textOnPrimary} style={styles.nextPrayerBold}>{localizedNextPrayer}</AppText>
          </AppText>

          <AppText color={theme.colors.textOnPrimary} style={styles.countdownNumber}>
            {countdownText}
          </AppText>
        </View>

        <View style={styles.rightAzan}>
          <AppText variant="caption" color={theme.colors.accentLight} style={styles.azanLabel}>
            {t('azanTime')}
          </AppText>
          <AppText color={theme.colors.textOnPrimary} style={styles.azanTime}>
            {nextPrayerTimeFormatted}
          </AppText>
        </View>
      </View>

      {/* "Start Prayer Focus" CTA Button */}
      <HeroFocusButton onPress={onStartPrayerFocus} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 224,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    borderWidth: 1.2,
    borderColor: 'rgba(243, 196, 64, 0.40)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  watermarkTopRight: {
    top: -40,
    right: -40,
  },
  topSection: {
    gap: SPACING.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitleRow: {
    paddingHorizontal: 2,
  },
  subtitleText: {
    fontSize: 11.5,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  currentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
  },
  goldDot: {
    width: 6, height: 6, borderRadius: 3,
  },
  currentText: {
    fontWeight: '700', fontSize: 11,
  },
  statusPill: {
    paddingHorizontal: SPACING.sm + 2, paddingVertical: 3,
    borderRadius: RADIUS.full, backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  statusPillCompleted: { backgroundColor: 'rgba(243, 196, 64, 0.22)' },
  statusPillProhibited: { backgroundColor: 'rgba(239, 83, 80, 0.22)' },
  statusPillNafl: { backgroundColor: 'rgba(243, 196, 64, 0.22)' },
  completedTag: { fontWeight: '700', fontSize: 11 },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
  },
  leftCountdown: {
    gap: 3,
  },
  nextPrayerLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  nextPrayerBold: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  countdownNumber: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
  rightAzan: {
    alignItems: 'flex-end',
    gap: 2,
  },
  azanLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  azanTime: {
    fontSize: 24,
    fontWeight: '800',
  },
});
