import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface CalendarDayInspectorProps {
  dateLabel: string;
  hasRecord?: boolean;
  isFuture?: boolean;
  prayersCompleted: boolean[];
  onTogglePrayer: (prayerIndex: number) => void;
}

export const CalendarDayInspector: React.FC<CalendarDayInspectorProps> = ({
  dateLabel,
  hasRecord = false,
  isFuture = false,
  prayersCompleted,
  onTogglePrayer,
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
              ? `${completedCount} ${t('of')} 5 ${t('completedSuffix')}`
              : t('noRecordYet')}
          </AppText>
        </View>

        <AppText
          variant="caption"
          color={isFuture ? theme.colors.textMuted : theme.colors.primary}
          style={styles.tipText}
        >
          {isFuture ? 'Locked' : t('tapPrayerToLog')}
        </AppText>
      </View>

      {/* 5 Prayer Chips */}
      <View style={styles.chipsRow}>
        {prayerNames.map((name, idx) => {
          const isDone = !isFuture && !!prayersCompleted[idx];

          return (
            <Pressable
              key={name}
              onPress={() => !isFuture && onTogglePrayer(idx)}
              disabled={isFuture}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isDone }}
              accessibilityLabel={`${name} prayer`}
              accessibilityHint={isFuture ? 'Future date locked' : `Tap to toggle completion of ${name} for ${dateLabel}`}
              hitSlop={6}
              style={({ pressed }) => [
                styles.prayerChip,
                isDone
                  ? {
                      backgroundColor: theme.colors.mintTint,
                      borderColor: theme.colors.accent,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: theme.colors.border,
                    },
                isFuture && styles.chipDisabled,
                pressed && !isFuture && { opacity: 0.7 },
              ]}
            >
              <AppText
                variant="caption"
                color={isDone ? theme.colors.primary : theme.colors.textMuted}
                style={styles.chipName}
              >
                {t(name.toLowerCase() as any) || name}
              </AppText>

              {isDone ? (
                <View style={styles.iconCircleDone}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
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
    padding: SPACING.md,
    borderRadius: RADIUS.xxl,
    borderWidth: 1.2,
    gap: SPACING.md,
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
  },
  statusSubtitle: {
    fontWeight: '600',
  },
  tipText: {
    fontWeight: '700',
    fontSize: 11,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
    justifyContent: 'space-between',
  },
  prayerChip: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    alignItems: 'center',
    gap: 4,
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipName: {
    fontWeight: '700',
    fontSize: 11,
  },
  iconCircleDone: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
});
