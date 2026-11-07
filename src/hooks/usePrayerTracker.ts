import { useState, useEffect, useCallback } from 'react';
import { getPrayerTimes, FormattedPrayerTimes } from '@/utils/prayerTimes';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { UserLocation } from '@/types';

export interface PrayerStatus {
  name: string;
  time: string;
  completed: boolean;
  isNext: boolean;
  isCurrent: boolean;
}

const DEFAULT_COMPLETED: Record<string, boolean> = {
  Fajr: true,
  Dhuhr: true,
  Asr: true,
  Maghrib: false,
  Isha: false,
};

export const usePrayerTracker = (userLocation?: UserLocation) => {
  const [prayerData, setPrayerData] = useState<FormattedPrayerTimes>(() =>
    getPrayerTimes(userLocation?.latitude, userLocation?.longitude)
  );

  const [completedMap, setCompletedMap] =
    useState<Record<string, boolean>>(DEFAULT_COMPLETED);

  const [countdownText, setCountdownText] = useState<string>('- 01:24:06');
  const [streakCount] = useState<number>(12);

  // Hydrate completed prayers from offline storage
  useEffect(() => {
    const loadStored = async () => {
      const stored = await storage.get<Record<string, boolean> | null>(
        APP_CONFIG.storageKeys.prayerTracker,
        null
      );
      if (stored) {
        setCompletedMap(stored);
      }
    };
    loadStored();
  }, []);

  // Update prayer times when location changes
  useEffect(() => {
    const fresh = getPrayerTimes(userLocation?.latitude, userLocation?.longitude);
    setPrayerData(fresh);
  }, [userLocation?.latitude, userLocation?.longitude]);

  // Live countdown timer ticking every 1 second
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      let diff = prayerData.nextPrayerDate.getTime() - now;

      if (diff <= 0) {
        // If passed, re-fetch tomorrow's or next prayer
        const fresh = getPrayerTimes(userLocation?.latitude, userLocation?.longitude);
        setPrayerData(fresh);
        diff = Math.max(0, fresh.nextPrayerDate.getTime() - now);
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      setCountdownText(`- ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayerData.nextPrayerDate, userLocation?.latitude, userLocation?.longitude]);

  const togglePrayer = useCallback(
    async (prayerName: string) => {
      const updated = {
        ...completedMap,
        [prayerName]: !completedMap[prayerName],
      };
      setCompletedMap(updated);
      await storage.set(APP_CONFIG.storageKeys.prayerTracker, updated);
    },
    [completedMap]
  );

  const completedCount = Object.values(completedMap).filter(Boolean).length;

  const prayersList: PrayerStatus[] = [
    {
      name: 'Fajr',
      time: prayerData.fajr,
      completed: !!completedMap.Fajr,
      isNext: prayerData.nextPrayerName === 'Fajr',
      isCurrent: prayerData.currentPrayerName === 'FAJR',
    },
    {
      name: 'Dhuhr',
      time: prayerData.dhuhr,
      completed: !!completedMap.Dhuhr,
      isNext: prayerData.nextPrayerName === 'Dhuhr',
      isCurrent: prayerData.currentPrayerName === 'DHUHR',
    },
    {
      name: 'Asr',
      time: prayerData.asr,
      completed: !!completedMap.Asr,
      isNext: prayerData.nextPrayerName === 'Asr',
      isCurrent: prayerData.currentPrayerName === 'ASR',
    },
    {
      name: 'Maghrib',
      time: prayerData.maghrib,
      completed: !!completedMap.Maghrib,
      isNext: prayerData.nextPrayerName === 'Maghrib',
      isCurrent: prayerData.currentPrayerName === 'MAGHRIB',
    },
    {
      name: 'Isha',
      time: prayerData.isha,
      completed: !!completedMap.Isha,
      isNext: prayerData.nextPrayerName === 'Isha',
      isCurrent: prayerData.currentPrayerName === 'ISHA',
    },
  ];

  return {
    prayerData,
    prayersList,
    completedCount,
    countdownText,
    streakCount,
    togglePrayer,
  };
};

