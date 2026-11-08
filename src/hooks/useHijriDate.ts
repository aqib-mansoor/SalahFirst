import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import {
  getIslamicDateFormatted,
  getCountryDefaultHijriAdjustment,
} from '@/utils/hijriCalendar';
import { useTranslation } from '@/context/LocalizationContext';

const listeners = new Set<(adj: number) => void>();
let globalAdjustment: number | null = null;
let lastKnownCountry: string | null = null;

const notifyListeners = (newVal: number) => {
  globalAdjustment = newVal;
  listeners.forEach((listener) => listener(newVal));
};

export const useHijriDate = (country?: string | null, referenceDate: Date = new Date()) => {
  const { language } = useTranslation();
  const defaultForCountry = getCountryDefaultHijriAdjustment(country);

  const [adjustment, setAdjustmentState] = useState<number>(
    globalAdjustment !== null ? globalAdjustment : defaultForCountry
  );

  useEffect(() => {
    let isMounted = true;

    const syncAdjustment = async () => {
      // Check if country has changed from last known country
      if (country && country !== lastKnownCountry) {
        lastKnownCountry = country;
        const newCountryDefault = getCountryDefaultHijriAdjustment(country);
        globalAdjustment = newCountryDefault;
        await storage.set(APP_CONFIG.storageKeys.hijriAdjustment, newCountryDefault);
        if (isMounted) setAdjustmentState(newCountryDefault);
        notifyListeners(newCountryDefault);
        return;
      }

      // Load stored adjustment or fallback to country default
      const stored = await storage.get<number | null>(
        APP_CONFIG.storageKeys.hijriAdjustment,
        null
      );
      const effective = stored !== null ? stored : defaultForCountry;
      globalAdjustment = effective;
      if (isMounted) setAdjustmentState(effective);
    };

    syncAdjustment();

    const listener = (newVal: number) => {
      if (isMounted) setAdjustmentState(newVal);
    };
    listeners.add(listener);

    return () => {
      isMounted = false;
      listeners.delete(listener);
    };
  }, [country, defaultForCountry]);

  const updateAdjustment = useCallback(async (newVal: number) => {
    const clamped = Math.max(-2, Math.min(2, newVal));
    setAdjustmentState(clamped);
    notifyListeners(clamped);
    await storage.set(APP_CONFIG.storageKeys.hijriAdjustment, clamped);
  }, []);

  const resetToDefault = useCallback(async () => {
    await updateAdjustment(defaultForCountry);
  }, [defaultForCountry, updateAdjustment]);

  const hijriDateFormatted = getIslamicDateFormatted(
    referenceDate,
    language,
    adjustment
  );

  return {
    adjustment,
    hijriDateFormatted,
    defaultForCountry,
    updateAdjustment,
    resetToDefault,
  };
};

