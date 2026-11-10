import { useCallback } from 'react';
import {
  getIslamicDateFormatted,
  getCountryDefaultHijriAdjustment,
} from '@/utils/hijriCalendar';
import { useTranslation } from '@/context/LocalizationContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setHijriAdjustment } from '@/store/slices/preferencesSlice';

export const useHijriDate = (country?: string | null, referenceDate: Date = new Date()) => {
  const dispatch = useAppDispatch();
  const { language } = useTranslation();
  const storedAdjustment = useAppSelector((state) => state.preferences.hijriAdjustment);
  const defaultForCountry = getCountryDefaultHijriAdjustment(country);

  const adjustment = storedAdjustment !== null ? storedAdjustment : defaultForCountry;

  const updateAdjustment = useCallback(
    async (newVal: number) => {
      const clamped = Math.max(-2, Math.min(2, newVal));
      dispatch(setHijriAdjustment(clamped));
    },
    [dispatch]
  );

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
    defaultForCountry,
    hijriDateFormatted,
    updateAdjustment,
    resetToDefault,
  };
};
