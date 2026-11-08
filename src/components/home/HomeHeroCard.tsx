import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { IslamicWatermark } from '@/components/welcome/IslamicWatermark';
import { useTranslation } from '@/context/LocalizationContext';

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
  const { t } = useTranslation();

  const localizedCurrentPrayer =
    (t(currentPrayerName.toLowerCase() as any) as string) || currentPrayerName;
  const localizedNextPrayer =
    (t(nextPrayerName.toLowerCase() as any) as string) || nextPrayerName;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.bannerGreen }]}>
      {/* Elegant Canvas Watermark positioned cleanly in top-right away from text */}
      <IslamicWatermark
        size={260}
        opacity={0.14}
        color={PALETTE.emeraldWatermark}
        style={styles.watermarkTopRight}
      />

      {/* Top Row: Current Prayer Pill + Completed Status */}
      <View style={styles.topRow}>
        <View style={styles.currentTag}>
          <View style={styles.goldDot} />
          <AppText variant="caption" style={styles.currentText}>
            {t('currentPrayer')}: {localizedCurrentPrayer} ({currentTimeFormatted})
          </AppText>
        </View>

        <View style={[styles.statusPill, isCurrentCompleted && styles.statusPillCompleted]}>
          <AppText
            variant="caption"
            style={[styles.completedTag, isCurrentCompleted && styles.completedTagGreen]}
          >
            {isCurrentCompleted ? `${t('completed')} ✓` : t('pending')}
          </AppText>
        </View>
      </View>

      {/* Center Countdown & Azan Time */}
      <View style={styles.centerRow}>
        <View style={styles.leftCountdown}>
          <AppText variant="bodySmall" style={styles.nextPrayerLabel}>
            {t('nextPrayer')} • <AppText style={styles.nextPrayerBold}>{localizedNextPrayer}</AppText>
          </AppText>

          <AppText style={styles.countdownNumber}>
            {countdownText}
          </AppText>
        </View>

        <View style={styles.rightAzan}>
          <AppText variant="caption" style={styles.azanLabel}>
            {t('azanTime')}
          </AppText>
          <AppText style={styles.azanTime}>
            {nextPrayerTimeFormatted}
          </AppText>
        </View>
      </View>

      {/* Focus Mode Button in Splash Screen Gold */}
      <Pressable
        onPress={onStartPrayerFocus}
        accessibilityRole="button"
        accessibilityLabel={`${t('startPrayerFocus')}, 15 min`}
        accessibilityHint="Opens quiet focus mode for prayer"
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
          {t('startPrayerFocus')}
        </AppText>
        <AppText variant="caption" color={theme.colors.buttonGoldText} style={styles.focusDurationText}>
          15 min
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 224,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(204, 161, 95, 0.32)',
    shadowColor: PALETTE.emeraldDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  watermarkTopRight: {
    top: -40,
    right: -40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  currentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(204, 161, 95, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(204, 161, 95, 0.45)',
  },
  goldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FDE68A',
  },
  currentText: {
    fontWeight: '700',
    fontSize: 11,
    color: '#FDE68A',
  },
  statusPill: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  statusPillCompleted: {
    backgroundColor: 'rgba(204, 161, 95, 0.22)',
  },
  completedTag: {
    fontWeight: '600',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  completedTagGreen: {
    color: '#FDE68A',
    fontWeight: '700',
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
  },
  leftCountdown: {
    gap: 3,
  },
  nextPrayerLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: PALETTE.goldLight,
  },
  nextPrayerBold: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 13.5,
  },
  countdownNumber: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 44,
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
  rightAzan: {
    alignItems: 'flex-end',
    gap: 2,
  },
  azanLabel: {
    fontSize: 11.5,
    color: PALETTE.goldLight,
    fontWeight: '600',
  },
  azanTime: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  focusButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  focusDurationText: {
    opacity: 0.85,
    fontSize: 12.5,
    fontWeight: '600',
  },
});
