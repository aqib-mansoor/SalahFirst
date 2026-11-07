import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { IslamicWatermark } from '@/components/welcome/IslamicWatermark';

export interface HomeHeroCardProps {
  currentPrayerName: string;
  currentTimeFormatted: string;
  nextPrayerName: string;
  nextPrayerTimeFormatted: string;
  countdownText: string;
  isCurrentCompleted?: boolean;
  onStartPrayerFocus?: () => void;
}

export const HomeHeroCard: React.FC<HomeHeroCardProps> = ({
  currentPrayerName,
  currentTimeFormatted,
  nextPrayerName,
  nextPrayerTimeFormatted,
  countdownText,
  isCurrentCompleted = false,
  onStartPrayerFocus,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.bannerGreen }]}>
      <IslamicWatermark size={240} opacity={0.16} style={styles.watermark} />

      {/* Top Row: Current Prayer + Completed Status */}
      <View style={styles.topRow}>
        <View style={styles.currentTag}>
          <View style={[styles.goldDot, { backgroundColor: theme.colors.accentLight }]} />
          <AppText variant="caption" color={theme.colors.accentLight} style={styles.currentText}>
            CURRENT: {currentPrayerName} ({currentTimeFormatted})
          </AppText>
        </View>

        <AppText
          variant="bodySmall"
          color={isCurrentCompleted ? theme.colors.accentLight : theme.colors.textMuted}
          style={styles.completedTag}
        >
          {isCurrentCompleted ? 'Completed ✓' : 'Pending'}
        </AppText>
      </View>

      {/* Center Countdown & Azan Time */}
      <View style={styles.centerRow}>
        <View style={styles.leftCountdown}>
          <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.nextPrayerLabel}>
            Next Prayer • <AppText variant="titleSmall" color={theme.colors.text}>{nextPrayerName}</AppText>
          </AppText>

          <AppText variant="brandTitle" color={theme.colors.text} style={styles.countdownNumber}>
            {countdownText}
          </AppText>
        </View>

        <View style={styles.rightAzan}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.azanLabel}>
            Azan Time
          </AppText>
          <AppText variant="titleLarge" color={theme.colors.accentLight} style={styles.azanTime}>
            {nextPrayerTimeFormatted}
          </AppText>
        </View>
      </View>

      {/* Focus Mode Button */}
      <Pressable
        onPress={onStartPrayerFocus}
        accessibilityRole="button"
        accessibilityLabel="Start Prayer Focus, 15 minutes"
        accessibilityHint="Opens dedicated quiet focus mode to dedicate time to prayer"
        style={({ pressed }) => [
          styles.focusButton,
          {
            backgroundColor: pressed ? theme.colors.buttonGoldPressed : theme.colors.buttonGold,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill={theme.colors.buttonGoldText}>
          <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </Svg>
        <AppText variant="titleSmall" color={theme.colors.buttonGoldText} style={styles.focusButtonText}>
          Start Prayer Focus
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.buttonGoldText} style={styles.durationText}>
          15 min
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xxl,
    padding: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    gap: SPACING.md,
  },
  watermark: {
    top: -20,
    right: -40,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goldDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
  },
  currentText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  completedTag: {
    fontWeight: '600',
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: SPACING.xs,
  },
  leftCountdown: {
    gap: 2,
  },
  nextPrayerLabel: {
    fontWeight: '500',
  },
  countdownNumber: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  rightAzan: {
    alignItems: 'flex-end',
    gap: 2,
  },
  azanLabel: {
    fontWeight: '600',
  },
  azanTime: {
    fontSize: 22,
    fontWeight: '800',
  },
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md - 2,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  focusButtonText: {
    fontWeight: '700',
  },
  durationText: {
    fontWeight: '600',
    opacity: 0.85,
  },
});

