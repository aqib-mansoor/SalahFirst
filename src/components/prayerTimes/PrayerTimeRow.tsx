import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { NotificationMode } from '@/types';

export interface PrayerTimeRowProps {
  name: string;
  arabicName: string;
  time: string;
  notification: NotificationMode;
  isNext?: boolean;
  remainingTimeText?: string;
  onCycleNotification?: () => void;
}

export const PrayerTimeRow: React.FC<PrayerTimeRowProps> = ({
  name,
  arabicName,
  time,
  notification,
  isNext = false,
  remainingTimeText,
  onCycleNotification,
}) => {
  const theme = useTheme('light');

  const cardBg = isNext ? theme.colors.bannerGreen : theme.colors.surface;
  const textColor = isNext ? theme.colors.bannerGreenText : theme.colors.text;
  const subtextColor = isNext ? theme.colors.textMuted : theme.colors.textMuted;
  const bellBg = isNext ? 'rgba(255, 255, 255, 0.15)' : theme.colors.mintTint;
  const bellColor = isNext ? theme.colors.surface : theme.colors.primary;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: isNext ? theme.colors.borderGold : theme.colors.border,
          borderWidth: isNext ? 1.5 : 1,
        },
      ]}
    >
      {/* Left Column: Indicator + Prayer Names + Notification tag */}
      <View style={styles.leftSection}>
        <View
          style={[
            styles.dot,
            { backgroundColor: isNext ? PALETTE.gold : theme.colors.primary },
          ]}
        />

        <View style={styles.nameColumn}>
          <View style={styles.namesRow}>
            <AppText variant="titleSmall" color={textColor} style={styles.prayerTitle}>
              {name}
            </AppText>
            <AppText variant="titleSmall" color={textColor} style={styles.arabicTitle}>
              {arabicName}
            </AppText>
          </View>

          <AppText variant="caption" color={subtextColor} style={styles.notifLabel}>
            Notification: {notification}
          </AppText>
        </View>
      </View>

      {/* Center Dedicated Non-Overlapping Next Badge */}
      {isNext && (
        <View style={[styles.nextBadge, { backgroundColor: PALETTE.gold }]}>
          <AppText variant="caption" color={PALETTE.emeraldDeep} style={styles.nextBadgeText}>
            NEXT • {remainingTimeText || 'IN 1H 24M'}
          </AppText>
        </View>
      )}

      {/* Right Column: Time + Bell Toggle Button */}
      <View style={styles.rightSection}>
        <AppText variant="titleMedium" color={textColor} style={styles.timeText}>
          {time}
        </AppText>

        <Pressable
          onPress={onCycleNotification}
          hitSlop={8}
          style={({ pressed }) => [
            styles.bellButton,
            {
              backgroundColor: bellBg,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
              stroke={bellColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md - 2,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.lg,
    marginVertical: 4,
    gap: SPACING.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
  },
  nameColumn: {
    gap: 2,
  },
  namesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  prayerTitle: {
    fontWeight: '700',
  },
  arabicTitle: {
    fontWeight: '600',
    opacity: 0.9,
  },
  notifLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  nextBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBadgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  timeText: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

