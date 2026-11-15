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
import { canScheduleExactAlarms, openExactAlarmSettings } from '@/native/AzanServiceModule';
import { PrePrayerReminderCard } from './PrePrayerReminderCard';
import { PrayerAlertCard } from './PrayerAlertCard';
import { NotificationPreferencesCard } from './NotificationPreferencesCard';
import { AzanAudioPreviewCard } from './AzanAudioPreviewCard';
import { BatteryOptimizationCard } from './BatteryOptimizationCard';
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
    toggleStreakEncouragement,
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
  const [hasExactAlarmPermission, setHasExactAlarmPermission] = useState(true);

  const verifyPermissions = async () => {
    const [{ granted }, exactAllowed] = await Promise.all([
      checkNotificationPermissions(),
      canScheduleExactAlarms(),
    ]);
    setHasPermission(granted);
    setHasExactAlarmPermission(exactAllowed);
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

  const handleFixExactAlarmPermission = async () => {
    await openExactAlarmSettings();
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

        {!hasExactAlarmPermission && (
          <View style={[styles.warningBanner, { backgroundColor: theme.colors.warningBg, borderColor: theme.colors.warningBorder }]}>
            <View style={styles.warningContent}>
              <AppText variant="titleSmall" color={theme.colors.warning} style={styles.boldText}>
                Exact Alarm Permission Required
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.infoText}>
                Android requires "Alarms & Reminders" permission to ring the Azan at the exact minute.
              </AppText>
            </View>
            <Pressable
              onPress={handleFixExactAlarmPermission}
              accessibilityRole="button"
              accessibilityLabel="Allow"
              style={[styles.enableBtn, { backgroundColor: theme.colors.primary }]}
            >
              <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.enableBtnText}>
                Allow
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

        {/* Audio Preview Card */}
        <AzanAudioPreviewCard
          isLoading={isLoading}
          isPlaying={isPlaying}
          currentReciter={currentReciter}
          error={audioError}
          onSelectReciter={selectReciter}
          onToggle={toggleAudio}
        />

        {/* Battery Optimization Guidance Card */}
        <BatteryOptimizationCard />

        {/* Pre-Prayer Gentle Reminder Card */}
        <PrePrayerReminderCard
          currentOffset={alerts.reminderOffset}
          onSelectOffset={setReminder}
        />

        {/* Smart Prayer Follow-up & Streak Reminders */}
        <NotificationPreferencesCard
          missedPrayersEnabled={alerts.missedPrayerRemindersEnabled !== false}
          onToggleMissedPrayers={toggleMissedPrayerReminders}
          streakEncouragementEnabled={alerts.streakEncouragementEnabled !== false}
          onToggleStreakEncouragement={toggleStreakEncouragement}
        />

        {/* Unified 5-Prayer Alert Configuration Card */}
        <View
          style={[
            styles.groupedPrayersCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.groupHeaderTitle}>
            Per-Prayer Alert Mode
          </AppText>
          {PRAYERS_LIST.map((p, index) => {
            const prayerTime = prayerData ? (prayerData[p.key] || '--:--') : '--:--';
            return (
              <PrayerAlertCard
                key={p.key}
                name={p.name}
                time={prayerTime}
                currentMode={alerts[p.key]}
                onSelectMode={(mode) => setPrayerMode(p.key, mode)}
                isLast={index === PRAYERS_LIST.length - 1}
              />
            );
          })}
        </View>
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
  groupedPrayersCard: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  groupHeaderTitle: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
});
