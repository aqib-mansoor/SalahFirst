import { useState, useEffect, useCallback } from 'react';
import { PrayerAlertConfig, NotificationMode, ReminderOffset } from '@/types';
import { storage } from '@/utils/storage';

const STORAGE_KEY = '@salahfirst_alerts';

const DEFAULT_ALERTS: PrayerAlertConfig = {
  fajr: 'AZAN',
  dhuhr: 'AZAN',
  asr: 'TONE',
  maghrib: 'AZAN',
  isha: 'VIBRATE',
  reminderOffset: '15m',
  exactAlarmsEnabled: true,
};

export const usePrayerAlerts = () => {
  const [alerts, setAlerts] = useState<PrayerAlertConfig>(DEFAULT_ALERTS);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const loadAlerts = async () => {
      const stored = await storage.get<PrayerAlertConfig | null>(STORAGE_KEY, null);
      if (stored) {
        setAlerts(stored);
      }
    };
    loadAlerts();
  }, []);

  const saveAlerts = async (updated: PrayerAlertConfig) => {
    setAlerts(updated);
    await storage.set(STORAGE_KEY, updated);
  };

  const setPrayerMode = useCallback(
    (prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', mode: NotificationMode) => {
      const updated = { ...alerts, [prayer]: mode };
      saveAlerts(updated);
    },
    [alerts]
  );

  const cyclePrayerMode = useCallback(
    (prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
      const modes: NotificationMode[] = ['AZAN', 'TONE', 'VIBRATE', 'SILENT'];
      const currentIndex = modes.indexOf(alerts[prayer]);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      const updated = { ...alerts, [prayer]: nextMode };
      saveAlerts(updated);
    },
    [alerts]
  );

  const setReminder = useCallback(
    (offset: ReminderOffset) => {
      const updated = { ...alerts, reminderOffset: offset };
      saveAlerts(updated);
    },
    [alerts]
  );

  const toggleExactAlarms = useCallback(() => {
    const updated = { ...alerts, exactAlarmsEnabled: !alerts.exactAlarmsEnabled };
    saveAlerts(updated);
  }, [alerts]);

  const toggleAudioPreview = useCallback(() => {
    setIsPlayingAudio((prev) => !prev);
  }, []);

  return {
    alerts,
    isPlayingAudio,
    setPrayerMode,
    cyclePrayerMode,
    setReminder,
    toggleExactAlarms,
    toggleAudioPreview,
  };
};

