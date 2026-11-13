import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, PrayerTimeIcon } from '@/components/common';
import { NotificationMode } from '@/types';
import { NotificationModeIcon } from './NotificationModeIcons';
import { useTranslation } from '@/context/LocalizationContext';

export interface PrayerAlertCardProps {
  name: string;
  time: string;
  currentMode: NotificationMode;
  onSelectMode: (mode: NotificationMode) => void;
  isLast?: boolean;
}

const ALERT_MODES: { id: NotificationMode; labelKey: string }[] = [
  { id: 'AZAN', labelKey: 'notificationModeAzan' },
  { id: 'TONE', labelKey: 'notificationModeTone' },
  { id: 'VIBRATE', labelKey: 'notificationModeVibrate' },
  { id: 'SILENT', labelKey: 'notificationModeSilent' },
];

export const PrayerAlertCard: React.FC<PrayerAlertCardProps> = ({
  name,
  time,
  currentMode,
  onSelectMode,
  isLast = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const isModeActive = (modeId: NotificationMode) => currentMode === modeId;

  return (
    <View
      style={[
        styles.rowContainer,
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
      ]}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
            {t(name.toLowerCase() as any) || name}
          </AppText>
          <PrayerTimeIcon prayer={name} size={16} />
        </View>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.timeSub}>
          {time}
        </AppText>
      </View>

      {/* 3-Mode Unified Segmented Track */}
      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
          },
        ]}
      >
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
              style={[
                styles.segment,
                active && [
                  styles.activeSegment,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.primary,
                  },
                ],
              ]}
            >
              <NotificationModeIcon mode={mode.id} color={iconColor} size={15} />
              <AppText
                variant="caption"
                color={active ? theme.colors.primary : theme.colors.textMuted}
                align="center"
                numberOfLines={1}
                style={{ fontWeight: active ? '700' : '600', fontSize: 12 }}
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
  rowContainer: {
    paddingVertical: SPACING.sm + 2,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boldText: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  timeSub: {
    fontWeight: '700',
    fontSize: 12,
  },
  track: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.md,
  },
  activeSegment: {
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
