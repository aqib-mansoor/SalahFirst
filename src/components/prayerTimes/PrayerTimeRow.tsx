import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { NotificationMode } from '@/types';
import { NotificationModeIcon } from './NotificationModeIcons';
import { useTranslation } from '@/context/LocalizationContext';

export interface PrayerTimeRowProps {
  name: string;
  arabicName?: string;
  time: string;
  notification: NotificationMode;
  isNext?: boolean;
  isCurrent?: boolean;
  hasStarted?: boolean;
  remainingTimeText?: string;
  onCycleNotification?: () => void;
  onPressRow?: () => void;
}

const DEFAULT_ARABIC_NAMES: Record<string, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

export const PrayerTimeRow: React.FC<PrayerTimeRowProps> = ({
  name,
  arabicName = DEFAULT_ARABIC_NAMES[name] || '',
  time,
  notification,
  isNext = false,
  hasStarted = false,
  remainingTimeText,
  onCycleNotification,
  onPressRow,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const isPast = hasStarted && !isNext;
  const cardBg = isNext ? theme.colors.secondaryTint : theme.colors.surface;
  const borderColor = isNext ? theme.colors.primary : theme.colors.border;
  const dotColor = isNext
    ? theme.colors.primary
    : isPast
    ? theme.colors.border
    : theme.colors.textMuted;

  // Bell button mode styles
  let bellColor = theme.colors.textMuted;
  let bellBg = theme.colors.surfaceElevated;
  let notifLabel = t('notificationModeSilent');

  if (notification === 'AZAN') {
    bellColor = theme.colors.primary;
    bellBg = isNext ? theme.colors.surface : theme.colors.secondaryTint;
    notifLabel = t('notificationModeAzan');
  } else if (notification === 'TONE') {
    bellColor = theme.colors.primary;
    bellBg = theme.colors.surfaceElevated;
    notifLabel = t('notificationModeTone');
  } else if (notification === 'VIBRATE') {
    bellColor = theme.colors.accent;
    bellBg = theme.colors.accentTint;
    notifLabel = t('notificationModeVibrate');
  } else if (notification === 'SILENT') {
    bellColor = theme.colors.textMuted;
    bellBg = theme.colors.surfaceElevated;
    notifLabel = t('notificationModeSilent');
  }

  return (
    <Pressable
      onPress={onPressRow}
      accessibilityRole="button"
      accessibilityLabel={`${name} prayer row. Tap to open Azan preferences.`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor,
          borderWidth: isNext ? 1.5 : 1,
          opacity: pressed && onPressRow ? 0.92 : 1,
        },
      ]}
    >
      {/* Left Column: Indicator + Prayer Names */}
      <View style={styles.leftSection}>
        <View style={[styles.dot, { backgroundColor: dotColor, opacity: isPast ? 0.55 : 1 }]} />

        <View style={styles.namesRow}>
          <AppText
            variant="titleSmall"
            color={isPast ? theme.colors.textMuted : theme.colors.text}
            style={styles.prayerTitle}
          >
            {t(name.toLowerCase() as any) || name}
          </AppText>
          <AppText
            variant="titleSmall"
            color={theme.colors.textMuted}
            style={[styles.arabicTitle, isPast && { opacity: 0.65 }]}
          >
            {arabicName}
          </AppText>
        </View>
      </View>

      {/* Center Status Badge: Only NEXT upcoming prayer */}
      {isNext && (
        <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary }]}>
          <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.badgeText}>
            NEXT{remainingTimeText ? ` • ${remainingTimeText}` : ''}
          </AppText>
        </View>
      )}

      {/* Right Column: Time + Mode Icon Button */}
      <View style={styles.rightSection}>
        <AppText
          variant="titleMedium"
          color={isPast ? theme.colors.textMuted : theme.colors.text}
          style={styles.timeText}
        >
          {time}
        </AppText>

        <Pressable
          onPress={onCycleNotification}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${name} alert: ${notifLabel}`}
          accessibilityHint="Cycles between Azan, Vibrate, Silent, and Off"
          style={({ pressed }) => [
            styles.modeButton,
            {
              backgroundColor: bellBg,
              borderColor: isNext ? theme.colors.primary : theme.colors.border,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
        >
          <NotificationModeIcon mode={notification} color={bellColor} size={18} />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 3,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: 4,
    gap: SPACING.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
    flex: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
  },
  namesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs + 3,
  },
  prayerTitle: {
    fontWeight: '700',
    fontSize: 15,
  },
  arabicTitle: {
    fontWeight: '600',
    fontSize: 14,
    opacity: 0.8,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
  },
  timeText: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  modeButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
