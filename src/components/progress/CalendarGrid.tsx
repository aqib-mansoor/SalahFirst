import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface CalendarGridProps {
  selectedDay: number;
  todayDay: number;
  onSelectDay: (day: number) => void;
  dayPrayerMap: Record<number, boolean[]>; // dayNumber -> boolean[5]
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDay,
  todayDay,
  onSelectDay,
  dayPrayerMap,
}) => {
  const theme = useTheme('light');

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const totalDays = 30; // November

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
      {/* Weekday Header */}
      <View style={styles.weekdaysRow}>
        {weekdays.map((w, i) => (
          <AppText
            key={i}
            variant="caption"
            color={theme.colors.textMuted}
            style={styles.weekdayText}
          >
            {w}
          </AppText>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.gridContainer}>
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isSelected = day === selectedDay;
          const isToday = day === todayDay;
          const prayers = dayPrayerMap[day] || (day <= todayDay ? [true, true, true, true, true] : [false, false, false, false, false]);

          return (
            <Pressable
              key={day}
              onPress={() => onSelectDay(day)}
              style={[
                styles.dayCell,
                isSelected
                  ? { backgroundColor: theme.colors.primary }
                  : { backgroundColor: theme.colors.surfaceElevated },
              ]}
            >
              <AppText
                variant="bodySmall"
                color={isSelected ? theme.colors.textInverse : theme.colors.text}
                style={[styles.dayNumber, (isSelected || isToday) && styles.todayNumber]}
              >
                {day}
              </AppText>

              {/* 5 Dots beneath */}
              <View style={styles.dotsRow}>
                {prayers.map((done, dotIdx) => (
                  <View
                    key={dotIdx}
                    style={[
                      styles.dot,
                      done
                        ? { backgroundColor: isSelected ? theme.colors.accent : theme.colors.primary }
                        : { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : theme.colors.border },
                    ]}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: SPACING.xs,
  },
  weekdayText: {
    fontWeight: '700',
    width: 38,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
  },
  dayCell: {
    width: '12.8%',
    aspectRatio: 0.95,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  dayNumber: {
    fontWeight: '700',
    fontSize: 13,
  },
  todayNumber: {
    fontWeight: '900',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  dot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
  },
});
