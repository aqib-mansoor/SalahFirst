import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { IslamicMihrabCanvas } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import type { PrayerPeriodCategory } from '@/types';
import { PrayerStatus } from '@/hooks/usePrayerTracker';
import { HeroFocusButton } from './HeroFocusButton';
import { HeroCountdownTelemetry } from './HeroCountdownTelemetry';
import { HeroTodayTrackerGlance } from './HeroTodayTrackerGlance';

const OBLIGATORY_PRAYERS = new Set(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']);

const PRAYER_ARABIC_NAMES: Record<string, string> = {
  fajr: 'الفَجْر',
  sunrise: 'الشُّرُوق',
  shurooq: 'الشُّرُوق',
  dhuhr: 'الظُّهْر',
  jumuah: 'الجُمُعَة',
  asr: 'العَصْر',
  maghrib: 'المَغْرِب',
  isha: 'العِشَاء',
  qiyam: 'القِيَام',
  tahajjud: 'التَّهَجُّد',
};

export interface HomeHeroCardProps {
  currentPrayerName: string;
  currentTimeFormatted: string;
  nextPrayerName: string;
  nextPrayerTimeFormatted: string;
  countdownText: string;
  currentObligatoryName?: string;
  isCurrentCompleted?: boolean;
  allCompleted?: boolean;
  completedCount?: number;
  streakCount?: number;
  progressRatio?: number;
  offsetBadge?: string | null;
  onStartPrayerFocus?: () => void;
  onOpenFocusSettings?: () => void;
  periodCategory?: PrayerPeriodCategory;
  periodId?: string;
  sunriseTimeFormatted?: string;
  prayers?: PrayerStatus[];
  onOpenTracker?: () => void;
}

/**
 * HomeHeroCard
 * Twin-Card Islamic Dashboard:
 * - Card 1 (Left): Next prayer telemetry card with architectural Mihrab canvas lines.
 * - Card 2 (Right): Today's Salah progress ring & 5-Prayer Micro Pips with architectural Mihrab canvas lines.
 * - Bottom: Full-width mature focus capsule button with 18px corners.
 */
export const HomeHeroCard: React.FC<HomeHeroCardProps> = ({
  nextPrayerName,
  nextPrayerTimeFormatted,
  countdownText,
  currentObligatoryName,
  completedCount = 0,
  streakCount = 0,
  onStartPrayerFocus,
  onOpenFocusSettings,
  sunriseTimeFormatted,
  prayers,
  onOpenTracker,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const isFriday = new Date().getDay() === 5;
  const resolvePrayerLabel = (name: string) => {
    if (isFriday && name.toLowerCase() === 'dhuhr') {
      return (t('jumuah' as any) as string) || "Jumu'ah";
    }
    return (t(name as any) as string) || (t(name.toLowerCase() as any) as string) || name;
  };

  const localizedNextPrayer = resolvePrayerLabel(nextPrayerName);
  const normalizedKey = (nextPrayerName || '').toLowerCase().trim();
  const arabicPrayer = PRAYER_ARABIC_NAMES[normalizedKey] || '';

  const targetObligatory =
    currentObligatoryName && OBLIGATORY_PRAYERS.has(currentObligatoryName)
      ? currentObligatoryName
      : nextPrayerName && OBLIGATORY_PRAYERS.has(nextPrayerName)
      ? nextPrayerName
      : undefined;

  const localizedFocusPrayer = targetObligatory
    ? resolvePrayerLabel(targetObligatory)
    : undefined;

  return (
    <View style={styles.container}>
      {/* Twin Cards Row: 2 Separate Cards with Architectural Mihrab Lines Canvas */}
      <View style={styles.twinCardsRow}>
        {/* Card 1: Next Prayer Telemetry */}
        <View style={[styles.prayerCard, { backgroundColor: theme.colors.primaryHero }]}>
          <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.28} style={styles.canvas} />
          <HeroCountdownTelemetry
            theme={theme}
            localizedNextPrayer={localizedNextPrayer}
            arabicPrayer={arabicPrayer}
            countdownText={countdownText}
            nextPrayerTimeFormatted={nextPrayerTimeFormatted}
          />
        </View>

        {/* Card 2: Today's Salah Progress & 5-Prayer Pips Tracker */}
        <HeroTodayTrackerGlance
          completedCount={completedCount}
          streakCount={streakCount}
          sunriseTimeFormatted={sunriseTimeFormatted}
          prayers={prayers}
          onPress={onOpenTracker}
        />
      </View>

      {/* Standalone Full-Width Focus Capsule */}
      <HeroFocusButton
        prayerName={localizedFocusPrayer}
        durationMinutes={15}
        onPress={onStartPrayerFocus}
        onOpenSettings={onOpenFocusSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: SPACING.sm,
  },
  twinCardsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: SPACING.sm,
    width: '100%',
  },
  prayerCard: {
    flex: 1.1,
    borderRadius: 18,
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.sm + 2,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 128,
    overflow: 'hidden',
    position: 'relative',
  },
  canvas: {
    borderRadius: 18,
  },
});
