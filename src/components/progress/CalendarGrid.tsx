import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { CalendarDayCell } from '@/utils/calendarUtils';

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
      {/* Integrated Month & Hijri Header */}
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
                Today
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
              <Path d="M15 18L9 12L15 6" stroke={theme.colors.text} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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
              <Path d="M9 18L15 12L9 6" stroke={theme.colors.text} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        </View>
      </View>

      {/* Weekday Labels */}
      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((w, i) => (
          <View key={i} style={styles.weekdayCell}>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.weekdayText}>
              {w}
            </AppText>
          </View>
        ))}
      </View>

      {/* Spaced 5-Dot Constellation Calendar Grid */}
      <View style={styles.gridContainer}>
        {Array.from({ length: leadingEmptyCount }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.cellSlot} />
        ))}

        {cells.map((cell) => {
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
            <View key={cell.dateKey} style={styles.cellSlot}>
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
                  style={[
                    styles.dayNumber,
                    (isSelected || isToday || isFull) && styles.boldDayNumber,
                  ]}
                >
                  {cell.dayNumber}
                </AppText>

                {/* 5 Crisp Prayer Dots (Fajr, Dhuhr, Asr, Maghrib, Isha) */}
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
        })}
      </View>

      {/* Compact Legend Footer */}
      <View style={[styles.legendRow, { borderTopColor: theme.colors.border }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.legendText}>
            Prayed
          </AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.border }]} />
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.legendText}>
            Pending
          </AppText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendBox,
              {
                backgroundColor: theme.colors.secondaryTint,
                borderColor: theme.colors.primary,
              },
            ]}
          />
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.legendText}>
            5/5 Complete
          </AppText>
        </View>
      </View>
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
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    marginTop: 4,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendBox: {
    width: 11,
    height: 11,
    borderRadius: 3,
    borderWidth: 1.2,
  },
  legendText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
});
