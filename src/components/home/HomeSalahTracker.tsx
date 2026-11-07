import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { PrayerStatus } from '@/hooks/usePrayerTracker';
import { useTranslation } from '@/context/LocalizationContext';

export interface HomeSalahTrackerProps {
  prayers: PrayerStatus[];
  completedCount: number;
  onTogglePrayer: (name: string) => void;
}

export const HomeSalahTracker: React.FC<HomeSalahTrackerProps> = ({
  prayers,
  completedCount,
  onTogglePrayer,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const progressPercent = Math.min(100, Math.max(0, (completedCount / 5) * 100));

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
          {t('todaysSalah')}
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.primary} style={styles.countText}>
          {t('prayersCompletedCount', { count: completedCount, total: 5 })}
        </AppText>
      </View>

      {/* Progress Bar Track */}
      <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceElevated }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: theme.colors.primary, width: `${progressPercent}%` },
          ]}
        />
      </View>

      {/* 5 Prayer Cards Grid */}
      <View style={styles.cardsRow} accessibilityRole="toolbar" accessibilityLabel="Daily Prayers Tracker">
        {prayers.map((item) => {
          const isSelected = item.isNext;

          return (
            <Pressable
              key={item.name}
              onPress={() => onTogglePrayer(item.name)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.completed }}
              accessibilityLabel={`${item.name} at ${item.time}`}
              accessibilityHint={`Tap to mark ${item.name} as ${item.completed ? 'uncompleted' : 'completed'}`}
              hitSlop={6}
              style={({ pressed }) => [
                styles.prayerCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  borderWidth: isSelected ? 1.5 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <AppText
                variant="bodySmall"
                color={isSelected ? theme.colors.primary : theme.colors.text}
                style={styles.prayerName}
              >
                {t(item.name.toLowerCase() as any) || item.name}
              </AppText>

              <AppText variant="caption" color={theme.colors.textMuted} style={styles.prayerTime}>
                {item.time}
              </AppText>

              {/* Status Circle Indicator */}
              <View style={styles.circleContainer}>
                {item.completed ? (
                  <View style={[styles.completedCircle, { backgroundColor: theme.colors.primary }]}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path d="M5 13L9 17L19 7" stroke={theme.colors.surface} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                ) : isSelected ? (
                  <View style={[styles.currentCircle, { borderColor: theme.colors.primary }]}>
                    <View style={[styles.innerGoldDot, { backgroundColor: theme.colors.accent }]} />
                  </View>
                ) : (
                  <View style={[styles.emptyCircle, { borderColor: theme.colors.border }]} />
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
  container: {
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
  },
  countText: {
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    width: '100%',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  prayerCard: {
    flex: 1,
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: 4,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    gap: 4,
    minHeight: 80,
    justifyContent: 'space-between',
  },
  prayerName: {
    fontWeight: '700',
  },
  prayerTime: {
    fontWeight: '500',
  },
  circleContainer: {
    marginTop: 4,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentCircle: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerGoldDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
  },
  emptyCircle: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
  },
});
