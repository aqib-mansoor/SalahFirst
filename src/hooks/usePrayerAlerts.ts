import { useCallback } from 'react';
import { PrayerAlertConfig, NotificationMode, ReminderOffset } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPrayerAlerts } from '@/store/slices/preferencesSlice';

const prayerAlertListeners = new Set<() => void>();
export const notifyPrayerAlertsChanged = () => {
  prayerAlertListeners.forEach((fn) => fn());
};

export const usePrayerAlerts = () => {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector((state) => state.preferences.alerts);

  const saveAlerts = useCallback(
    (updated: PrayerAlertConfig) => {
      dispatch(setPrayerAlerts(updated));
      notifyPrayerAlertsChanged();
    },
    [dispatch]
  );

  const setPrayerMode = useCallback(
    (prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', mode: NotificationMode) => {
      saveAlerts({ ...alerts, [prayer]: mode });
    },
    [alerts, saveAlerts]
  );

  const cyclePrayerMode = useCallback(
    (prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
      const modes: NotificationMode[] = ['TONE', 'VIBRATE', 'SILENT'];
      const currentIndex = modes.indexOf(alerts[prayer]);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      saveAlerts({ ...alerts, [prayer]: nextMode });
    },
    [alerts, saveAlerts]
  );

  const setReminder = useCallback(
    (offset: ReminderOffset) => {
      saveAlerts({ ...alerts, reminderOffset: offset });
    },
    [alerts, saveAlerts]
  );

  const toggleExactAlarms = useCallback(() => {
    saveAlerts({ ...alerts, exactAlarmsEnabled: !alerts.exactAlarmsEnabled });
  }, [alerts, saveAlerts]);

  const toggleMissedPrayerReminders = useCallback(() => {
    saveAlerts({
      ...alerts,
      missedPrayerRemindersEnabled: !alerts.missedPrayerRemindersEnabled,
    });
  }, [alerts, saveAlerts]);

  const toggleDailyReflection = useCallback(() => {
    saveAlerts({ ...alerts, dailyReflectionEnabled: !alerts.dailyReflectionEnabled });
  }, [alerts, saveAlerts]);

  const toggleStreakEncouragement = useCallback(() => {
    saveAlerts({
      ...alerts,
      streakEncouragementEnabled: !alerts.streakEncouragementEnabled,
    });
  }, [alerts, saveAlerts]);

  const toggleQuietHours = useCallback(() => {
    saveAlerts({ ...alerts, quietHoursEnabled: !alerts.quietHoursEnabled });
  }, [alerts, saveAlerts]);

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
