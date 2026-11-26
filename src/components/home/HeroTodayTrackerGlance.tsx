import React, { useMemo } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { PrayerStatus } from '@/hooks/usePrayerTracker';

const OBLIGATORY_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const PRAYER_INITIALS: Record<string, string> = {
  Fajr: 'F',
  Dhuhr: 'D',
  Asr: 'A',
  Maghrib: 'M',
  Isha: 'I',
};

export interface HeroTodayTrackerGlanceProps {
  completedCount?: number;
  streakCount?: number;
  sunriseTimeFormatted?: string;
  prayers?: PrayerStatus[];
  onPress?: () => void;
}

/**
 * HeroTodayTrackerGlance
 * Standalone Card 2: Today's Salah progress ring, 5-Prayer Micro Pips (F D A M I),
 * and clean text telemetry on an architectural Mihrab canvas.
 */
export const HeroTodayTrackerGlance: React.FC<HeroTodayTrackerGlanceProps> = ({
  completedCount = 0,
  streakCount = 0,
  sunriseTimeFormatted,
  prayers,
  onPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Progress ring calculations for 5 daily prayers
  const radius = 17;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const clampedCount = Math.max(0, Math.min(5, completedCount));
  const progressRatio = clampedCount / 5;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const prayerMap = useMemo(() => {
    const map: Record<string, PrayerStatus> = {};
    prayers?.forEach((p) => {
      map[p.name] = p;
    });
    return map;
  }, [prayers]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Today's Salah: ${clampedCount} of 5 completed. ${streakCount} day streak. Tap to view prayers.`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.colors.primaryHero },
        pressed && styles.cardPressed,
      ]}
    >
      {/* Sacred Architectural Mihrab Lines Canvas */}
      <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.15} style={styles.canvas} />

      {/* Top Header: Unboxed Clean Section Label */}
      <View style={styles.headerRow}>
        <AppText
          variant="caption"
          color={theme.colors.accentLight}
          style={styles.headerLabel}
          numberOfLines={1}
        >
          {((t('tracker' as any) as string) || 'TRACKER').toUpperCase()}
        </AppText>
      </View>

      {/* Centerpiece: Clean Circular Progress Ring & Score */}
      <View style={styles.centerSection}>
        <View style={styles.ringContainer}>
          <Svg width={38} height={38} viewBox="0 0 38 38">
            {/* Background Ring Track */}
            <Circle
              cx={19}
              cy={19}
              r={radius}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Active Progress Ring */}
            <Circle
              cx={19}
              cy={19}
              r={radius}
              stroke={theme.colors.accent}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 19 19)"
            />
          </Svg>
          {/* Centered Number in Ring */}
          <View style={styles.ringLabelOverlay}>
            <AppText color={theme.colors.textOnPrimary} style={styles.ringScoreText}>
              {clampedCount}
            </AppText>
          </View>
        </View>

        <View style={styles.scoreDetails}>
          <AppText color={theme.colors.textOnPrimary} style={styles.doneLabel} numberOfLines={1}>
            {clampedCount}/5 {(t('completed' as any) as string) || 'Done'}
          </AppText>
          <AppText variant="caption" color="rgba(255, 255, 255, 0.70)" style={styles.subtext} numberOfLines={1}>
            {clampedCount === 5 ? 'All Complete!' : `${5 - clampedCount} remaining`}
          </AppText>
        </View>
      </View>

      {/* 5-Prayer Micro Indicator Pips (F • D • A • M • I) */}
      <View style={styles.pipsRow}>
        {OBLIGATORY_KEYS.map((key) => {
          const status = prayerMap[key];
          const isDone = status?.completed ?? false;
          const isCurrent = status?.isCurrent ?? false;

          return (
            <View
              key={key}
              style={[
                styles.pipBox,
                isDone
                  ? { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent }
                  : isCurrent
                  ? { backgroundColor: 'rgba(247, 207, 87, 0.20)', borderColor: theme.colors.accent }
                  : { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.12)' },
              ]}
            >
              <AppText
                style={[
                  styles.pipLetter,
                  {
                    color: isDone
                      ? '#062518'
                      : isCurrent
                      ? theme.colors.accentLight
                      : 'rgba(255, 255, 255, 0.45)',
                  },
                ]}
              >
                {PRAYER_INITIALS[key]}
              </AppText>
            </View>
          );
        })}
      </View>

      {/* Bottom Telemetry: Pure Clean Text (Zero Emojis) */}
      <View style={styles.bottomRow}>
        <View style={styles.telemetryItem}>
          <AppText
            variant="caption"
            color="rgba(255, 255, 255, 0.70)"
            style={styles.telemetryLabel}
            numberOfLines={1}
          >
            {((t('streaks' as any) as string) || 'Streak')}:
          </AppText>
          <AppText
            variant="caption"
            color={theme.colors.textOnPrimary}
            style={styles.telemetryValue}
            numberOfLines={1}
          >
            {streakCount}d
          </AppText>
        </View>

        <AppText style={styles.bulletSeparator}>•</AppText>

        <View style={styles.telemetryItem}>
          <AppText
            variant="caption"
            color="rgba(255, 255, 255, 0.70)"
            style={styles.telemetryLabel}
            numberOfLines={1}
          >
            {t('sunrise')}:
          </AppText>
          <AppText
            variant="caption"
            color={theme.colors.textOnPrimary}
            style={styles.telemetryValue}
            numberOfLines={1}
          >
            {sunriseTimeFormatted || '--:--'}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 0.9,
    borderRadius: 18,
    paddingVertical: SPACING.md - 3,
    paddingHorizontal: SPACING.sm + 2,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 128,
    overflow: 'hidden',
    position: 'relative',
  },
  canvas: {
    borderRadius: 18,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
  },
  headerLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  ringContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringScoreText: {
    fontSize: 12.5,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  scoreDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  doneLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtext: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  pipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    paddingVertical: 1,
  },
  pipBox: {
    flex: 1,
    height: 19,
    borderRadius: RADIUS.xs + 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
  },
  pipLetter: {
    fontSize: 10,
    fontWeight: '800',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2.5,
  },
  telemetryLabel: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  telemetryValue: {
    fontSize: 10.5,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  bulletSeparator: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 9,
  },
});
