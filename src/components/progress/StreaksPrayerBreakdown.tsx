import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export interface StreaksPrayerBreakdownProps {
  historyMap: Record<string, Record<string, boolean>>;
  streakCount: number;
}

export const StreaksPrayerBreakdown: React.FC<StreaksPrayerBreakdownProps> = ({
  historyMap,
  streakCount,
}) => {
  const theme = useTheme();

  // Calculate per-prayer consistency rate over recorded days
  const { breakdown, rankTitle, rankSubtitle } = useMemo(() => {
    const dates = Object.keys(historyMap);
    const totalDays = Math.max(dates.length, 1);

    const counts: Record<string, number> = {
      Fajr: 0,
      Dhuhr: 0,
      Asr: 0,
      Maghrib: 0,
      Isha: 0,
    };

    dates.forEach((dateKey) => {
      const dayRecord = historyMap[dateKey];
      if (dayRecord) {
        PRAYERS.forEach((p) => {
          if (dayRecord[p]) counts[p] = (counts[p] || 0) + 1;
        });
      }
    });

    const rates = PRAYERS.map((name) => {
      const percentage = dates.length > 0 ? Math.round((counts[name] / totalDays) * 100) : 0;
      return { name, percentage };
    });

    let rank = 'Seeker';
    let sub = 'Building initial consistency';
    if (streakCount >= 30) {
      rank = 'Ahl al-Istiqamah';
      sub = 'Unwavering steadfastness';
    } else if (streakCount >= 14) {
      rank = 'Muqim as-Salah';
      sub = 'Deeply rooted prayer habit';
    } else if (streakCount >= 7) {
      rank = 'Steadfast Believer';
      sub = 'Strong weekly momentum';
    } else if (streakCount >= 3) {
      rank = 'Committed Pioneer';
      sub = 'Consistent foundation formed';
    }

    return { breakdown: rates, rankTitle: rank, rankSubtitle: sub };
  }, [historyMap, streakCount]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Header & Spiritual Rank Tier */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
            Prayer Consistency Breakdown
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
            Historical completion by prayer time
          </AppText>
        </View>

        <View style={[styles.rankBadge, { backgroundColor: theme.colors.mintTint, borderColor: theme.colors.border }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.rankTitleText}>
            {rankTitle}
          </AppText>
        </View>
      </View>

      {/* 5 Progress Bars */}
      <View style={styles.barsList}>
        {breakdown.map((item) => (
          <View key={item.name} style={styles.prayerRow}>
            <View style={styles.labelCol}>
              <AppText variant="caption" color={theme.colors.text} style={styles.prayerName}>
                {item.name}
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted} style={styles.percentText}>
                {item.percentage}%
              </AppText>
            </View>

            {/* Horizontal Progress Track */}
            <View style={[styles.track, { backgroundColor: theme.colors.surfaceElevated }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.max(item.percentage, 4)}%`,
                    backgroundColor:
                      item.percentage >= 90
                        ? theme.colors.accent
                        : item.percentage >= 60
                        ? theme.colors.primary
                        : theme.colors.secondary,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCol: {
    gap: 1,
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 13,
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 10.5,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  rankTitleText: {
    fontWeight: '800',
    fontSize: 9.5,
  },
  barsList: {
    gap: 6,
    paddingTop: 2,
  },
  prayerRow: {
    gap: 3,
  },
  labelCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayerName: {
    fontWeight: '600',
    fontSize: 11,
  },
  percentText: {
    fontWeight: '700',
    fontSize: 10.5,
  },
  track: {
    height: 5,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
});

