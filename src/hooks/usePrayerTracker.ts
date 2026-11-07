import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getPrayerTimes,
  formatRemainingTime,
  getDefaultMethodForCountry,
  getDefaultMadhabForCountry,
  FormattedPrayerTimes,
} from '@/utils/prayerTimes';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { UserLocation, CalculationMethodName, JuristicMethod, PrayerAlertConfig } from '@/types';
import { formatDateKey, calculateCurrentStreak } from '@/utils/trackerStatistics';
import { cancelMissedPrayerNotification, triggerStreakNotification } from '@/utils/notifications';

export interface PrayerStatus {
  name: string;
  time: string;
  completed: boolean;
  isNext: boolean;
  isCurrent: boolean;
  remainingTimeText?: string;
}

const EMPTY_COMPLETED: Record<string, boolean> = {
  Fajr: false,
  Dhuhr: false,
  Asr: false,
  Maghrib: false,
  Isha: false,
};

export const getTodayDateKey = (): string => formatDateKey(new Date());

export const calculateStreakFromHistory = (history: Record<string, Record<string, boolean>>): number =>
  calculateCurrentStreak(history);

// Global preference listener to sync state changes across all tracker instances
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
  const [calcMethod, setCalcMethod] = useState<CalculationMethodName>('Karachi');
  const [juristic, setJuristic] = useState<JuristicMethod>('Hanafi');
  const [historyMap, setHistoryMap] = useState<Record<string, Record<string, boolean>>>({});
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(EMPTY_COMPLETED);
  const [countdownText, setCountdownText] = useState<string>('--:--:--');
  const [streakCount, setStreakCount] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Load preferences and stored prayer history
  useEffect(() => {
    const loadState = async () => {
      const storedMethod = await storage.get<CalculationMethodName | null>(
        APP_CONFIG.storageKeys.calculationMethod,
        null
      );
      const storedJuristic = await storage.get<JuristicMethod | null>(
        APP_CONFIG.storageKeys.juristicMethod,
        null
      );
      const storedHistory = await storage.get<Record<string, Record<string, boolean>>>(
        APP_CONFIG.storageKeys.prayerTracker,
        {}
      );

      const effectiveMethod = storedMethod || getDefaultMethodForCountry(userLocation?.country);
      const effectiveJuristic = storedJuristic || getDefaultMadhabForCountry(userLocation?.country);

      setCalcMethod(effectiveMethod);
      setJuristic(effectiveJuristic);
      setHistoryMap(storedHistory);

      const todayKey = getTodayDateKey();
      setCompletedMap(storedHistory[todayKey] || EMPTY_COMPLETED);
      setStreakCount(calculateStreakFromHistory(storedHistory));
    };

    loadState();

    const handlePrefChange = () => setRefreshTrigger((prev) => prev + 1);
    trackerPrefListeners.add(handlePrefChange);
    return () => {
      trackerPrefListeners.delete(handlePrefChange);
    };
  }, [userLocation?.country, refreshTrigger]);

  const lat = userLocation?.latitude ?? 24.8607;
  const lng = userLocation?.longitude ?? 67.0011;

  const prayerData: FormattedPrayerTimes = useMemo(() => {
    return getPrayerTimes(lat, lng, new Date(), calcMethod, juristic);
  }, [lat, lng, calcMethod, juristic, refreshTrigger]);

  // Live countdown timer ticking every 1 second
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      let diff = prayerData.nextPrayerDate.getTime() - now;

      if (diff <= 0) {
        setRefreshTrigger((prev) => prev + 1);
        diff = 0;
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
    if (count === 5 && dateKey === getTodayDateKey()) {
      const alerts = await storage.get<PrayerAlertConfig | null>('@salahfirst_alerts', null);
      if (alerts?.streakEncouragementEnabled !== false) {
        await triggerStreakNotification();
      }
    }
  };

  const togglePrayer = useCallback(
    async (prayerName: string) => {
      const todayKey = getTodayDateKey();
      const nextStatus = !completedMap[prayerName];
      const updatedToday = {
        ...completedMap,
        [prayerName]: nextStatus,
      };
      const updatedHistory = {
        ...historyMap,
        [todayKey]: updatedToday,
      };

      setCompletedMap(updatedToday);
      setHistoryMap(updatedHistory);
      setStreakCount(calculateStreakFromHistory(updatedHistory));
      await storage.set(APP_CONFIG.storageKeys.prayerTracker, updatedHistory);
      await handlePostCompletionAlerts(prayerName, nextStatus, updatedToday, todayKey);
      notifyTrackerPreferencesChanged();
    },
    [completedMap, historyMap]
  );

  const setPrayerCompleted = useCallback(
    async (prayerName: string, completed: boolean = true) => {
      const todayKey = getTodayDateKey();
      if (completedMap[prayerName] === completed) return;

      const updatedToday = {
        ...completedMap,
        [prayerName]: completed,
      };
      const updatedHistory = {
        ...historyMap,
        [todayKey]: updatedToday,
      };

      setCompletedMap(updatedToday);
      setHistoryMap(updatedHistory);
      setStreakCount(calculateStreakFromHistory(updatedHistory));
      await storage.set(APP_CONFIG.storageKeys.prayerTracker, updatedHistory);
      await handlePostCompletionAlerts(prayerName, completed, updatedToday, todayKey);
      notifyTrackerPreferencesChanged();
    },
    [completedMap, historyMap]
  );

  const toggleHistoricalPrayer = useCallback(
    async (dateKey: string, prayerName: string) => {
      const dayRecord = historyMap[dateKey] || EMPTY_COMPLETED;
      const nextStatus = !dayRecord[prayerName];
      const updatedDay = {
        ...dayRecord,
        [prayerName]: nextStatus,
      };
      const updatedHistory = {
        ...historyMap,
        [dateKey]: updatedDay,
      };

      if (dateKey === getTodayDateKey()) {
        setCompletedMap(updatedDay);
      }
      setHistoryMap(updatedHistory);
      setStreakCount(calculateStreakFromHistory(updatedHistory));
      await storage.set(APP_CONFIG.storageKeys.prayerTracker, updatedHistory);
      await handlePostCompletionAlerts(prayerName, nextStatus, updatedDay, dateKey);
      notifyTrackerPreferencesChanged();
    },
    [historyMap]
  );

  const completedCount = Object.values(completedMap).filter(Boolean).length;

  const prayersList: PrayerStatus[] = useMemo(() => {
    const names = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
    return names.map((name) => {
      const lower = name.toLowerCase() as keyof typeof prayerData.raw;
      return {
        name,
        time: (prayerData as any)[lower] || '--:--',
        completed: !!completedMap[name],
        isNext: prayerData.nextPrayerName === name,
        isCurrent: prayerData.currentPrayerName === name.toUpperCase(),
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
