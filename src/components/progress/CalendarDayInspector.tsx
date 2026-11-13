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
  onPressStatus?: () => void;
}

export const CalendarDayInspector: React.FC<CalendarDayInspectorProps> = ({
  dateLabel,
  hasRecord = false,
  isFuture = false,
  prayersCompleted,
  onPressStatus,
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
            color={isFuture ? theme.colors.textMuted : hasRecord ? theme.colors.primary : theme.colors.textMuted}
            style={styles.statusSubtitle}
          >
            {isFuture
              ? 'Upcoming date'
              : hasRecord
              ? `${completedCount} of 5 prayers completed`
              : t('noRecordYet')}
          </AppText>
        </View>

        {!isFuture && (
          <View
            style={[
              styles.summaryBadge,
              {
                backgroundColor: completedCount === 5 ? theme.colors.secondaryTint : theme.colors.surfaceElevated,
                borderColor: completedCount === 5 ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <AppText
              variant="caption"
              color={completedCount > 0 ? theme.colors.primary : theme.colors.textMuted}
              style={styles.tipText}
            >
              {completedCount}/5
            </AppText>
          </View>
        )}
      </View>

      {/* 5 Prayer Status Chips */}
      <View style={styles.chipsRow}>
        {prayerNames.map((name, idx) => {
          const isDone = !isFuture && !!prayersCompleted[idx];

          return (
            <View
              key={name}
              style={[
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
              ]}
            >
              <View style={styles.chipTopRow}>
                <AppText
                  variant="caption"
                  color={isDone ? theme.colors.primary : theme.colors.textMuted}
                  style={styles.chipName}
                >
                  {t(name.toLowerCase() as any) || name}
                </AppText>
                <PrayerTimeIcon prayer={name} size={12} muted={!isDone} />
              </View>

              {isDone ? (
                <View style={[styles.iconCircleDone, { backgroundColor: theme.colors.primary }]}>
                  <Svg width={9} height={9} viewBox="0 0 24 24" fill="none">
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
                <AppText variant="caption" color={theme.colors.textMuted} style={styles.dashText}>
                  –
                </AppText>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleCol: {
    gap: 1,
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 13,
  },
  statusSubtitle: {
    fontWeight: '600',
    fontSize: 10.5,
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
    gap: 5,
    justifyContent: 'space-between',
  },
  prayerChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 5,
  },
  chipTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipName: {
    fontWeight: '700',
    fontSize: 10,
  },
  iconCircleDone: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
});
