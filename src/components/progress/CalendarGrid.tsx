import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
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

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const RING_SIZE = 36;
const RING_STROKE = 2.5;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUM = 2 * Math.PI * RING_R;

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
        {WEEKDAYS.map((w) => (
          <View key={w} style={styles.weekdayCell}>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.weekdayText}>
              {w}
            </AppText>
          </View>
        ))}
      </View>

      {/* Breathing Circular Heatmap / Ring Grid */}
      <View style={styles.gridContainer}>
        {Array.from({ length: leadingEmptyCount }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.cellSlot} />
        ))}

        {cells.map((cell) => {
          const isSelected = cell.isSelected;
          const isToday = cell.isToday;
          const isFuture = !!cell.isFuture;
          const count = cell.completedCount;
          const isFull = count === 5;
          const isPartial = count > 0 && count < 5;
          const dashOffset = RING_CIRCUM * (1 - count / 5);

          const circleBg = isFull
            ? theme.colors.primary
            : isPartial
            ? theme.colors.secondaryTint
            : isToday
            ? theme.colors.surfaceElevated
            : 'transparent';

          const numColor = isFull
            ? theme.colors.textOnPrimary
            : isPartial || isToday
            ? theme.colors.primary
            : isFuture
            ? theme.colors.textMuted
            : theme.colors.text;

          return (
            <Pressable
              key={cell.dateKey}
              onPress={() => onSelectDay(cell.dayNumber)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Day ${cell.dayNumber}, ${count} of 5 prayers completed`}
              style={styles.cellSlot}
            >
              <View
                style={[
                  styles.dayBadge,
                  { backgroundColor: circleBg },
                  isSelected && {
                    borderWidth: 2,
                    borderColor: isFull ? theme.colors.accent : theme.colors.primary,
                  },
                  !isSelected && isToday && !isFull && !isPartial && {
                    borderWidth: 1.5,
                    borderColor: theme.colors.primary,
                  },
                  isFuture && styles.futureCell,
                ]}
              >
                {/* Proportional Progress Ring for Partial Days (1-4/5) */}
                {isPartial && !isSelected && (
                  <Svg width={RING_SIZE} height={RING_SIZE} style={styles.ringSvg}>
                    <Circle
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RING_R}
                      stroke={theme.colors.border}
                      strokeWidth={RING_STROKE}
                      fill="none"
                    />
                    <Circle
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RING_R}
                      stroke={theme.colors.primary}
                      strokeWidth={RING_STROKE}
                      strokeDasharray={`${RING_CIRCUM} ${RING_CIRCUM}`}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      fill="none"
                      rotation="-90"
                      origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
                    />
                  </Svg>
                )}

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
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Compact Heatmap Legend Footer */}
      <View style={[styles.legendRow, { borderTopColor: theme.colors.border }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: theme.colors.primary }]} />
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.legendText}>
            5/5 Complete
          </AppText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSwatch,
              {
                backgroundColor: theme.colors.secondaryTint,
                borderWidth: 1.5,
                borderColor: theme.colors.primary,
              },
            ]}
          />
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.legendText}>
            1–4 Partial
          </AppText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSwatch,
              {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: theme.colors.primary,
              },
            ]}
          />
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.legendText}>
            Today / Selected
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
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
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
    rowGap: 6,
  },
  cellSlot: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadge: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  futureCell: { opacity: 0.38 },
  dayNumber: { fontWeight: '600', fontSize: 12.5 },
  boldDayNumber: { fontWeight: '800' },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    marginTop: 2,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
});
