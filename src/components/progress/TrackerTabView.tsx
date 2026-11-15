import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { PrayerStatus } from '@/hooks/usePrayerTracker';
import { DayOverview } from '@/utils/trackerStatistics';
import { TrackerHeroCard } from './TrackerHeroCard';
import { TrackerPrayerRow } from './TrackerPrayerRow';
import { TrackerSunnahCard } from './TrackerSunnahCard';
import { TrackerWeekOverview } from './TrackerWeekOverview';
import { TrackerWisdomBanner } from './TrackerWisdomBanner';

export interface TrackerTabViewProps {
  completedCount: number;
  prayersList: PrayerStatus[];
  dayOverview: DayOverview[];
  onToggleTrackerPrayer: (
    prayerName: string,
    hasStarted: boolean,
    completed: boolean,
    time: string
  ) => void;
  onOpenStatistics: () => void;
}

export const TrackerTabView: React.FC<TrackerTabViewProps> = ({
  completedCount,
  prayersList,
  dayOverview,
  onToggleTrackerPrayer,
  onOpenStatistics,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.headerTitles}>
        <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
          {t('dailySalahTrackerTitle')}
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.subtitle}>
          {t('dailySalahTrackerSubtitle')}
        </AppText>
      </View>

      <TrackerHeroCard completedCount={completedCount} />

      <View style={styles.prayersList}>
        {prayersList.map((prayer) => (
          <TrackerPrayerRow
            key={prayer.name}
            prayer={prayer}
            onPressStatus={() =>
              onToggleTrackerPrayer(
                prayer.name,
                prayer.hasStarted,
                prayer.completed,
                prayer.time
              )
            }
          />
        ))}
      </View>

      <TrackerSunnahCard />
      <TrackerWeekOverview weekData={dayOverview} onOpenStatistics={onOpenStatistics} />
      <TrackerWisdomBanner />
    </>
  );
};

const styles = StyleSheet.create({
  headerTitles: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    gap: 2,
  },
  title: {
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  },
  prayersList: {
    gap: SPACING.xs + 2,
  },
});
