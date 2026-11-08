import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { PrayerStatus } from '@/hooks/usePrayerTracker';
import { useTranslation } from '@/context/LocalizationContext';
import { PrayerConfirmModal } from './PrayerConfirmModal';

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
  const [confirmPrayer, setConfirmPrayer] = useState<string | null>(null);

  const progressPercent = Math.min(100, Math.max(0, (completedCount / 5) * 100));

  const handlePrayerPress = (item: PrayerStatus) => {
    if (item.completed) {
      onTogglePrayer(item.name);
    } else {
      setConfirmPrayer(item.name);
    }
  };

  const handleConfirm = () => {
    if (confirmPrayer) {
      onTogglePrayer(confirmPrayer);
      setConfirmPrayer(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.title}>
          {t('todaysSalah')}
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.primary} style={styles.countText}>
          {t('prayersCompletedCount', { count: completedCount, total: 5 })}
        </AppText>
      </View>

      {/* Progress Bar Track */}
      <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
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
              onPress={() => handlePrayerPress(item)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.completed }}
              accessibilityLabel={`${item.name} at ${item.time}`}
              hitSlop={6}
              style={({ pressed }) => [
                styles.prayerCard,
                {
                  backgroundColor: isSelected ? theme.colors.secondaryTint : theme.colors.surface,
                  borderColor: isSelected
                    ? theme.colors.accent
                    : item.completed
                    ? theme.colors.primary
                    : theme.colors.border,
                  borderWidth: isSelected ? 1.5 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <AppText
                variant="bodySmall"
                color={isSelected ? theme.colors.primary : theme.colors.textPrimary}
                style={styles.prayerName}
              >
                {t(item.name.toLowerCase() as any) || item.name}
              </AppText>

              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.prayerTime}>
                {item.time}
              </AppText>

              {/* Status Circle Indicator */}
              <View style={styles.circleContainer}>
                {item.completed ? (
                  <View style={[styles.completedCircle, { backgroundColor: theme.colors.primary }]}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path d="M5 13L9 17L19 7" stroke={theme.colors.textOnPrimary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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

      {/* Islamic Honesty Prayer Confirmation Modal */}
      <PrayerConfirmModal
        visible={confirmPrayer !== null}
        prayerName={confirmPrayer || ''}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmPrayer(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  countText: {
    fontWeight: '700',
  },
  progressTrack: {
    height: 4,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginVertical: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xs + 2,
    marginTop: SPACING.xs,
  },
  prayerCard: {
    flex: 1,
    minHeight: 88,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  prayerName: {
    fontWeight: '700',
    fontSize: 13,
  },
  prayerTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  circleContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  completedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerGoldDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});
