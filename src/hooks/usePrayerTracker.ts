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
import { UserLocation, CalculationMethodName, JuristicMethod } from '@/types';

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

const getTodayDateKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateStreakFromHistory = (history: Record<string, Record<string, boolean>>): number => {
  const today = new Date();
  let streak = 0;
  const todayKey = getTodayDateKey();
  const todayCompleted = history[todayKey] ? Object.values(history[todayKey]).filter(Boolean).length : 0;
  if (todayCompleted > 0) {
    streak++;
  }

  for (let i = 1; i <= 365; i++) {
    const prev = new Date(today);
    prev.setDate(today.getDate() - i);
    const year = prev.getFullYear();
    const month = String(prev.getMonth() + 1).padStart(2, '0');
    const day = String(prev.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    const dayData = history[key];
    const count = dayData ? Object.values(dayData).filter(Boolean).length : 0;
    if (count > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

// Global preference listener to sync settings changes across all tracker instances
const trackerPrefListeners = new Set<() => void>();
export const notifyTrackerPreferencesChanged = () => {
  trackerPrefListeners.forEach((fn) => fn());
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

  const togglePrayer = useCallback(
    async (prayerName: string) => {
      const todayKey = getTodayDateKey();
      const updatedToday = {
        ...completedMap,
        [prayerName]: !completedMap[prayerName],
      };
      const updatedHistory = {
        ...historyMap,
        [todayKey]: updatedToday,
      };

      setCompletedMap(updatedToday);
      setHistoryMap(updatedHistory);
      setStreakCount(calculateStreakFromHistory(updatedHistory));
      await storage.set(APP_CONFIG.storageKeys.prayerTracker, updatedHistory);
    },
    [completedMap, historyMap]
  );

  const completedCount = Object.values(completedMap).filter(Boolean).length;

  const prayersList: PrayerStatus[] = useMemo(() => {
    const list: { name: string; time: string; targetDate: Date }[] = [
      { name: 'Fajr', time: prayerData.fajr, targetDate: prayerData.raw.fajr },
      { name: 'Dhuhr', time: prayerData.dhuhr, targetDate: prayerData.raw.dhuhr },
      { name: 'Asr', time: prayerData.asr, targetDate: prayerData.raw.asr },
      { name: 'Maghrib', time: prayerData.maghrib, targetDate: prayerData.raw.maghrib },
      { name: 'Isha', time: prayerData.isha, targetDate: prayerData.raw.isha },
    ];

    return list.map((item) => ({
      name: item.name,
      time: item.time,
      completed: !!completedMap[item.name],
      isNext: prayerData.nextPrayerName === item.name,
      isCurrent: prayerData.currentPrayerName === item.name.toUpperCase(),
      remainingTimeText:
        prayerData.nextPrayerName === item.name
          ? formatRemainingTime(prayerData.nextPrayerDate)
          : undefined,
    }));
  }, [prayerData, completedMap]);

  return {
    prayerData,
    prayersList,
    completedCount,
    countdownText,
    streakCount,
    calcMethod,
    juristic,
    togglePrayer,
  };
};
