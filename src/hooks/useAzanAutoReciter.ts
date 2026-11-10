import { useState, useEffect, useRef, useCallback } from 'react';
import { Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import { PrayerAlertConfig, UserLocation, CalculationMethodName, JuristicMethod } from '@/types';
import { playAzanAudio, stopAzanAudio, AzanReciterKey, AZAN_PRESET_URLS } from '@/utils/azanAudio';
import { getRawPrayerTimes } from '@/utils/prayerTimes';
import { getLocalDateComponents } from '@/utils/timezone';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';

const PRAYERS: ('fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')[] = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

export interface UseAzanAutoReciterParams {
  location?: UserLocation | null;
  alerts?: PrayerAlertConfig;
  calculationMethod?: CalculationMethodName;
  juristicMethod?: JuristicMethod;
  reciterKey?: AzanReciterKey;
}

export const useAzanAutoReciter = ({
  location,
  alerts,
  calculationMethod = 'Karachi',
  juristicMethod = 'Hanafi',
  reciterKey: defaultReciterKey = 'makkah',
}: UseAzanAutoReciterParams) => {
  const [isReciting, setIsReciting] = useState(false);
  const [recitingPrayer, setRecitingPrayer] = useState<string | null>(null);
  const [activeReciter, setActiveReciter] = useState<AzanReciterKey>(defaultReciterKey);
  const playedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    storage.get<AzanReciterKey>(APP_CONFIG.storageKeys.azanReciter, defaultReciterKey).then((saved) => {
      if (saved && saved in AZAN_PRESET_URLS) {
        setActiveReciter(saved);
      }
    });
  }, [defaultReciterKey]);

  const stopRecitation = useCallback(async () => {
    await stopAzanAudio();
    setIsReciting(false);
    setRecitingPrayer(null);
  }, []);

  const triggerRecitation = useCallback(
    async (prayerName: string) => {
      setRecitingPrayer(prayerName);
      setIsReciting(true);

      const latestReciter = await storage.get<AzanReciterKey>(
        APP_CONFIG.storageKeys.azanReciter,
        activeReciter
      );

      // Automatic prayer-time Azan respects Silent / Vibrate / DND
      const success = await playAzanAudio(
        (playing, finished) => {
          setIsReciting(playing && !finished);
          if (finished) {
            setRecitingPrayer(null);
          }
        },
        latestReciter,
        true
      );

      if (!success) {
        setIsReciting(false);
        setRecitingPrayer(null);
      }
    },
    [activeReciter]
  );

  // 1. Listen for scheduled local prayer alarm triggers (deduplicated with playedKeysRef)
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data;
      if (data?.type === 'prayer-alarm') {
        const prayerName = String(data.prayerName || '').toLowerCase() as typeof PRAYERS[number];
        const { dateKey } = getLocalDateComponents(new Date(), location?.timezone);
        const playedKey = `${dateKey}_${prayerName}`;
        if (playedKeysRef.current.has(playedKey)) return;
        playedKeysRef.current.add(playedKey);

        const mode = alerts ? alerts[prayerName] : 'TONE';
        if (mode === 'SILENT') return;

        if (mode === 'VIBRATE') {
          Vibration.vibrate([0, 500, 250, 500]);
          return;
        }

        if ((mode === 'AZAN' || mode === 'TONE') && alerts?.exactAlarmsEnabled !== false) {
          triggerRecitation(data.prayerName as string);
        }
      }
    });

    return () => sub.remove();
  }, [alerts, location?.timezone, triggerRecitation]);

  // 2. Active in-app minute matcher for exact prayer boundary arrival
  useEffect(() => {
    if (!location?.latitude || !location?.longitude || alerts?.exactAlarmsEnabled === false) {
      return;
    }

    const checkPrayerArrival = () => {
      const now = new Date();
      const { dateKey } = getLocalDateComponents(now, location.timezone);
      const raw = getRawPrayerTimes(
        location.latitude,
        location.longitude,
        now,
        calculationMethod,
        juristicMethod,
        location.timezone
      );

      for (const prayer of PRAYERS) {
        const mode = alerts ? alerts[prayer] : 'TONE';
        if (mode === 'SILENT') continue;

        const prayerDate = raw[prayer] as Date | undefined;
        if (!prayerDate) continue;

        // Check if within 60 seconds after prayer start and not already played today
        const diffSeconds = (now.getTime() - prayerDate.getTime()) / 1000;
        const playedKey = `${dateKey}_${prayer}`;

        if (diffSeconds >= 0 && diffSeconds <= 60 && !playedKeysRef.current.has(playedKey)) {
          playedKeysRef.current.add(playedKey);
          if (mode === 'VIBRATE') {
            Vibration.vibrate([0, 500, 250, 500]);
          } else if (mode === 'AZAN' || mode === 'TONE') {
            const capitalized = prayer.charAt(0).toUpperCase() + prayer.slice(1);
            triggerRecitation(capitalized);
          }
          break;
        }
      }
    };

    checkPrayerArrival();
    const interval = setInterval(checkPrayerArrival, 10000);
    return () => clearInterval(interval);
  }, [location, alerts, calculationMethod, juristicMethod, triggerRecitation]);

  return {
    isReciting,
    recitingPrayer,
    stopRecitation,
  };
};
