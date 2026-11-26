import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { PrayerStatus } from '@/hooks/usePrayerTracker';
import { useTranslation } from '@/context/LocalizationContext';
import { PrayerConfirmModal } from './PrayerConfirmModal';
import { HomePrayerCardItem } from './HomePrayerCardItem';

export interface HomeSalahTrackerProps {
  prayers: PrayerStatus[];
  completedCount: number;
  onTogglePrayer: (name: string) => void;
  onViewHistory?: () => void;
}

export const HomeSalahTracker: React.FC<HomeSalahTrackerProps> = React.memo(({
  prayers,
  completedCount,
  onTogglePrayer,
  onViewHistory,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [confirmPrayer, setConfirmPrayer] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!noticeMessage) return;
    const timer = setTimeout(() => setNoticeMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [noticeMessage]);

  const handlePrayerPress = (item: PrayerStatus) => {
    if (item.completed) {
      onTogglePrayer(item.name);
      return;
    }

    // Strict future prayer rule: cannot log future prayer until Azan starts
    if (!item.hasStarted) {
      const isFridayDhuhr = new Date().getDay() === 5 && item.name === 'Dhuhr';
      const localizedName = isFridayDhuhr
        ? (t('jumuah' as any) as string)
        : (t(item.name.toLowerCase() as any) as string) || item.name;
      setNoticeMessage(
        t('prayerStartsAtNotice', { prayer: localizedName, time: item.time })
      );
      return;
    }

    setConfirmPrayer(item.name);
  };

  const handleConfirm = () => {
    if (confirmPrayer) {
      onTogglePrayer(confirmPrayer);
      setConfirmPrayer(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Header with View History Action */}
      <View style={styles.headerRow}>
        <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.title}>
          {t('todaysSalah')}
        </AppText>

        {onViewHistory && (
          <Pressable
            onPress={onViewHistory}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="View full prayer history"
            style={({ pressed }) => [
              styles.historyButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <AppText variant="bodySmall" color={theme.colors.primary} style={styles.historyText}>
              View History ›
            </AppText>
          </Pressable>
        )}
      </View>

      {/* Strict Future Prayer Notice Toast */}
      {noticeMessage && (
        <Pressable
          onPress={() => setNoticeMessage(null)}
          style={[styles.noticeBanner, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.accent }]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
              fill={theme.colors.accent}
            />
          </Svg>
          <AppText variant="caption" color={theme.colors.textPrimary} style={styles.noticeText}>
            {noticeMessage}
          </AppText>
        </Pressable>
      )}

      {/* 5 Prayers Borderless Horizon Runway */}
      <View style={styles.runwayRow} accessibilityRole="toolbar" accessibilityLabel="Daily Prayers Tracker">
        {prayers.map((item) => {
          const isFridayDhuhr = new Date().getDay() === 5 && item.name === 'Dhuhr';
          return (
            <HomePrayerCardItem
              key={item.name}
              item={item}
              theme={theme}
              onPress={handlePrayerPress}
              localizedName={
                isFridayDhuhr
                  ? (t('jumuah' as any) as string)
                  : (t(item.name.toLowerCase() as any) as string) || item.name
              }
            />
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
});

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
  historyButton: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  historyText: {
    fontWeight: '700',
    fontSize: 12.5,
  },
  runwayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xs + 2,
    marginTop: 2,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
});
