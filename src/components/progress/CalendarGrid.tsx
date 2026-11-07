import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { CalendarDayCell } from '@/utils/calendarUtils';

export interface CalendarGridProps {
  leadingEmptyCount: number;
  cells: CalendarDayCell[];
  onSelectDay: (day: number) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  leadingEmptyCount,
  cells,
  onSelectDay,
}) => {
  const theme = useTheme();
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
        {/* Leading empty cells for correct weekday offset */}
        {Array.from({ length: leadingEmptyCount }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.emptyCell} />
        ))}

        {/* Real calendar cells */}
        {cells.map((cell) => {
          const isSelected = cell.isSelected;
          const isToday = cell.isToday;

          return (
            <Pressable
              key={cell.dateKey}
              onPress={() => onSelectDay(cell.dayNumber)}
              style={[
                styles.dayCell,
                isSelected
                  ? { backgroundColor: theme.colors.primary }
                  : { backgroundColor: theme.colors.surfaceElevated },
                isToday && !isSelected && {
                  borderColor: theme.colors.accent,
                  borderWidth: 1.5,
                },
              ]}
            >
              <AppText
                variant="bodySmall"
                color={isSelected ? theme.colors.textInverse : theme.colors.text}
                style={[styles.dayNumber, (isSelected || isToday) && styles.todayNumber]}
              >
                {cell.dayNumber}
              </AppText>

              {/* 5 Indicator Dots beneath */}
              <View style={styles.dotsRow}>
                {cell.hasRecord ? (
                  cell.completedPrayers.map((done, dotIdx) => (
                    <View
                      key={dotIdx}
                      style={[
                        styles.dot,
                        done
                          ? { backgroundColor: isSelected ? theme.colors.accent : theme.colors.primary }
                          : { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : theme.colors.border },
                      ]}
                    />
                  ))
                ) : (
                  <View
                    style={[
                      styles.unrecordedDot,
                      { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : theme.colors.border },
                    ]}
                  />
                )}
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
    justifyContent: 'flex-start',
  },
  emptyCell: {
    width: '12.8%',
    aspectRatio: 0.95,
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
    minHeight: 4,
  },
  dot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
  },
  unrecordedDot: {
    width: 10,
    height: 2,
    borderRadius: 1,
  },
});
