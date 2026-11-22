import React from 'react';
import { StyleSheet, View, Pressable, Switch } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { ReminderOffset } from '@/types';
import { triggerHaptic } from '@/utils/haptics';

export interface AzanAlertsSettingsGroupProps {
  reciterName?: string;
  reminderOffset?: ReminderOffset;
  onSelectReminderOffset?: (offset: ReminderOffset) => void;
  exactAlarmsEnabled?: boolean;
  onToggleExactAlarms?: (enabled: boolean) => void;
  onOpenAzanPrefs: () => void;
}

const REMINDER_OPTIONS: { id: ReminderOffset; label: string }[] = [
  { id: 'off', label: 'Off' },
  { id: '10m', label: '10 min' },
  { id: '15m', label: '15 min' },
  { id: '30m', label: '30 min' },
];

export const AzanAlertsSettingsGroup: React.FC<AzanAlertsSettingsGroupProps> = ({
  reciterName = 'Makkah • Sheikh Ali Mulla',
  reminderOffset = '15m',
  onSelectReminderOffset,
  exactAlarmsEnabled = true,
  onToggleExactAlarms,
  onOpenAzanPrefs,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const ChevronRight = (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={theme.colors.textSecondary}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.textSecondary} style={styles.sectionLabel}>
        {t('azanAudioReminders').toUpperCase()}
      </AppText>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Row 1: Azan Reciter & Sound Selection */}
        <Pressable
          onPress={onOpenAzanPrefs}
          accessibilityRole="button"
          accessibilityLabel={t('azanAudioReminders')}
          style={styles.row}
        >
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.border }]}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M11 5L6 9H2v6h4l5 4V5z"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('azanAudioReminders')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary} numberOfLines={1}>
                {reciterName}
              </AppText>
            </View>
          </View>
          {ChevronRight}
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 2: Pre-Prayer Reminder Segmented Control */}
        <View style={styles.segmentedRow}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.border }]}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('prePrayerReminder')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {reminderOffset === 'off' ? t('off') : `${reminderOffset.replace('m', '')} min`}
              </AppText>
            </View>
          </View>

          {/* Segmented Track */}
          <View style={[styles.segmentTrack, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
            {REMINDER_OPTIONS.map((opt) => {
              const isSelected = reminderOffset === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => {
                    triggerHaptic();
                    onSelectReminderOffset?.(opt.id);
                  }}
                  style={({ pressed }) => [
                    styles.segmentItem,
                    isSelected && [styles.segmentSelected, { backgroundColor: theme.colors.primary }],
                    pressed && !isSelected && { opacity: 0.7 },
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={isSelected ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                    style={[styles.segmentText, isSelected && styles.segmentTextSelected]}
                  >
                    {opt.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {onToggleExactAlarms && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            {/* Row 3: Android Exact Alarms Reliability Toggle */}
            <View style={styles.row}>
              <View style={styles.leftRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.border }]}>
                  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      stroke={theme.colors.primary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <View style={styles.textCol}>
                  <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                    {t('localAlarmsEnabled')}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    {t('masterAlarmsSubtitle')}
                  </AppText>
                </View>
              </View>

              <Switch
                value={exactAlarmsEnabled}
                onValueChange={onToggleExactAlarms}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.textOnPrimary}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs + 2,
  },
  sectionLabel: {
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  segmentedRow: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    gap: SPACING.sm,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 4,
    flex: 1,
    paddingRight: SPACING.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontWeight: '700',
  },
  segmentTrack: {
    flexDirection: 'row',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm + 2,
  },
  segmentSelected: {
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  segmentTextSelected: {
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60,
  },
});
