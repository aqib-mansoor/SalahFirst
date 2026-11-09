import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { PresetCity } from '@/data';
import { FormattedPrayerTimes } from '@/utils/prayerTimes';
import { LocationTimeDiff } from '@/utils/timezone';
import { LocationChangePrayersGrid } from './LocationChangePrayersGrid';

export interface LocationChangeBreakdownCardProps {
  currentCityName: string;
  currentCountry?: string;
  destinationCity: PresetCity;
  timeDiff: LocationTimeDiff;
  destPrayerTimes: FormattedPrayerTimes;
  todayCompleted: Record<string, boolean>;
}

export const LocationChangeBreakdownCard: React.FC<LocationChangeBreakdownCardProps> = ({
  currentCityName,
  currentCountry,
  destinationCity,
  timeDiff,
  destPrayerTimes,
  todayCompleted,
}) => {
  const theme = useTheme();
  const completedCount = Object.values(todayCompleted).filter(Boolean).length;

  return (
    <View style={styles.container}>
      {/* 1. Journey Route (From -> To) */}
      <View style={[styles.routeCard, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
        <View style={styles.cityCol}>
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.labelCaps}>
            FROM
          </AppText>
          <AppText variant="titleSmall" color={theme.colors.textPrimary} numberOfLines={1} style={styles.cityName}>
            {currentCityName}
          </AppText>
          {!!currentCountry && (
            <AppText variant="caption" color={theme.colors.textSecondary} numberOfLines={1}>
              {currentCountry}
            </AppText>
          )}
        </View>

        <View style={[styles.arrowCircle, { backgroundColor: theme.colors.secondaryTint }]}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12h14M12 5l7 7-7 7" stroke={theme.colors.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>

        <View style={[styles.cityCol, styles.cityColRight]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.labelCaps}>
            TO (DESTINATION)
          </AppText>
          <AppText variant="titleSmall" color={theme.colors.primary} numberOfLines={1} style={styles.cityName}>
            {destinationCity.name}
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary} numberOfLines={1}>
            {destinationCity.country}
          </AppText>
        </View>
      </View>

      {/* 2. Destination Local Time & Offset Badge */}
      <View style={[styles.timeCard, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
        <View style={styles.timeMainRow}>
          <View>
            <AppText variant="titleLarge" color={theme.colors.textPrimary} style={styles.timeText}>
              {timeDiff.destinationTime}
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {timeDiff.destinationDate}
              {timeDiff.dayRelation !== 'same' ? ` (${timeDiff.dayRelation.toUpperCase()})` : ''}
            </AppText>
          </View>

          <View style={[styles.diffBadge, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.primary }]}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="9" stroke={theme.colors.primary} strokeWidth="2" />
              <Path d="M12 7v5l3 2" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" />
            </Svg>
            <AppText variant="caption" color={theme.colors.primary} style={styles.diffText}>
              {timeDiff.differenceText}
            </AppText>
          </View>
        </View>
      </View>

      {/* 3. Daily Salah Tracking Breakdown */}
      <View style={[styles.salahCard, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
        <View style={styles.salahHeaderRow}>
          <View style={[styles.checkCircle, { backgroundColor: theme.colors.secondaryTint }]}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M5 13l4 4L19 7" stroke={theme.colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={styles.salahHeaderTextWrap}>
            <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.salahTitle}>
              {completedCount} of 5 Prayers Completed
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              Logged prayers are preserved. Remaining follow local sun time.
            </AppText>
          </View>
        </View>

        <LocationChangePrayersGrid
          destPrayerTimes={destPrayerTimes}
          todayCompleted={todayCompleted}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
    width: '100%',
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  cityCol: {
    flex: 1,
  },
  cityColRight: {
    alignItems: 'flex-end',
  },
  labelCaps: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  cityName: {
    fontWeight: '800',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.xs,
  },
  timeCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  timeMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  diffText: {
    fontWeight: '700',
    fontSize: 11,
  },
  salahCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  salahHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salahHeaderTextWrap: {
    flex: 1,
  },
  salahTitle: {
    fontWeight: '800',
  },
});
