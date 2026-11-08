import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
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
    <View style={[styles.card, { backgroundColor: theme.colors.primaryHero }]}>
      {/* 8-pointed star watermark at 5% opacity inside #145A46 emerald container */}
      <IslamicWatermark
        size={260}
        opacity={0.05}
        color="rgba(255, 255, 255, 0.05)"
        style={styles.watermarkTopRight}
      />

      {/* Top Row: Current Prayer Pill + Completed Status */}
      <View style={styles.topRow}>
        <View style={[styles.currentTag, { borderColor: 'rgba(168, 198, 176, 0.3)' }]}>
          <View style={[styles.goldDot, { backgroundColor: theme.colors.accent }]} />
          <AppText variant="caption" color={theme.colors.secondary} style={styles.currentText}>
            {t('currentPrayer')}: {localizedCurrentPrayer} ({currentTimeFormatted})
          </AppText>
        </View>

        <View style={[styles.statusPill, isCurrentCompleted && styles.statusPillCompleted]}>
          <AppText
            variant="caption"
            color={isCurrentCompleted ? theme.colors.accent : 'rgba(255, 255, 255, 0.85)'}
            style={styles.completedTag}
          >
            {isCurrentCompleted ? `${t('completed')} ✓` : t('pending')}
          </AppText>
        </View>
      </View>

      {/* Center Countdown & Azan Time */}
      <View style={styles.centerRow}>
        <View style={styles.leftCountdown}>
          <AppText variant="bodySmall" color={theme.colors.secondary} style={styles.nextPrayerLabel}>
            {t('nextPrayer')} • <AppText color={theme.colors.textOnPrimary} style={styles.nextPrayerBold}>{localizedNextPrayer}</AppText>
          </AppText>

          <AppText color={theme.colors.textOnPrimary} style={styles.countdownNumber}>
            {countdownText}
          </AppText>
        </View>

        <View style={styles.rightAzan}>
          <AppText variant="caption" color={theme.colors.secondary} style={styles.azanLabel}>
            {t('azanTime')}
          </AppText>
          <AppText color={theme.colors.textOnPrimary} style={styles.azanTime}>
            {nextPrayerTimeFormatted}
          </AppText>
        </View>
      </View>

      {/* "Start Prayer Focus" CTA Button in Soft Gold with #202923 Dark Charcoal text */}
      <Pressable
        onPress={onStartPrayerFocus}
        accessibilityRole="button"
        accessibilityLabel={`${t('startPrayerFocus')}, 15 min`}
        accessibilityHint="Opens quiet focus mode for prayer"
        style={({ pressed }) => [
          styles.focusButton,
          {
            backgroundColor: pressed ? '#C5A359' : theme.colors.accent,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill={theme.colors.textOnAccent}>
          <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </Svg>
        <AppText variant="titleSmall" color={theme.colors.textOnAccent} style={styles.focusButtonText}>
          {t('startPrayerFocus')}
        </AppText>
        <AppText variant="caption" color={theme.colors.textOnAccent} style={styles.focusDurationText}>
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
    borderColor: 'rgba(168, 198, 176, 0.25)',
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
  },
  goldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  currentText: {
    fontWeight: '700',
    fontSize: 11,
  },
  statusPill: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  statusPillCompleted: {
    backgroundColor: 'rgba(214, 181, 109, 0.22)',
  },
  completedTag: {
    fontWeight: '700',
    fontSize: 11,
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
  },
  nextPrayerBold: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  countdownNumber: {
    fontSize: 34,
    fontWeight: '700',
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
    fontWeight: '600',
  },
  azanTime: {
    fontSize: 24,
    fontWeight: '800',
  },
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  focusButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  focusDurationText: {
    opacity: 0.9,
    fontSize: 12.5,
    fontWeight: '600',
  },
});
