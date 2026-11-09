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
import { UserLocation, CalculationMethodName, JuristicMethod, PrayerAlertConfig, ObligatorySalah } from '@/types';
import { calculateCurrentStreak } from '@/utils/trackerStatistics';
import { cancelMissedPrayerNotification, triggerStreakNotification } from '@/utils/notifications';
import { getLocalDateComponents } from '@/utils/timezone';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPrayerCompleted as setPrayerCompletedAction,
  recordLedgerEvent,
  removeLedgerEvent,
  setActiveCycle,
} from '@/store/slices/prayerSlice';
import { reconcilePrayerCycle } from '@/utils/prayerCycleManager';
import {
  recordPrayerCompletion,
  removePrayerCompletion,
  getCycleCompletionStatus,
} from '@/utils/prayerLedgerManager';
import { useTrackerCountdown } from './useTrackerCountdown';

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

export interface UsePrayerTrackerOptions {
  enableCountdown?: boolean;
}

export const usePrayerTracker = (
  userLocation?: UserLocation | null,
  options?: UsePrayerTrackerOptions
) => {
  const dispatch = useAppDispatch();
  const {
    calcMethod: reduxMethod,
    juristic: reduxJuristic,
    historyMap,
    ledgerEvents,
    activeCycle,
    streakCount,
  } = useAppSelector((state) => state.prayer);

  const calcMethod = reduxMethod || getDefaultMethodForCountry(userLocation?.country);
  const juristic = reduxJuristic || getDefaultMadhabForCountry(userLocation?.country);

  const todayKey = getTodayDateKey(userLocation?.timezone);
  const completedMap = historyMap[todayKey] || EMPTY_COMPLETED;
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Centralized Prayer Cycle synchronization
  useEffect(() => {
    reconcilePrayerCycle(userLocation || null, calcMethod, juristic).then(({ cycle }) => {
      dispatch(setActiveCycle(cycle));
    });
  }, [userLocation?.latitude, userLocation?.longitude, userLocation?.timezone, calcMethod, juristic, dispatch]);

  const cycleCompletions = useMemo(() => {
    if (!activeCycle) return completedMap;
    const ledgerStatus = getCycleCompletionStatus(activeCycle.cycleId, ledgerEvents);
    return {
      Fajr: ledgerStatus.Fajr || !!completedMap.Fajr,
      Dhuhr: ledgerStatus.Dhuhr || !!completedMap.Dhuhr,
      Asr: ledgerStatus.Asr || !!completedMap.Asr,
      Maghrib: ledgerStatus.Maghrib || !!completedMap.Maghrib,
      Isha: ledgerStatus.Isha || !!completedMap.Isha,
    };
  }, [activeCycle, ledgerEvents, completedMap]);

  useEffect(() => {
    const handlePrefChange = () => setRefreshTrigger((prev) => prev + 1);
    trackerPrefListeners.add(handlePrefChange);
    return () => {
      trackerPrefListeners.delete(handlePrefChange);
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        reconcilePrayerCycle(userLocation || null, calcMethod, juristic).then(({ cycle }) => {
          dispatch(setActiveCycle(cycle));
          setRefreshTrigger((prev) => prev + 1);
        });
      }
    });
    return () => sub.remove();
  }, [userLocation, calcMethod, juristic, dispatch]);

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

  const { countdownText, periodProgressRatio } = useTrackerCountdown(
    prayerData,
    activeCycle,
    () => {
      reconcilePrayerCycle(userLocation || null, calcMethod, juristic).then(({ cycle }) => {
        dispatch(setActiveCycle(cycle));
      });
    },
    () => setRefreshTrigger((prev) => prev + 1),
    options?.enableCountdown ?? false
  );

  const handlePostCompletionAlerts = async (
    prayerName: string,
    isNowCompleted: boolean,
    updatedDay: Record<string, boolean>,
    dateKey: string
  ) => {
    if (!isNowCompleted) return;
    await cancelMissedPrayerNotification(prayerName, dateKey);
    const count = Object.values(updatedDay).filter(Boolean).length;
    if (count === 5) {
      const alerts = await storage.get<PrayerAlertConfig | null>('@salahfirst_alerts', null);
      if (alerts?.streakEncouragementEnabled !== false) {
        await triggerStreakNotification();
      }
    }
  };

  const setPrayerCompleted = useCallback(
    async (prayerName: string, completed: boolean = true) => {
      const currentTodayKey = getTodayDateKey(userLocation?.timezone);
      if (cycleCompletions[prayerName as ObligatorySalah] === completed) return;

      if (completed) {
        const lower = prayerName.toLowerCase() as keyof typeof prayerData.raw;
        const rawDate = prayerData.raw?.[lower];
        if (rawDate && Date.now() < rawDate.getTime()) return;

        if (activeCycle) {
          const { event } = await recordPrayerCompletion({
            prayerKey: prayerName as ObligatorySalah,
            cycleId: activeCycle.cycleId,
            timezone: userLocation?.timezone,
            latitude: userLocation?.latitude,
            longitude: userLocation?.longitude,
            source: 'manual',
          });
          dispatch(recordLedgerEvent(event));
        }
      } else if (activeCycle) {
        await removePrayerCompletion(activeCycle.cycleId, prayerName as ObligatorySalah);
        dispatch(
          removeLedgerEvent({
            cycleId: activeCycle.cycleId,
            prayerKey: prayerName as ObligatorySalah,
            localDate: currentTodayKey,
          })
        );
      }

      dispatch(setPrayerCompletedAction({ dateKey: currentTodayKey, prayerName, completed }));
      const updatedToday = { ...cycleCompletions, [prayerName]: completed };
      await handlePostCompletionAlerts(prayerName, completed, updatedToday, currentTodayKey);
      notifyTrackerPreferencesChanged();
    },
    [cycleCompletions, activeCycle, userLocation, prayerData.raw, dispatch]
  );

  const togglePrayer = useCallback(
    (prayerName: string) => setPrayerCompleted(prayerName, !cycleCompletions[prayerName as ObligatorySalah]),
    [cycleCompletions, setPrayerCompleted]
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
    [historyMap, dispatch]
  );

  const completedCount = Object.values(cycleCompletions).filter(Boolean).length;

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
        completed: !!cycleCompletions[name],
        isNext: prayerData.nextPrayerName === name,
        isCurrent,
        hasStarted,
        remainingTimeText:
          prayerData.nextPrayerName === name ? formatRemainingTime(prayerData.nextPrayerDate) : undefined,
      };
    });
  }, [prayerData, cycleCompletions]);

  return {
    prayerData,
    prayersList,
    historyMap,
    completedCount,
    countdownText,
    periodProgressRatio,
    streakCount,
    calcMethod,
    juristic,
    activeCycle,
    togglePrayer,
    setPrayerCompleted,
    toggleHistoricalPrayer,
  };
};
