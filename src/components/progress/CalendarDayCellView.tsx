import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { CalendarDayCell } from '@/utils/calendarUtils';

export interface CalendarDayCellViewProps {
  cell: CalendarDayCell;
  onSelectDay: (day: number) => void;
}

export const CalendarDayCellView: React.FC<CalendarDayCellViewProps> = ({
  cell,
  onSelectDay,
}) => {
  const theme = useTheme();

  const isSelected = cell.isSelected;
  const isToday = cell.isToday;
  const isFuture = !!cell.isFuture;
  const isFull = cell.completedCount === 5;

  const tileBg = isSelected
    ? theme.colors.primary
    : isFull
    ? theme.colors.secondaryTint
    : theme.colors.surfaceElevated;

  const tileBorder = isSelected
    ? theme.colors.primary
    : isFull || isToday
    ? theme.colors.primary
    : 'transparent';

  const numColor = isSelected
    ? theme.colors.textOnPrimary
    : isToday || isFull
    ? theme.colors.primary
    : isFuture
    ? theme.colors.textMuted
    : theme.colors.text;

  return (
    <View style={styles.cellSlot}>
      <Pressable
        onPress={() => onSelectDay(cell.dayNumber)}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`Day ${cell.dayNumber}, ${cell.completedCount} of 5 prayers completed`}
        style={({ pressed }) => [
          styles.dayTile,
          {
            backgroundColor: tileBg,
            borderColor: tileBorder,
            borderWidth: isSelected || isFull || isToday ? 1.3 : 0,
          },
          isFuture && styles.futureTile,
          pressed && { opacity: 0.82 },
        ]}
      >
        <AppText
          variant="bodySmall"
          color={numColor}
          style={[styles.dayNumber, (isSelected || isToday || isFull) && styles.boldDayNumber]}
        >
          {cell.dayNumber}
        </AppText>

        {!isFuture ? (
          <View style={styles.dotsRow}>
            {cell.completedPrayers.map((done, dotIdx) => (
              <View
                key={dotIdx}
                style={[
                  styles.dot,
                  done
                    ? {
                        backgroundColor: isSelected
                          ? theme.colors.accent
                          : theme.colors.primary,
                      }
                    : {
                        backgroundColor: isSelected
                          ? 'rgba(255, 255, 255, 0.28)'
                          : theme.colors.border,
                      },
                ]}
              />
            ))}
          </View>
        ) : (
          <View style={styles.dotsPlaceholder} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cellSlot: {
    width: '14.28%',
    padding: 2.5,
  },
  dayTile: {
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  futureTile: {
    opacity: 0.42,
  },
  dayNumber: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 15,
  },
  boldDayNumber: {
    fontWeight: '800',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
    height: 5,
  },
  dotsPlaceholder: {
    height: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
