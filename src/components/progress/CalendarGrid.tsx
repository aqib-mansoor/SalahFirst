import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { CalendarDayCell } from '@/utils/calendarUtils';
import { CalendarGridHeader } from './CalendarGridHeader';
import { CalendarDayCellView } from './CalendarDayCellView';
import { CalendarGridLegend } from './CalendarGridLegend';

export interface CalendarGridProps {
  monthName: string;
  hijriMonth: string;
  isCurrentMonth: boolean;
  leadingEmptyCount: number;
  cells: CalendarDayCell[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToday: () => void;
  onSelectDay: (day: number) => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  monthName,
  hijriMonth,
  isCurrentMonth,
  leadingEmptyCount,
  cells,
  onPrevMonth,
  onNextMonth,
  onJumpToday,
  onSelectDay,
}) => {
  const theme = useTheme();

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
      <CalendarGridHeader
        monthName={monthName}
        hijriMonth={hijriMonth}
        isCurrentMonth={isCurrentMonth}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onJumpToday={onJumpToday}
      />

      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((w, i) => (
          <View key={i} style={styles.weekdayCell}>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.weekdayText}>
              {w}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.gridContainer}>
        {Array.from({ length: leadingEmptyCount }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.cellSlot} />
        ))}

        {cells.map((cell) => (
          <CalendarDayCellView
            key={cell.dateKey}
            cell={cell}
            onSelectDay={onSelectDay}
          />
        ))}
      </View>

      <CalendarGridLegend />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm + 4,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.xs + 2,
  },
  weekdaysRow: {
    flexDirection: 'row',
    paddingBottom: 2,
  },
  weekdayCell: {
    width: '14.28%',
    alignItems: 'center',
  },
  weekdayText: {
    fontWeight: '700',
    fontSize: 10.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellSlot: {
    width: '14.28%',
    padding: 2.5,
  },
});
