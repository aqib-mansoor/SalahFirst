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
  missedPrayerRemindersEnabled: true,
  dailyReflectionEnabled: true,
  streakEncouragementEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '05:00',
};

const prayerAlertListeners = new Set<() => void>();
export const notifyPrayerAlertsChanged = () => {
  prayerAlertListeners.forEach((fn) => fn());
};

export const usePrayerAlerts = () => {
  const [alerts, setAlerts] = useState<PrayerAlertConfig>(DEFAULT_ALERTS);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    const loadAlerts = async () => {
      const stored = await storage.get<Partial<PrayerAlertConfig> | null>(STORAGE_KEY, null);
      if (stored) {
        setAlerts({ ...DEFAULT_ALERTS, ...stored });
      }
    };
    loadAlerts();

    const handleChange = () => setReloadTrigger((prev) => prev + 1);
    prayerAlertListeners.add(handleChange);
    return () => {
      prayerAlertListeners.delete(handleChange);
    };
  }, [reloadTrigger]);

  const saveAlerts = async (updated: PrayerAlertConfig) => {
    setAlerts(updated);
    await storage.set(STORAGE_KEY, updated);
    notifyPrayerAlertsChanged();
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

  const toggleMissedPrayerReminders = useCallback(() => {
    const updated = { ...alerts, missedPrayerRemindersEnabled: !alerts.missedPrayerRemindersEnabled };
    saveAlerts(updated);
  }, [alerts]);

  const toggleDailyReflection = useCallback(() => {
    const updated = { ...alerts, dailyReflectionEnabled: !alerts.dailyReflectionEnabled };
    saveAlerts(updated);
  }, [alerts]);

  const toggleStreakEncouragement = useCallback(() => {
    const updated = { ...alerts, streakEncouragementEnabled: !alerts.streakEncouragementEnabled };
    saveAlerts(updated);
  }, [alerts]);

  const toggleQuietHours = useCallback(() => {
    const updated = { ...alerts, quietHoursEnabled: !alerts.quietHoursEnabled };
    saveAlerts(updated);
  }, [alerts]);

  return {
    alerts,
    setPrayerMode,
    cyclePrayerMode,
    setReminder,
    toggleExactAlarms,
    toggleMissedPrayerReminders,
    toggleDailyReflection,
    toggleStreakEncouragement,
    toggleQuietHours,
  };
};
