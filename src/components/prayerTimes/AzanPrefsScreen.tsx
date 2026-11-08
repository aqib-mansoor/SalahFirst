import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Linking, AppState, AppStateStatus } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer, AppText } from '@/components/common';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { useAzanAudio } from '@/hooks/useAzanAudio';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { useTranslation } from '@/context/LocalizationContext';
import { checkNotificationPermissions, requestNotificationPermission } from '@/utils/notifications';
import { PrePrayerReminderCard } from './PrePrayerReminderCard';
import { PrayerAlertCard } from './PrayerAlertCard';
import { NotificationPreferencesCard } from './NotificationPreferencesCard';
import { AzanAudioPreviewCard } from './AzanAudioPreviewCard';
import { AzanPrefsHeader } from './AzanPrefsHeader';

export interface AzanPrefsScreenProps {
  onBack: () => void;
}

const PRAYERS_LIST: { key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; name: string }[] = [
  { key: 'fajr', name: 'Fajr' },
  { key: 'dhuhr', name: 'Dhuhr' },
  { key: 'asr', name: 'Asr' },
  { key: 'maghrib', name: 'Maghrib' },
  { key: 'isha', name: 'Isha' },
];

export const AzanPrefsScreen: React.FC<AzanPrefsScreenProps> = ({ onBack }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { location } = useDeviceLocation();
  const { prayerData } = usePrayerTracker(location);

  const {
    alerts,
    setPrayerMode,
    setReminder,
    toggleExactAlarms,
    toggleMissedPrayerReminders,
    toggleDailyReflection,
    toggleStreakEncouragement,
    toggleQuietHours,
  } = usePrayerAlerts();

  const insets = useSafeAreaInsets();
  const {
    isPlaying,
    isLoading,
    error: audioError,
    currentReciter,
    selectReciter,
    toggle: toggleAudio,
  } = useAzanAudio();
  const [hasPermission, setHasPermission] = useState(true);

  const verifyPermissions = async () => {
    const { granted } = await checkNotificationPermissions();
    setHasPermission(granted);
  };

  useEffect(() => {
    verifyPermissions();
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        verifyPermissions();
      }
    });
    return () => sub.remove();
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      Linking.openSettings();
    } else {
      setHasPermission(true);
    }
  };

  return (
    <AppContainer
      edges={['top', 'left', 'right', 'bottom']}
      style={{ backgroundColor: theme.colors.background }}
    >
      <AzanPrefsHeader onBack={onBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + SPACING.xxl }]}
      >
        {!hasPermission && (
          <View style={[styles.warningBanner, { backgroundColor: theme.colors.warningBg, borderColor: theme.colors.warningBorder }]}>
            <View style={styles.warningContent}>
              <AppText variant="titleSmall" color={theme.colors.warning} style={styles.boldText}>
                {t('notificationsDisabled')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.infoText}>
                {t('enableNotificationsPrompt')}
              </AppText>
            </View>
            <Pressable
              onPress={handleRequestPermission}
              accessibilityRole="button"
              accessibilityLabel={t('enable')}
              style={[styles.enableBtn, { backgroundColor: theme.colors.primary }]}
            >
              <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.enableBtnText}>
                {t('enable')}
              </AppText>
            </Pressable>
          </View>
        )}

        {/* Master Alarms Toggle Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.alarmTop}>
            <View style={styles.alarmTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={theme.colors.primary} strokeWidth="2" />
              </Svg>
              <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
                {t('localAlarmsEnabled')}
              </AppText>
            </View>
            <Pressable
              onPress={toggleExactAlarms}
              accessibilityRole="button"
              accessibilityLabel={alerts.exactAlarmsEnabled ? 'Mute All' : 'Enable'}
            >
              <AppText variant="titleSmall" color={theme.colors.primary} style={styles.muteAll}>
                {alerts.exactAlarmsEnabled ? 'Mute All' : 'Enable'}
              </AppText>
            </Pressable>
          </View>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.infoText}>
            SalahFirst schedules offline local alerts calculated for your location.
          </AppText>
        </View>

        {/* Smart Reminders & Quiet Hours Preferences */}
        <NotificationPreferencesCard
          missedPrayersEnabled={alerts.missedPrayerRemindersEnabled !== false}
          onToggleMissedPrayers={toggleMissedPrayerReminders}
          dailyReflectionEnabled={alerts.dailyReflectionEnabled !== false}
          onToggleDailyReflection={toggleDailyReflection}
          streakEncouragementEnabled={alerts.streakEncouragementEnabled !== false}
          onToggleStreakEncouragement={toggleStreakEncouragement}
          quietHoursEnabled={alerts.quietHoursEnabled !== false}
          onToggleQuietHours={toggleQuietHours}
        />

        {/* Audio Preview Card */}
        <AzanAudioPreviewCard
          isLoading={isLoading}
          isPlaying={isPlaying}
          currentReciter={currentReciter}
          error={audioError}
          onSelectReciter={selectReciter}
          onToggle={toggleAudio}
        />

        {/* Pre-Prayer Gentle Reminder Card */}
        <PrePrayerReminderCard
          currentOffset={alerts.reminderOffset}
          onSelectOffset={setReminder}
        />

        {/* Individual Prayer Alert Cards */}
        {PRAYERS_LIST.map((p) => {
          const prayerTime = prayerData ? (prayerData[p.key] || '--:--') : '--:--';
          return (
            <PrayerAlertCard
              key={p.key}
              name={p.name}
              time={prayerTime}
              currentMode={alerts[p.key]}
              onSelectMode={(mode) => setPrayerMode(p.key, mode)}
            />
          );
        })}
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  warningContent: {
    flex: 1,
    gap: 2,
  },
  enableBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.md,
  },
  enableBtnText: {
    fontWeight: '700',
  },
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
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
});
