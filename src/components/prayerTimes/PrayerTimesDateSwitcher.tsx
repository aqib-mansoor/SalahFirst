import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface PrayerTimesDateSwitcherProps {
  date: Date;
  dateOffset: number;
  hijriDateFormatted: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onResetToday: () => void;
}

export const PrayerTimesDateSwitcher: React.FC<PrayerTimesDateSwitcherProps> = ({
  date,
  dateOffset,
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

  const isToday = dateOffset === 0;

  // Clear, natural relative labels
  let dateTitle = gregorianDate;
  if (dateOffset === 0) {
    dateTitle = `${t('today')} • ${gregorianDate}`;
  } else if (dateOffset === -1) {
    dateTitle = `${t('yesterday')} • ${gregorianDate}`;
  } else if (dateOffset === 1) {
    dateTitle = `${t('tomorrow')} • ${gregorianDate}`;
  }

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
        <AppText variant="titleSmall" color={theme.colors.text} numberOfLines={1} style={styles.dateTitle}>
          {dateTitle}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1} style={styles.hijriText}>
          {hijriDateFormatted}
        </AppText>

        {!isToday && (
          <Pressable
            onPress={onResetToday}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Return to today"
            style={({ pressed }) => [
              styles.resetBtn,
              {
                backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.secondaryTint,
                borderColor: theme.colors.primary,
              },
            ]}
          >
            <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                stroke={theme.colors.primary}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M3 3v5h5"
                stroke={theme.colors.primary}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <AppText variant="caption" color={theme.colors.primary} style={styles.resetBtnText}>
              {t('backToToday')}
            </AppText>
          </Pressable>
        )}
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
  dateTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  hijriText: {
    fontSize: 11,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginTop: 2,
  },
  resetBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
