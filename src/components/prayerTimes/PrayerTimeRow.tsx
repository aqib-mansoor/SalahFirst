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
  remainingTimeText?: string;
  onCycleNotification?: () => void;
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
  isCurrent = false,
  remainingTimeText,
  onCycleNotification,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Dynamic styling based on current / next / normal state
  let cardBg = theme.colors.surface;
  let borderColor = theme.colors.border;
  let dotColor = theme.colors.border;

  if (isCurrent) {
    cardBg = theme.colors.secondaryTint;
    borderColor = theme.colors.primary;
    dotColor = theme.colors.primary;
  } else if (isNext) {
    borderColor = theme.colors.accent;
    dotColor = theme.colors.accent;
  }

  // Bell button mode styles
  let bellColor = theme.colors.textMuted;
  let bellBg = theme.colors.surfaceElevated;
  let notifLabel = t('notificationModeSilent');

  if (notification === 'AZAN' || notification === 'TONE') {
    bellColor = theme.colors.primary;
    bellBg = theme.colors.secondaryTint;
    notifLabel = t('notificationModeAzan');
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
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor,
          borderWidth: isCurrent || isNext ? 1.5 : 1,
        },
      ]}
    >
      {/* Left Column: Indicator + Prayer Names + Localized notification mode */}
      <View style={styles.leftSection}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />

        <View style={styles.nameColumn}>
          <View style={styles.namesRow}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.prayerTitle}>
              {t(name.toLowerCase() as any) || name}
            </AppText>
            <AppText variant="titleSmall" color={theme.colors.textMuted} style={styles.arabicTitle}>
              {arabicName}
            </AppText>
          </View>

          <AppText variant="caption" color={theme.colors.textMuted} style={styles.notifLabel}>
            {notifLabel}
          </AppText>
        </View>
      </View>

      {/* Center Status Badge: Current (NOW) or Next (COUNTDOWN) */}
      {isCurrent && !isNext && (
        <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary }]}>
          <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.badgeText}>
            {t('nowActive')}
          </AppText>
        </View>
      )}

      {isNext && (
        <View style={[styles.statusBadge, { backgroundColor: theme.colors.accent }]}>
          <AppText variant="caption" color={theme.colors.textOnAccent} style={styles.badgeText}>
            NEXT • {remainingTimeText || 'SOON'}
          </AppText>
        </View>
      )}

      {/* Right Column: Time + Mode Icon Button */}
      <View style={styles.rightSection}>
        <AppText variant="titleMedium" color={theme.colors.text} style={styles.timeText}>
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
              borderColor: theme.colors.border,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            },
          ]}
        >
          <NotificationModeIcon mode={notification} color={bellColor} size={18} />
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
    opacity: 0.85,
  },
  notifLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
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
    gap: SPACING.sm,
  },
  timeText: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  modeButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
