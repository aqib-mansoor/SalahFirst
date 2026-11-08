import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface PrayerTimesDateSwitcherProps {
  date: Date;
  isToday: boolean;
  hijriDateFormatted: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onResetToday: () => void;
}

export const PrayerTimesDateSwitcher: React.FC<PrayerTimesDateSwitcherProps> = ({
  date,
  isToday,
  hijriDateFormatted,
  onPrevDay,
  onNextDay,
  onResetToday,
}) => {
  const theme = useTheme();
  const { language, t } = useTranslation();

  const locale = language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US';
  const gregorianDate = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrevDay}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Previous day"
        style={({ pressed }) => [
          styles.arrowBtn,
          {
            backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 18l-6-6 6-6"
            stroke={theme.colors.text}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>

      <View style={styles.centerBlock}>
        <View style={styles.dateRow}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.dateTitle}>
            {isToday ? `${t('today')} • ${gregorianDate}` : gregorianDate}
          </AppText>
          {!isToday && (
            <Pressable
              onPress={onResetToday}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel="Return to today"
              style={[styles.todayChip, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.primary }]}
            >
              <AppText variant="caption" color={theme.colors.primary} style={styles.todayChipText}>
                {t('returnToToday')}
              </AppText>
            </Pressable>
          )}
        </View>
        <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1} style={styles.hijriText}>
          {hijriDateFormatted}
        </AppText>
      </View>

      <Pressable
        onPress={onNextDay}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Next day"
        style={({ pressed }) => [
          styles.arrowBtn,
          {
            backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 18l6-6-6-6"
            stroke={theme.colors.text}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  arrowBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dateTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  todayChip: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  todayChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  hijriText: {
    fontSize: 11,
  },
});
