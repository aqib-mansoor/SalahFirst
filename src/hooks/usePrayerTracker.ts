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
import { UserLocation, PrayerAlertConfig, ObligatorySalah } from '@/types';
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
import { triggerHaptic } from '@/utils/haptics';

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

export const calculateStreakFromHistory = (
  history: Record<string, Record<string, boolean>>
): number => calculateCurrentStreak(history);

const trackerPrefListeners = new Set<() => void>();
export const notifyTrackerPreferencesChanged = () => trackerPrefListeners.forEach((fn) => fn());
export const addTrackerListener = (fn: () => void) => {
  trackerPrefListeners.add(fn);
  return () => {
    trackerPrefListeners.delete(fn);
  };
};

const handlePostCompletionAlerts = async (
  prayerName: string,
  isNowCompleted: boolean,
  updatedDay: Record<string, boolean>,
  dateKey: string
) => {
  if (!isNowCompleted) return;
  await cancelMissedPrayerNotification(prayerName, dateKey);
  if (Object.values(updatedDay).filter(Boolean).length === 5) {
    const alerts = await storage.get<PrayerAlertConfig | null>('@salahfirst_alerts', null);
    if (alerts?.streakEncouragementEnabled !== false) await triggerStreakNotification();
  }
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
    prayerAdjustments,
    historyMap,
    ledgerEvents,
    activeCycle,
    streakCount,
  } = useAppSelector((state) => state.prayer);
  const timeFormat = useAppSelector((state) => state.preferences.timeFormat);

  const calcMethod = reduxMethod || getDefaultMethodForCountry(userLocation?.country);
  const juristic = reduxJuristic || getDefaultMadhabForCountry(userLocation?.country);

  const activeDateKey = activeCycle
    ? getLocalDateComponents(new Date(activeCycle.cycleStartUtc), userLocation?.timezone).dateKey
    : getTodayDateKey(userLocation?.timezone);
  const completedMap = historyMap[activeDateKey] || EMPTY_COMPLETED;
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const syncCycle = useCallback(() => {
    reconcilePrayerCycle(userLocation || null, calcMethod, juristic).then(({ cycle }) => {
      dispatch(setActiveCycle(cycle));
    });
  }, [userLocation, calcMethod, juristic, dispatch]);

  useEffect(() => {
    syncCycle();
  }, [syncCycle]);

  const cycleCompletions = useMemo(() => {
    if (!activeCycle) return completedMap;
    const s = getCycleCompletionStatus(activeCycle.cycleId, ledgerEvents);
    return {
      Fajr: s.Fajr || !!completedMap.Fajr,
      Dhuhr: s.Dhuhr || !!completedMap.Dhuhr,
      Asr: s.Asr || !!completedMap.Asr,
      Maghrib: s.Maghrib || !!completedMap.Maghrib,
      Isha: s.Isha || !!completedMap.Isha,
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
        syncCycle();
        setRefreshTrigger((prev) => prev + 1);
      }
    });
    return () => sub.remove();
  }, [syncCycle]);

  const prayerData: FormattedPrayerTimes = useMemo(
    () =>
      getPrayerTimes(
        userLocation?.latitude,
        userLocation?.longitude,
        new Date(),
        calcMethod,
        juristic,
        userLocation?.timezone,
        timeFormat
      ),
    [userLocation?.latitude, userLocation?.longitude, userLocation?.timezone, calcMethod, juristic, prayerAdjustments, timeFormat, refreshTrigger]
  );

  const { countdownText, periodProgressRatio } = useTrackerCountdown(
    prayerData,
    activeCycle,
    syncCycle,
    () => setRefreshTrigger((prev) => prev + 1),
    options?.enableCountdown ?? false
  );

  const setPrayerCompleted = useCallback(
    async (
      prayerName: string,
      completed: boolean = true,
      options?: { targetCycleId?: string; targetDateKey?: string; source?: 'manual' | 'notification' | 'focus' }
    ) => {
      const cycleId = options?.targetCycleId || activeCycle?.cycleId;
      const targetDate = options?.targetDateKey || activeDateKey;
      const targetPrayer = prayerName as ObligatorySalah;

      if (!options?.targetCycleId && cycleCompletions[targetPrayer] === completed) return;

      const nowMs = Date.now();
      const isBeforeFajr = prayerData.raw?.fajr ? nowMs < prayerData.raw.fajr.getTime() : false;

      if (completed && !isBeforeFajr && !options?.targetCycleId) {
        const lower = prayerName.toLowerCase() as keyof typeof prayerData.raw;
        const rawDate = prayerData.raw?.[lower];
        if (rawDate && nowMs < rawDate.getTime()) return;
      }

      if (completed && cycleId) {
        const { event } = await recordPrayerCompletion({
          prayerKey: targetPrayer,
          cycleId,
          timezone: userLocation?.timezone,
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          source: options?.source || 'manual',
        });
        dispatch(recordLedgerEvent(event));
      } else if (!completed && cycleId) {
        await removePrayerCompletion(cycleId, targetPrayer);
        dispatch(removeLedgerEvent({ cycleId, prayerKey: targetPrayer, localDate: targetDate }));
      }

      dispatch(setPrayerCompletedAction({ dateKey: targetDate, prayerName, completed }));
      triggerHaptic(completed ? 'medium' : 'light');
      const updatedToday = { ...cycleCompletions, [prayerName]: completed };
      await handlePostCompletionAlerts(prayerName, completed, updatedToday, targetDate);
      notifyTrackerPreferencesChanged();
    },
    [cycleCompletions, activeCycle, activeDateKey, userLocation, prayerData.raw, dispatch]
  );

  const togglePrayer = useCallback(
    (prayerName: string) => setPrayerCompleted(prayerName, !cycleCompletions[prayerName as ObligatorySalah]),
    [cycleCompletions, setPrayerCompleted]
  );

  const toggleHistoricalPrayer = useCallback(
    async (dateKey: string, prayerName: string) => {
      const now = new Date();
      const todayKey = getLocalDateComponents(now, userLocation?.timezone).dateKey;
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const yesterdayKey = getLocalDateComponents(yesterday, userLocation?.timezone).dateKey;
      if (dateKey !== todayKey && dateKey !== yesterdayKey) {
        return;
      }

      const dayRecord = historyMap[dateKey] || EMPTY_COMPLETED;
      const nextStatus = !dayRecord[prayerName];
      dispatch(setPrayerCompletedAction({ dateKey: dateKey, prayerName, completed: nextStatus }));
      triggerHaptic(nextStatus ? 'medium' : 'light');
      await handlePostCompletionAlerts(prayerName, nextStatus, { ...dayRecord, [prayerName]: nextStatus }, dateKey);
      notifyTrackerPreferencesChanged();
    },
    [historyMap, userLocation?.timezone, dispatch]
  );

  const completedCount = Object.values(cycleCompletions).filter(Boolean).length;

  const prayersList: PrayerStatus[] = useMemo(() => {
    const names = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
    const nowMs = Date.now();
    const isBeforeFajr = prayerData.raw?.fajr ? nowMs < prayerData.raw.fajr.getTime() : false;
    const currentObligatory = prayerData.currentPeriod?.obligatorySalahName;

    return names.map((name) => {
      const lower = name.toLowerCase() as keyof typeof prayerData.raw;
      const rawDate = prayerData.raw?.[lower];
      return {
        name,
        time: (prayerData as any)[lower] || '--:--',
        completed: !!cycleCompletions[name],
        isNext: prayerData.nextPrayerName === name,
        isCurrent: currentObligatory ? currentObligatory === name : false,
        hasStarted: isBeforeFajr ? true : rawDate ? nowMs >= rawDate.getTime() : false,
        remainingTimeText: prayerData.nextPrayerName === name ? formatRemainingTime(prayerData.nextPrayerDate) : undefined,
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
    activeDateKey,
    togglePrayer,
    setPrayerCompleted,
    toggleHistoricalPrayer,
  };
};
