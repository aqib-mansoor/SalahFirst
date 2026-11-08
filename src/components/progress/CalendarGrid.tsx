import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { CalendarDayCell } from '@/utils/calendarUtils';
import { useTranslation } from '@/context/LocalizationContext';

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
  const { t } = useTranslation();
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
          const isFull = cell.completedCount === 5;
          const isFuture = !!cell.isFuture;

          return (
            <Pressable
              key={cell.dateKey}
              onPress={() => onSelectDay(cell.dayNumber)}
              accessibilityRole="button"
              accessibilityLabel={`Day ${cell.dayNumber}, ${
                cell.hasRecord
                  ? `${cell.completedCount} ${t('of')} 5 ${t('completedSuffix')}`
                  : isFuture
                  ? 'Future date'
                  : t('unrecorded')
              }`}
              accessibilityState={{ selected: isSelected }}
              hitSlop={4}
              style={[
                styles.dayCell,
                isSelected
                  ? {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.accent,
                      borderWidth: 1.5,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: isToday
                        ? theme.colors.accent
                        : isFull
                        ? 'rgba(243, 196, 64, 0.35)'
                        : 'transparent',
                      borderWidth: isToday || isFull ? 1.2 : 0,
                    },
                isFuture && styles.futureCell,
              ]}
            >
              <AppText
                variant="bodySmall"
                color={
                  isSelected
                    ? theme.colors.textInverse
                    : isToday
                    ? theme.colors.accent
                    : isFuture
                    ? theme.colors.textMuted
                    : theme.colors.text
                }
                style={[
                  styles.dayNumber,
                  (isSelected || isToday) && styles.todayNumber,
                ]}
              >
                {cell.dayNumber}
              </AppText>

              {/* 5 Constellation Dots beneath */}
              <View style={styles.dotsRow}>
                {cell.hasRecord ? (
                  cell.completedPrayers.map((done, dotIdx) => (
                    <View
                      key={dotIdx}
                      style={[
                        styles.dot,
                        done
                          ? {
                              backgroundColor: isSelected
                                ? theme.colors.accent
                                : isFull
                                ? theme.colors.accent
                                : theme.colors.primary,
                            }
                          : {
                              backgroundColor: isSelected
                                ? 'rgba(255,255,255,0.2)'
                                : theme.colors.border,
                            },
                      ]}
                    />
                  ))
                ) : (
                  <View
                    style={[
                      styles.unrecordedDot,
                      {
                        backgroundColor: isSelected
                          ? 'rgba(255,255,255,0.2)'
                          : isFuture
                          ? 'transparent'
                          : theme.colors.border,
                      },
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
    borderWidth: 1.2,
    gap: SPACING.sm,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 2,
  },
  weekdayText: {
    fontWeight: '700',
    fontSize: 11,
    width: 38,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyCell: {
    width: '14.28%',
    height: 48,
  },
  dayCell: {
    width: '14.28%',
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  futureCell: {
    opacity: 0.45,
  },
  dayNumber: {
    fontWeight: '600',
    fontSize: 12,
  },
  todayNumber: {
    fontWeight: '800',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    height: 6,
  },
  dot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
  },
  unrecordedDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});
