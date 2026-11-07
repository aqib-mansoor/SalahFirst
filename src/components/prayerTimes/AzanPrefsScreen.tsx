import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Linking, AppState, AppStateStatus } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppContainer, AppText } from '@/components/common';
import { usePrayerAlerts } from '@/hooks/usePrayerAlerts';
import { useAzanAudio } from '@/hooks/useAzanAudio';
import { useDeviceLocation } from '@/hooks/useDeviceLocation';
import { usePrayerTracker } from '@/hooks/usePrayerTracker';
import { checkNotificationPermissions, requestNotificationPermission } from '@/utils/notifications';
import { PrePrayerReminderCard } from './PrePrayerReminderCard';
import { PrayerAlertCard } from './PrayerAlertCard';

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
  const { location } = useDeviceLocation();
  const { prayerData } = usePrayerTracker(location);

  const {
    alerts,
    setPrayerMode,
    setReminder,
    toggleExactAlarms,
  } = usePrayerAlerts();

  const { isPlaying, isLoading, toggle: toggleAudio } = useAzanAudio();

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
        {/* Permission Warning Banner if denied */}
        {!hasPermission && (
          <View style={[styles.warningBanner, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.error }]}>
            <View style={styles.warningContent}>
              <AppText variant="titleSmall" color={theme.colors.error} style={styles.boldText}>
                Notifications Disabled
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted} style={styles.infoText}>
                Enable notifications so Azan alerts ring offline at real prayer times.
              </AppText>
            </View>
            <Pressable
              onPress={handleRequestPermission}
              style={[styles.enableBtn, { backgroundColor: theme.colors.primary }]}
            >
              <AppText variant="caption" color={theme.colors.textInverse} style={styles.enableBtnText}>
                Enable
              </AppText>
            </Pressable>
          </View>
        )}

        {/* Exact Alarms Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.alarmTop}>
            <View style={styles.alarmTitleRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={theme.colors.primary} strokeWidth="2" />
              </Svg>
              <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
                Local Prayer Alarms Enabled
              </AppText>
            </View>
            <Pressable onPress={toggleExactAlarms}>
              <AppText variant="titleSmall" color={theme.colors.primary} style={styles.muteAll}>
                {alerts.exactAlarmsEnabled ? 'Mute All' : 'Enable'}
              </AppText>
            </Pressable>
          </View>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.infoText}>
            SalahFirst schedules offline local alerts calculated for your location.
          </AppText>
        </View>

        {/* Audio Preview Card */}
        <View style={[styles.card, styles.rowBetween, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.audioInfo}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
              Makkah Haram Azan (Audio Preview)
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {isLoading
                ? 'Connecting to audio stream...'
                : isPlaying
                ? 'Playing Makkah Haram Azan • Hayya alas-Salah'
                : 'Tap to preview authentic Makkah Haram Azan'}
            </AppText>
          </View>
          <Pressable
            onPress={() => toggleAudio()}
            disabled={isLoading}
            style={[styles.audioBtn, { backgroundColor: theme.colors.buttonGold }]}
          >
            <AppText variant="caption" color={theme.colors.buttonGoldText} style={styles.audioBtnText}>
              {isLoading ? '⏳ ...' : isPlaying ? '⏹ Stop' : '▶ Play'}
            </AppText>
          </Pressable>
        </View>

        {/* Pre-Prayer Gentle Reminder Card */}
        <PrePrayerReminderCard
          currentOffset={alerts.reminderOffset}
          onSelectOffset={setReminder}
        />

        {/* Individual Prayer Alert Cards with Dynamic Prayer Times */}
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
});
