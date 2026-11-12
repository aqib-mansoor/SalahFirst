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
              ? 'Future date'
              : hasRecord
              ? `${completedCount} of 5 completed`
              : t('noRecordYet')}
          </AppText>
        </View>

        <Pressable onPress={onPressStatus} hitSlop={8}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.tipText}>
            Logged from Home ›
          </AppText>
        </Pressable>
      </View>

      {/* 5 Read-Only Prayer Chips */}
      <View style={styles.chipsRow}>
        {prayerNames.map((name, idx) => {
          const isDone = !isFuture && !!prayersCompleted[idx];

          return (
            <Pressable
              key={name}
              onPress={onPressStatus}
              accessibilityRole="text"
              accessibilityLabel={`${name} prayer on ${dateLabel}: ${isDone ? 'Completed' : 'Not completed'}. Logged from Home screen.`}
              hitSlop={6}
              style={({ pressed }) => [
                styles.prayerChip,
                isDone
                  ? {
                      backgroundColor: theme.colors.mintTint,
                      borderColor: theme.colors.border,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: theme.colors.border,
                    },
                isFuture && styles.chipDisabled,
                pressed && { opacity: 0.7 },
              ]}
            >
              <PrayerTimeIcon prayer={name} size={13} muted={!isDone} />
              <AppText
                variant="caption"
                color={isDone ? theme.colors.primary : theme.colors.textMuted}
                style={styles.chipName}
              >
                {t(name.toLowerCase() as any) || name}
              </AppText>

              {isDone ? (
                <View style={styles.iconCircleDone}>
                  <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17L4 12"
                      stroke={theme.colors.primary}
                      strokeWidth="3"
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
  tipText: {
    fontWeight: '700',
    fontSize: 10.5,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
  },
  prayerChip: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 3,
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipName: {
    fontWeight: '700',
    fontSize: 10,
  },
  iconCircleDone: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
});
