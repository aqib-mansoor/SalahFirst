import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, PrayerTimeIcon } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface CalendarDayInspectorProps {
  dateLabel: string;
  hasRecord?: boolean;
  isFuture?: boolean;
  prayersCompleted: boolean[];
  onTogglePrayerChip?: (prayerName: string, currentlyCompleted: boolean) => void;
}

export const CalendarDayInspector: React.FC<CalendarDayInspectorProps> = ({
  dateLabel,
  hasRecord = false,
  isFuture = false,
  prayersCompleted,
  onTogglePrayerChip,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const completedCount = prayersCompleted.filter(Boolean).length;

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
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleCol}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
            {t('logForDate', { date: dateLabel })}
          </AppText>
          <AppText
            variant="caption"
            color={isFuture ? theme.colors.textMuted : completedCount > 0 ? theme.colors.primary : theme.colors.textMuted}
            style={styles.statusSubtitle}
          >
            {isFuture
              ? 'Upcoming date • Cannot log early'
              : hasRecord || completedCount > 0
              ? `${completedCount} of 5 prayers completed • Tap to update`
              : `${t('noRecordYet')} • Tap a prayer to log`}
          </AppText>
        </View>

        {!isFuture && (
          <View
            style={[
              styles.summaryBadge,
              {
                backgroundColor: completedCount === 5 ? theme.colors.primary : theme.colors.secondaryTint,
                borderColor: theme.colors.primary,
              },
            ]}
          >
            <AppText
              variant="caption"
              color={completedCount === 5 ? theme.colors.textOnPrimary : theme.colors.primary}
              style={styles.tipText}
            >
              {completedCount}/5
            </AppText>
          </View>
        )}
      </View>

      {/* 5 Interactive Prayer Chips */}
      <View style={styles.chipsRow}>
        {prayerNames.map((name, idx) => {
          const isDone = !isFuture && !!prayersCompleted[idx];

          return (
            <Pressable
              key={name}
              onPress={() => onTogglePrayerChip?.(name, isDone)}
              disabled={isFuture}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isDone, disabled: isFuture }}
              accessibilityLabel={`${name} on ${dateLabel}`}
              hitSlop={6}
              style={({ pressed }) => [
                styles.prayerChip,
                isDone
                  ? {
                      backgroundColor: theme.colors.secondaryTint,
                      borderColor: theme.colors.primary,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: theme.colors.border,
                    },
                isFuture && styles.chipDisabled,
                pressed && !isFuture && { transform: [{ scale: 0.96 }] },
              ]}
            >
              <View style={styles.chipTopRow}>
                <AppText
                  variant="caption"
                  color={isDone ? theme.colors.primary : theme.colors.text}
                  style={styles.chipName}
                >
                  {t(name.toLowerCase() as any) || name}
                </AppText>
                <PrayerTimeIcon prayer={name} size={13} muted={!isDone} />
              </View>

              {isDone ? (
                <View style={[styles.iconCircleDone, { backgroundColor: theme.colors.primary }]}>
                  <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17L4 12"
                      stroke={theme.colors.textOnPrimary}
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              ) : (
                <View style={[styles.emptyCheckCircle, { borderColor: theme.colors.border }]} />
              )}
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
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm + 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleCol: {
    gap: 2,
    flex: 1,
  },
  title: {
    fontWeight: '800',
    fontSize: 14,
  },
  statusSubtitle: {
    fontWeight: '600',
    fontSize: 11,
  },
  summaryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  tipText: {
    fontWeight: '800',
    fontSize: 11,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  prayerChip: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 3,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    alignItems: 'center',
    gap: 6,
  },
  chipTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipName: {
    fontWeight: '700',
    fontSize: 10.5,
  },
  iconCircleDone: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.4,
  },
});
