import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface CalendarMonthHeaderProps {
  monthName: string;
  hijriMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarMonthHeader: React.FC<CalendarMonthHeaderProps> = ({
  monthName,
  hijriMonth,
  onPrevMonth,
  onNextMonth,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.titleCol}>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.monthTitle}>
          {monthName}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.hijriTitle}>
          {hijriMonth}
        </AppText>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <Pressable
          onPress={onPrevMonth}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Previous Month"
          style={({ pressed }) => [
            styles.navBtn,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18L9 12L15 6" stroke={theme.colors.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        <Pressable
          onPress={onNextMonth}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Next Month"
          style={({ pressed }) => [
            styles.navBtn,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M9 18L15 12L9 6" stroke={theme.colors.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
  },
  titleCol: {
    gap: 2,
  },
  monthTitle: {
    fontWeight: '800',
  },
  hijriTitle: {
    fontWeight: '600',
  },
  navRow: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
