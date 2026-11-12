import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import {
  playNativeAzanImmediate,
  scheduleTestAzan,
  cancelTestAzan,
  stopNativeAzan,
  getDeviceSoundMode,
  DeviceSoundModeState,
} from '@/native/AzanServiceModule';
import { AzanReciterKey } from '@/utils/azanAudio';

export interface DeveloperAzanTestCardProps {
  currentReciter: AzanReciterKey;
  onSelectReciter: (key: AzanReciterKey) => void;
}

const RECITERS: { id: AzanReciterKey; label: string }[] = [
  { id: 'makkah', label: 'Makkah' },
  { id: 'madinah', label: 'Madinah' },
  { id: 'alAqsa', label: 'Al-Aqsa' },
];

/**
 * Developer-Only Adhan Verification Suite.
 * Completely excluded from production builds (__DEV__ only).
 * Triggers native AlarmManager -> AzanReceiver -> AzanService -> MediaPlayer
 * with isolated test ID 9999 (zero impact on prayer times/streaks/history).
 */
export const DeveloperAzanTestCard: React.FC<DeveloperAzanTestCardProps> = ({
  currentReciter,
  onSelectReciter,
}) => {
  const theme = useTheme();
  const [soundMode, setSoundMode] = useState<DeviceSoundModeState | null>(null);
  const [testStatus, setTestStatus] = useState<string>('Ready for test.');
  const [scheduledAt, setScheduledAt] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const refreshSoundMode = async () => {
    const mode = await getDeviceSoundMode();
    setSoundMode(mode);
  };

  useEffect(() => {
    refreshSoundMode();
  }, []);

  useEffect(() => {
    if (!scheduledAt) {
      setCountdown(null);
      return;
    }

    const interval = setInterval(() => {
      const remainingSec = Math.max(0, Math.round((scheduledAt - Date.now()) / 1000));
      setCountdown(remainingSec);
      if (remainingSec <= 0) {
        setScheduledAt(null);
        setTestStatus('30s Test alarm triggered. Service launched.');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledAt]);

  const handleImmediatePlayback = async (reciter: AzanReciterKey) => {
    onSelectReciter(reciter);
    setTestStatus(`Launching immediate native service (${reciter})...`);
    const success = await playNativeAzanImmediate(reciter, `[TEST] ${reciter.toUpperCase()}`);
    if (success) {
      setTestStatus(`Playing: ${reciter.toUpperCase()} via native AzanService.`);
    } else {
      setTestStatus('Failed to start immediate playback.');
    }
    refreshSoundMode();
  };

  const handleSchedule30Sec = async () => {
    setTestStatus(`Scheduling 30s test alarm (${currentReciter})...`);
    const triggerMs = await scheduleTestAzan(currentReciter, 30);
    if (triggerMs) {
      setScheduledAt(triggerMs);
      setTestStatus('Scheduled. Lock screen or swipe app now to test background playback.');
    } else {
      setTestStatus('Failed to schedule test alarm.');
    }
  };

  const handleCancelTestAlarm = async () => {
    await cancelTestAzan();
    setScheduledAt(null);
    setCountdown(null);
    setTestStatus('Test alarm cancelled.');
  };

  const handleStopAll = async () => {
    await stopNativeAzan();
    setScheduledAt(null);
    setCountdown(null);
    setTestStatus('Playback stopped & test alarms cleared.');
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.accent }]}>
      {/* Header Badge */}
      <View style={styles.headerRow}>
        <View style={[styles.devBadge, { backgroundColor: theme.colors.accent }]}>
          <AppText variant="caption" color={theme.colors.textOnAccent} style={styles.badgeText}>
            DEV TEST PANEL
          </AppText>
        </View>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Isolated Test ID #9999
        </AppText>
      </View>

      {/* Reciter Selector for Test */}
      <View style={styles.reciterRow}>
        {RECITERS.map((r) => {
          const isSelected = currentReciter === r.id;
          return (
            <Pressable
              key={r.id}
              onPress={() => onSelectReciter(r.id)}
              style={[
                styles.reciterBtn,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}
            >
              <AppText variant="caption" color={isSelected ? theme.colors.textOnPrimary : theme.colors.text} style={styles.reciterLabel}>
                {r.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Immediate Playback Row */}
      <View style={styles.actionsRow}>
        <Pressable
          onPress={() => handleImmediatePlayback(currentReciter)}
          style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
        >
          <AppText variant="caption" color={theme.colors.textOnPrimary} style={styles.actionBtnText}>
            ▶ Test Now
          </AppText>
        </Pressable>

        <Pressable
          onPress={handleSchedule30Sec}
          style={[styles.actionBtn, { backgroundColor: theme.colors.buttonGold }]}
        >
          <AppText variant="caption" color={theme.colors.buttonGoldText} style={styles.actionBtnText}>
            ⏰ Test in 30s
          </AppText>
        </Pressable>

        <Pressable
          onPress={handleStopAll}
          style={[styles.actionBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.error, borderWidth: 1 }]}
        >
          <AppText variant="caption" color={theme.colors.error} style={styles.actionBtnText}>
            ⏹ Stop
          </AppText>
        </Pressable>
      </View>

      {/* Countdown Bar if active */}
      {countdown !== null && (
        <View style={[styles.countdownBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.accent }]}>
          <AppText variant="caption" color={theme.colors.accent} style={styles.countdownText}>
            Background Alarm fires in: {countdown}s (Lock or swipe away app)
          </AppText>
          <Pressable onPress={handleCancelTestAlarm}>
            <AppText variant="caption" color={theme.colors.error} style={{ fontWeight: '700' }}>
              Cancel
            </AppText>
          </Pressable>
        </View>
      )}

      {/* Live System Sound Mode Inspection */}
      <View style={[styles.soundBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.soundHeaderRow}>
          <AppText variant="caption" color={theme.colors.text} style={{ fontWeight: '700' }}>
            System Sound State:
          </AppText>
          <Pressable onPress={refreshSoundMode} hitSlop={6}>
            <AppText variant="caption" color={theme.colors.primary} style={{ fontWeight: '600' }}>
              ↻ Refresh
            </AppText>
          </Pressable>
        </View>
        <AppText variant="caption" color={soundMode?.canPlayAudibleSound ? theme.colors.primary : theme.colors.warning}>
          • Ringer: {soundMode?.ringerMode === 2 ? 'Normal (Audible)' : soundMode?.ringerMode === 1 ? 'Vibrate (Muted)' : 'Silent (Muted)'}
        </AppText>
        <AppText variant="caption" color={soundMode?.isDndActive ? theme.colors.warning : theme.colors.textMuted}>
          • DND Filter: {soundMode?.isDndActive ? 'Active (Restricted)' : 'None (Off)'}
        </AppText>
        {soundMode?.suppressionReason && (
          <AppText variant="caption" color={theme.colors.error} style={{ marginTop: 2 }}>
            Notice: {soundMode.suppressionReason}
          </AppText>
        )}
      </View>

      {/* Diagnostics / Status Output */}
      <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={2} style={styles.statusLine}>
        Status: {testStatus}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  devBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  reciterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  reciterBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reciterLabel: {
    fontWeight: '700',
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontWeight: '700',
    fontSize: 11,
  },
  countdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  countdownText: {
    fontWeight: '700',
    fontSize: 11,
  },
  soundBox: {
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 2,
  },
  soundHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  statusLine: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});

