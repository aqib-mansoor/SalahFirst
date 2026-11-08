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
import { MasterAlarmCard } from './MasterAlarmCard';
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

  const activeAlarmCount = alerts.exactAlarmsEnabled !== false
    ? PRAYERS_LIST.filter((p) => alerts[p.key] !== 'SILENT').length
    : 0;

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
        <MasterAlarmCard
          enabled={alerts.exactAlarmsEnabled !== false}
          activeCount={activeAlarmCount}
          totalCount={PRAYERS_LIST.length}
          onToggle={toggleExactAlarms}
        />

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
  boldText: {
    fontWeight: '700',
  },
  infoText: {
    lineHeight: 16,
  },
});
