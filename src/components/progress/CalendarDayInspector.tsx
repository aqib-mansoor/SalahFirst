import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface CalendarDayInspectorProps {
  dateLabel: string;
  prayersCompleted: boolean[];
  onTogglePrayer: (prayerIndex: number) => void;
}

export const CalendarDayInspector: React.FC<CalendarDayInspectorProps> = ({
  dateLabel,
  prayersCompleted,
  onTogglePrayer,
}) => {
  const theme = useTheme('light');

  const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

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
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
          Log for {dateLabel}
        </AppText>
        <AppText variant="caption" color={theme.colors.primary} style={styles.tipText}>
          Tap day above to inspect
        </AppText>
      </View>

      {/* 5 Prayer Chips */}
      <View style={styles.chipsRow}>
        {prayerNames.map((name, idx) => {
          const isDone = !!prayersCompleted[idx];

          return (
            <Pressable
              key={name}
              onPress={() => onTogglePrayer(idx)}
              style={({ pressed }) => [
                styles.prayerChip,
                isDone
                  ? {
                      backgroundColor: theme.colors.mintTint,
                      borderColor: theme.colors.primary,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceElevated,
                      borderColor: theme.colors.border,
                    },
                pressed && { opacity: 0.7 },
              ]}
            >
              <AppText
                variant="caption"
                color={isDone ? theme.colors.primary : theme.colors.textMuted}
                style={styles.chipName}
              >
                {name}
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
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
  },
  tipText: {
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  prayerChip: {
    flex: 1,
    paddingVertical: SPACING.xs + 3,
    paddingHorizontal: 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  chipName: {
    fontWeight: '700',
    fontSize: 11,
  },
  iconCircleDone: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashText: {
    fontWeight: '700',
    fontSize: 12,
  },
});

