import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { FormattedPrayerTimes } from '@/utils/prayerTimes';

interface PrayersGridProps {
  destPrayerTimes: FormattedPrayerTimes;
  todayCompleted: Record<string, boolean>;
}

const PRAYERS: Array<{ key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; label: string }> = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
];

export const LocationChangePrayersGrid: React.FC<PrayersGridProps> = ({
  destPrayerTimes,
  todayCompleted,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.prayersGrid}>
      {PRAYERS.map(({ key, label }) => {
        const isCompleted = !!todayCompleted[label];
        const azanTime = destPrayerTimes[key] || '--:--';

        return (
          <View
            key={key}
            style={[
              styles.prayerChip,
              {
                backgroundColor: isCompleted ? theme.colors.secondaryTint : theme.colors.surface,
                borderColor: isCompleted ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <AppText
              variant="caption"
              color={isCompleted ? theme.colors.primary : theme.colors.textPrimary}
              style={styles.prayerLabel}
            >
              {label}
            </AppText>
            <AppText
              variant="caption"
              color={isCompleted ? theme.colors.primary : theme.colors.textSecondary}
              style={styles.prayerTime}
            >
              {azanTime}
            </AppText>
            <AppText
              variant="caption"
              color={isCompleted ? theme.colors.primary : theme.colors.textMuted}
              style={[styles.prayerStatus, isCompleted && styles.statusBold]}
            >
              {isCompleted ? '✓ Done' : 'Pending'}
            </AppText>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  prayersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  prayerChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  prayerLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  prayerTime: {
    fontSize: 10,
    marginVertical: 2,
    fontWeight: '600',
  },
  prayerStatus: {
    fontSize: 9,
  },
  statusBold: {
    fontWeight: '800',
  },
});

