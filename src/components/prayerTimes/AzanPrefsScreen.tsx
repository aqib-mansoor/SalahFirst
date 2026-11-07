import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer, AppText } from '@/components/common';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { NotificationMode, ReminderOffset } from '@/types';

export interface AzanPrefsScreenProps {
  onBack: () => void;
}

export const AzanPrefsScreen: React.FC<AzanPrefsScreenProps> = ({ onBack }) => {
  const theme = useTheme('light');
  const {
    alerts,
    isPlayingAudio,
    setPrayerMode,
    setReminder,
    toggleExactAlarms,
    toggleAudioPreview,
  } = usePrayerAlerts();

  const reminderOptions: { id: ReminderOffset; label: string }[] = [
    { id: 'off', label: 'Off' },
    { id: '10m', label: '10m\nbefore' },
    { id: '15m', label: '15m\nbefore' },
    { id: '30m', label: '30m\nbefore' },
  ];

  const alertModes: { id: NotificationMode; label: string }[] = [
    { id: 'AZAN', label: 'Full\nAzan' },
    { id: 'TONE', label: 'Tone' },
    { id: 'VIBRATE', label: 'Vibrate' },
    { id: 'SILENT', label: 'Silent' },
  ];

  const prayersConfig: {
    key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    name: string;
    time: string;
  }[] = [
    { key: 'fajr', name: 'Fajr', time: '05:18' },
    { key: 'dhuhr', name: 'Dhuhr', time: '12:04' },
    { key: 'asr', name: 'Asr', time: '15:32' },
    { key: 'maghrib', name: 'Maghrib', time: '17:12' },
    { key: 'isha', name: 'Isha', time: '18:38' },
  ];

  return (
    <AppContainer
      edges={['top', 'left', 'right', 'bottom']}
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={[styles.backBtn, { borderColor: theme.colors.border }]}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={theme.colors.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
        <View style={styles.headerTextCol}>
          <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
            Azan & Notifications
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Customize alerts for each daily prayer
          </AppText>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Exact Alarms Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.alarmTop}>
            <View style={styles.alarmTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={theme.colors.primary} strokeWidth="2" />
              </Svg>
              <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
                Android Exact Alarms Enabled
              </AppText>
            </View>
            <Pressable onPress={toggleExactAlarms}>
              <AppText variant="titleSmall" color={theme.colors.primary} style={styles.muteAll}>
                {alerts.exactAlarmsEnabled ? 'Mute All' : 'Enable'}
              </AppText>
            </Pressable>
          </View>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.infoText}>
            SalahFirst schedules local notifications offline so Azan plays reliably even without internet.
          </AppText>
        </View>

        {/* Audio Preview Card */}
        <View style={[styles.card, styles.rowBetween, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.audioInfo}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
              Makkah Haram Azan (Offline Audio)
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {isPlayingAudio ? 'Playing preview... Hayya ala-s-Salah' : 'Tap to preview offline recording'}
            </AppText>
          </View>
          <Pressable
            onPress={toggleAudioPreview}
            style={[styles.audioBtn, { backgroundColor: PALETTE.gold }]}
          >
            <AppText variant="caption" color={PALETTE.emeraldDeep} style={styles.audioBtnText}>
              {isPlayingAudio ? '⏹ Stop' : '▶ Play'}
            </AppText>
          </Pressable>
        </View>

        {/* Pre-Prayer Reminder */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
            Pre-Prayer Gentle Reminder
          </AppText>
          <View style={styles.reminderRow}>
            {reminderOptions.map((opt) => {
              const active = alerts.reminderOffset === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setReminder(opt.id)}
                  style={[
                    styles.reminderPill,
                    {
                      backgroundColor: active ? theme.colors.primary : theme.colors.surfaceElevated,
                    },
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={active ? theme.colors.surface : theme.colors.text}
                    align="center"
                    style={{ fontWeight: active ? '700' : '500' }}
                  >
                    {opt.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Individual Prayer Alert Cards */}
        {prayersConfig.map((p) => {
          const currentMode = alerts[p.key];
          return (
            <View
              key={p.key}
              style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <View style={styles.prayerCardHeader}>
                <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
                  {p.name} ({p.time})
                </AppText>
                <AppText variant="caption" color={theme.colors.primary} style={styles.boldText}>
                  {currentMode}
                </AppText>
              </View>

              <View style={styles.modesRow}>
                {alertModes.map((mode) => {
                  const active = currentMode === mode.id;
                  return (
                    <Pressable
                      key={mode.id}
                      onPress={() => setPrayerMode(p.key, mode.id)}
                      style={[
                        styles.modePill,
                        {
                          backgroundColor: active ? theme.colors.primary : theme.colors.surfaceElevated,
                        },
                      ]}
                    >
                      <AppText
                        variant="caption"
                        color={active ? theme.colors.surface : theme.colors.text}
                        align="center"
                        style={styles.modePillText}
                      >
                        {mode.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '800',
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alarmTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alarmTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  muteAll: {
    fontWeight: '700',
  },
  infoText: {
    lineHeight: 16,
  },
  audioInfo: {
    flex: 1,
    gap: 2,
  },
  audioBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  audioBtnText: {
    fontWeight: '700',
  },
  reminderRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  reminderPill: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  modePill: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  modePillText: {
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 14,
  },
});
