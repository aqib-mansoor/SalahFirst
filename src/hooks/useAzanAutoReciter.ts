import { useState, useEffect, useRef, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { PrayerAlertConfig, UserLocation, CalculationMethodName, JuristicMethod } from '@/types';
import { playAzanAudio, stopAzanAudio, AzanReciterKey } from '@/utils/azanAudio';
import { getRawPrayerTimes } from '@/utils/prayerTimes';
import { getLocalDateComponents } from '@/utils/timezone';

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
  reciterKey = 'makkah',
}: UseAzanAutoReciterParams) => {
  const [isReciting, setIsReciting] = useState(false);
  const [recitingPrayer, setRecitingPrayer] = useState<string | null>(null);
  const playedKeysRef = useRef<Set<string>>(new Set());

  const stopRecitation = useCallback(async () => {
    await stopAzanAudio();
    setIsReciting(false);
    setRecitingPrayer(null);
  }, []);

  const triggerRecitation = useCallback(
    async (prayerName: string) => {
      setRecitingPrayer(prayerName);
      setIsReciting(true);

      const success = await playAzanAudio((playing, finished) => {
        setIsReciting(playing && !finished);
        if (finished) {
          setRecitingPrayer(null);
        }
      }, reciterKey);

      if (!success) {
        setIsReciting(false);
        setRecitingPrayer(null);
      }
    },
    [reciterKey]
  );

  // 1. Listen for scheduled local prayer alarm triggers
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data;
      if (data?.type === 'prayer-alarm') {
        const prayerName = String(data.prayerName || '').toLowerCase() as typeof PRAYERS[number];
        const mode = alerts ? alerts[prayerName] : 'AZAN';
        if (mode === 'AZAN' && alerts?.exactAlarmsEnabled !== false) {
          triggerRecitation(data.prayerName as string);
        }
      }
    });

    return () => sub.remove();
  }, [alerts, triggerRecitation]);

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
        const mode = alerts ? alerts[prayer] : 'AZAN';
        if (mode !== 'AZAN') continue;

        const prayerDate = raw[prayer] as Date | undefined;
        if (!prayerDate) continue;

        // Check if within 45 seconds of prayer start and not already played today
        const diffSeconds = Math.abs((now.getTime() - prayerDate.getTime()) / 1000);
        const playedKey = `${dateKey}_${prayer}`;

        if (diffSeconds <= 45 && !playedKeysRef.current.has(playedKey)) {
          playedKeysRef.current.add(playedKey);
          const capitalized = prayer.charAt(0).toUpperCase() + prayer.slice(1);
          triggerRecitation(capitalized);
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

