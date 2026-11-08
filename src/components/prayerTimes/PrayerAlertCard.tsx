import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { NotificationMode } from '@/types';
import { NotificationModeIcon } from './NotificationModeIcons';
import { useTranslation } from '@/context/LocalizationContext';

export interface PrayerAlertCardProps {
  name: string;
  time: string;
  currentMode: NotificationMode;
  onSelectMode: (mode: NotificationMode) => void;
}

const ALERT_MODES: { id: NotificationMode; labelKey: string }[] = [
  { id: 'TONE', labelKey: 'notificationModeAzan' },
  { id: 'VIBRATE', labelKey: 'notificationModeVibrate' },
  { id: 'SILENT', labelKey: 'notificationModeSilent' },
];

export const PrayerAlertCard: React.FC<PrayerAlertCardProps> = ({
  name,
  time,
  currentMode,
  onSelectMode,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const isModeActive = (modeId: NotificationMode) => {
    if (modeId === 'TONE') {
      return currentMode === 'TONE' || currentMode === 'AZAN';
    }
    return currentMode === modeId;
  };

  const getDisplayModeName = () => {
    if (currentMode === 'VIBRATE') return t('notificationModeVibrate');
    if (currentMode === 'SILENT') return t('notificationModeSilent');
    return t('notificationModeAzan');
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
          {t(name.toLowerCase() as any) || name} ({time})
        </AppText>
        <View style={[styles.activeTag, { backgroundColor: theme.colors.secondaryTint }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.tagText}>
            {getDisplayModeName()}
          </AppText>
        </View>
      </View>

      {/* 3-Mode Segmented Controls */}
      <View style={styles.modesRow}>
        {ALERT_MODES.map((mode) => {
          const active = isModeActive(mode.id);
          const iconColor = active ? theme.colors.primary : theme.colors.textMuted;

          return (
            <Pressable
              key={mode.id}
              onPress={() => onSelectMode(mode.id)}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${name} ${t(mode.labelKey as any)}`}
              style={({ pressed }) => [
                styles.modePill,
                {
                  backgroundColor: active
                    ? theme.colors.secondaryTint
                    : pressed
                    ? theme.colors.surfaceElevated
                    : theme.colors.surfaceElevated,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                  borderWidth: active ? 1.5 : 1,
                },
              ]}
            >
              <NotificationModeIcon mode={mode.id} color={iconColor} size={15} />
              <AppText
                variant="caption"
                color={active ? theme.colors.primary : theme.colors.textMuted}
                align="center"
                style={{ fontWeight: active ? '700' : '500', fontSize: 11 }}
              >
                {t(mode.labelKey as any)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '700',
    fontSize: 13,
  },
  activeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  modesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  modePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.lg,
  },
});
