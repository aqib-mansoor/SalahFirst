import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import type { PrayerPeriodCategory } from '@/types';
import { HeroFocusButton } from './HeroFocusButton';
import { HeroCompletionBanner } from './HeroCompletionBanner';
import { HeroGeometricWatermark } from './HeroGeometricWatermark';

export interface HomeHeroCardProps {
  currentPrayerName: string;
  currentTimeFormatted: string;
  nextPrayerName: string;
  nextPrayerTimeFormatted: string;
  countdownText: string;
  currentObligatoryName?: string;
  isCurrentCompleted?: boolean;
  allCompleted?: boolean;
  showFocusButton?: boolean;
  focusPendingNotice?: string | null;
  onStartPrayerFocus?: () => void;
  periodCategory?: PrayerPeriodCategory;
  periodId?: string;
}

export const HomeHeroCard: React.FC<HomeHeroCardProps> = ({
  currentPrayerName,
  currentTimeFormatted,
  nextPrayerName,
  nextPrayerTimeFormatted,
  countdownText,
  currentObligatoryName,
  isCurrentCompleted = false,
  allCompleted = false,
  showFocusButton = false,
  focusPendingNotice,
  onStartPrayerFocus,
  periodCategory = 'obligatory',
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

  const defaultObligatory = {
    text: isCurrentCompleted ? `${t('completed')} ✓` : t('pending'),
    color: isCurrentCompleted ? theme.colors.accent : 'rgba(255, 255, 255, 0.85)',
    dot: theme.colors.accent,
  };

  const statusConfig = {
    prohibited: { text: t('prohibited'), color: '#FF8A80', dot: '#FF8A80' },
    nafl: {
      text: periodId === 'tahajjud_last_third' ? t('lastThirdPill') : t('nafl'),
      color: theme.colors.accent,
      dot: theme.colors.accent,
    },
    informational: { text: t('detectingLocation'), color: 'rgba(255, 255, 255, 0.85)', dot: theme.colors.secondary },
    obligatory: defaultObligatory,
  }[periodCategory] || defaultObligatory;

  const localizedObligatory = currentObligatoryName
    ? (t(currentObligatoryName.toLowerCase() as any) as string) || currentObligatoryName
    : localizedCurrentPrayer;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.primaryHero }]}>
      <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.14} />
      <HeroGeometricWatermark color={theme.colors.accent} opacity={0.10} />

      {/* Top Row: Current Prayer Pill & Period Type Pill */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.currentTag,
            { borderColor: 'rgba(247, 207, 87, 0.35)', backgroundColor: 'rgba(0, 0, 0, 0.20)' },
          ]}
        >
          <View style={[styles.goldDot, { backgroundColor: statusConfig.dot }]} />
          <AppText variant="caption" color={theme.colors.accentLight} style={styles.currentText}>
            {t('currentPrayer').toUpperCase()}: {localizedCurrentPrayer} ({currentTimeFormatted})
          </AppText>
        </View>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: 'rgba(0, 0, 0, 0.20)', borderColor: 'rgba(247, 207, 87, 0.25)' },
          ]}
        >
          <AppText variant="caption" color={statusConfig.color} style={styles.statusText}>
            {statusConfig.text}
          </AppText>
        </View>
      </View>

      {/* Center Row: Next Prayer Countdown & Azan Time */}
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

      {/* Bottom Row: Dynamic Completion Banner, Focus CTA, or Offset Notice */}
      {allCompleted ? (
        <HeroCompletionBanner
          message={(t('allPrayersCompleted') as string) || 'All 5 prayers completed! Alhamdulillah'}
        />
      ) : isCurrentCompleted && currentObligatoryName ? (
        <HeroCompletionBanner
          message={`${localizedObligatory} completed! Alhamdulillah`}
        />
      ) : showFocusButton ? (
        <HeroFocusButton
          prayerName={localizedObligatory}
          durationMinutes={15}
          onPress={onStartPrayerFocus}
        />
      ) : focusPendingNotice ? (
        <View style={styles.offsetNoticePill}>
          <View style={[styles.miniDot, { backgroundColor: theme.colors.accent }]} />
          <AppText variant="caption" color={theme.colors.accentLight} style={styles.offsetNoticeText}>
            {focusPendingNotice}
          </AppText>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 200,
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 4,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    borderWidth: 1.2,
    borderColor: 'rgba(247, 207, 87, 0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  currentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  goldDot: { width: 6, height: 6, borderRadius: 3 },
  currentText: { fontWeight: '700', fontSize: 11, letterSpacing: 0.3 },
  statusPill: { paddingHorizontal: SPACING.sm + 4, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 0.8 },
  statusText: { fontWeight: '700', fontSize: 11 },
  centerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginVertical: SPACING.xs, zIndex: 1 },
  leftCountdown: { gap: 2 },
  nextPrayerLabel: { fontSize: 12.5, lineHeight: 17 },
  nextPrayerBold: { fontWeight: '700', fontSize: 13 },
  countdownNumber: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: 0.6,
    fontVariant: ['tabular-nums'],
  },
  rightAzan: {
    alignItems: 'flex-end',
    gap: 1,
  },
  azanLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  azanTime: {
    fontSize: 22,
    fontWeight: '800',
  },
  offsetNoticePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: RADIUS.full,
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm + 2,
    gap: 6,
    borderWidth: 0.8,
    borderColor: 'rgba(247, 207, 87, 0.20)',
  },
  miniDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
  },
  offsetNoticeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
