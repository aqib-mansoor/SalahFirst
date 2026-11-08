import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  getPrayerTimes,
  formatRemainingTime,
  getDefaultMethodForCountry,
  getDefaultMadhabForCountry,
  FormattedPrayerTimes,
} from '@/utils/prayerTimes';
import { storage } from '@/utils/storage';
import { UserLocation, CalculationMethodName, JuristicMethod, PrayerAlertConfig } from '@/types';
import { calculateCurrentStreak } from '@/utils/trackerStatistics';
import { cancelMissedPrayerNotification, triggerStreakNotification } from '@/utils/notifications';
import { getLocalDateComponents } from '@/utils/timezone';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPrayerCompleted as setPrayerCompletedAction } from '@/store/slices/prayerSlice';

export interface PrayerStatus {
  name: string;
  time: string;
  completed: boolean;
  isNext: boolean;
  isCurrent: boolean;
  hasStarted: boolean;
  remainingTimeText?: string;
}

const EMPTY_COMPLETED: Record<string, boolean> = {
  Fajr: false,
  Dhuhr: false,
  Asr: false,
  Maghrib: false,
  Isha: false,
};

export const getTodayDateKey = (timezone?: string): string =>
  getLocalDateComponents(new Date(), timezone).dateKey;

export const calculateStreakFromHistory = (history: Record<string, Record<string, boolean>>): number =>
  calculateCurrentStreak(history);

const trackerPrefListeners = new Set<() => void>();
export const notifyTrackerPreferencesChanged = () => {
  trackerPrefListeners.forEach((fn) => fn());
};

export const addTrackerListener = (fn: () => void) => {
  trackerPrefListeners.add(fn);
  return () => {
    trackerPrefListeners.delete(fn);
  };
};

export const usePrayerTracker = (userLocation?: UserLocation | null) => {
  const dispatch = useAppDispatch();
  const {
    calcMethod: reduxMethod,
    juristic: reduxJuristic,
    historyMap,
    streakCount,
  } = useAppSelector((state) => state.prayer);

  const calcMethod = reduxMethod || getDefaultMethodForCountry(userLocation?.country);
  const juristic = reduxJuristic || getDefaultMadhabForCountry(userLocation?.country);

  const todayKey = getTodayDateKey(userLocation?.timezone);
  const completedMap = historyMap[todayKey] || EMPTY_COMPLETED;
  const [countdownText, setCountdownText] = useState<string>('--:--:--');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const handlePrefChange = () => setRefreshTrigger((prev) => prev + 1);
    trackerPrefListeners.add(handlePrefChange);
    return () => {
      trackerPrefListeners.delete(handlePrefChange);
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') setRefreshTrigger((prev) => prev + 1);
    });
    return () => sub.remove();
  }, []);

  const prayerData: FormattedPrayerTimes = useMemo(() => {
    return getPrayerTimes(
      userLocation?.latitude,
      userLocation?.longitude,
      new Date(),
      calcMethod,
      juristic,
      userLocation?.timezone
    );
  }, [userLocation?.latitude, userLocation?.longitude, userLocation?.timezone, calcMethod, juristic, refreshTrigger]);

  useEffect(() => {
    let lastDateKey = getTodayDateKey(userLocation?.timezone);
    const updateCountdown = () => {
      const currentDateKey = getTodayDateKey(userLocation?.timezone);
      if (currentDateKey !== lastDateKey) {
        lastDateKey = currentDateKey;
        setRefreshTrigger((prev) => prev + 1);
      }
      const now = new Date().getTime();
      let diff = prayerData.nextPrayerDate.getTime() - now;

      if (diff <= 0 || (prayerData.currentPeriod && now >= prayerData.currentPeriod.endTime.getTime())) {
        setRefreshTrigger((prev) => prev + 1);
        diff = Math.max(0, diff);
      }

      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      setCountdownText(`- ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayerData.nextPrayerDate]);

  const handlePostCompletionAlerts = async (
    prayerName: string,
    isNowCompleted: boolean,
    updatedDay: Record<string, boolean>,
    dateKey: string
  ) => {
    if (!isNowCompleted) return;
    await cancelMissedPrayerNotification(prayerName, dateKey);
    const count = Object.values(updatedDay).filter(Boolean).length;
    if (count === 5 && dateKey === getTodayDateKey(userLocation?.timezone)) {
      const alerts = await storage.get<PrayerAlertConfig | null>('@salahfirst_alerts', null);
      if (alerts?.streakEncouragementEnabled !== false) {
        await triggerStreakNotification();
      }
    }
  };

  const setPrayerCompleted = useCallback(
    async (prayerName: string, completed: boolean = true) => {
      const currentTodayKey = getTodayDateKey(userLocation?.timezone);
      if (completedMap[prayerName] === completed) return;

      if (completed) {
        const lower = prayerName.toLowerCase() as keyof typeof prayerData.raw;
        const rawDate = prayerData.raw?.[lower];
        if (rawDate && Date.now() < rawDate.getTime()) {
          return;
        }
      }

      dispatch(setPrayerCompletedAction({ dateKey: currentTodayKey, prayerName, completed }));
      const updatedToday = { ...completedMap, [prayerName]: completed };
      await handlePostCompletionAlerts(prayerName, completed, updatedToday, currentTodayKey);
      notifyTrackerPreferencesChanged();
    },
    [completedMap, userLocation?.timezone, prayerData.raw, dispatch]
  );

  const togglePrayer = useCallback(
    (prayerName: string) => setPrayerCompleted(prayerName, !completedMap[prayerName]),
    [completedMap, setPrayerCompleted]
  );

  const toggleHistoricalPrayer = useCallback(
    async (dateKey: string, prayerName: string) => {
      const dayRecord = historyMap[dateKey] || EMPTY_COMPLETED;
      const nextStatus = !dayRecord[prayerName];
      dispatch(setPrayerCompletedAction({ dateKey, prayerName, completed: nextStatus }));
      const updatedDay = { ...dayRecord, [prayerName]: nextStatus };
      await handlePostCompletionAlerts(prayerName, nextStatus, updatedDay, dateKey);
      notifyTrackerPreferencesChanged();
    },
    [historyMap, dispatch, userLocation?.timezone]
  );

  const completedCount = Object.values(completedMap).filter(Boolean).length;

  const prayersList: PrayerStatus[] = useMemo(() => {
    const names = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
    const nowMs = Date.now();
    const currentObligatory = prayerData.currentPeriod?.obligatorySalahName;

    return names.map((name) => {
      const lower = name.toLowerCase() as keyof typeof prayerData.raw;
      const rawDate = prayerData.raw?.[lower];
      const hasStarted = rawDate ? nowMs >= rawDate.getTime() : false;
      const isCurrent = currentObligatory ? currentObligatory === name : false;

      return {
        name,
        time: (prayerData as any)[lower] || '--:--',
        completed: !!completedMap[name],
        isNext: prayerData.nextPrayerName === name,
        isCurrent,
        hasStarted,
        remainingTimeText:
          prayerData.nextPrayerName === name ? formatRemainingTime(prayerData.nextPrayerDate) : undefined,
      };
    });
  }, [prayerData, completedMap]);

  return {
    prayerData,
    prayersList,
    historyMap,
    completedCount,
    countdownText,
    streakCount,
    calcMethod,
    juristic,
    togglePrayer,
    setPrayerCompleted,
    toggleHistoricalPrayer,
  };
};
