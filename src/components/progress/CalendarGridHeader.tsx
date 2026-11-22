import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface CalendarGridHeaderProps {
  monthName: string;
  hijriMonth: string;
  isCurrentMonth: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToday: () => void;
}

export const CalendarGridHeader: React.FC<CalendarGridHeaderProps> = ({
  monthName,
  hijriMonth,
  isCurrentMonth,
  onPrevMonth,
  onNextMonth,
  onJumpToday,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.headerRow}>
      <View style={styles.titleCol}>
        <AppText variant="titleMedium" color={theme.colors.text} style={styles.monthTitle}>
          {monthName}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.hijriTitle}>
          {hijriMonth}
        </AppText>
      </View>

      <View style={styles.navGroup}>
        {!isCurrentMonth && (
          <Pressable
            onPress={onJumpToday}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Jump to Today"
            style={({ pressed }) => [
              styles.todayPill,
              {
                backgroundColor: theme.colors.secondaryTint,
                borderColor: theme.colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <AppText variant="caption" color={theme.colors.primary} style={styles.todayPillText}>
              {t('today')}
            </AppText>
          </Pressable>
        )}

        <Pressable
          onPress={onPrevMonth}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Previous Month"
          style={({ pressed }) => [
            styles.navBtn,
            { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18L9 12L15 6"
              stroke={theme.colors.text}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>

        <Pressable
          onPress={onNextMonth}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Next Month"
          style={({ pressed }) => [
            styles.navBtn,
            { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 18L15 12L9 6"
              stroke={theme.colors.text}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  titleCol: { gap: 1 },
  monthTitle: { fontWeight: '800', fontSize: 16, lineHeight: 21 },
  hijriTitle: { fontWeight: '600', fontSize: 11 },
  navGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  todayPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  todayPillText: { fontWeight: '800', fontSize: 11 },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

