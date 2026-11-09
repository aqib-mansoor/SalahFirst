import { useState, useEffect } from 'react';
import { FormattedPrayerTimes } from '@/utils/prayerTimes';
import { PrayerCycle } from '@/types';

export const useTrackerCountdown = (
  prayerData: FormattedPrayerTimes,
  activeCycle: PrayerCycle | null,
  onCycleBoundaryReached: () => void,
  onRefreshNeeded: () => void
) => {
  const [countdownText, setCountdownText] = useState<string>('00:00:00');
  const [periodProgressRatio, setPeriodProgressRatio] = useState<number>(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();

      if (activeCycle && now >= activeCycle.nextFajrBoundaryUtc) {
        onCycleBoundaryReached();
        onRefreshNeeded();
      }

      let diff = prayerData.nextPrayerDate.getTime() - now;
      if (diff <= 0 || (prayerData.currentPeriod && now >= prayerData.currentPeriod.endTime.getTime())) {
        onRefreshNeeded();
        diff = Math.max(0, diff);
      }

      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      setCountdownText(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);

      if (prayerData.currentPeriod) {
        const start = prayerData.currentPeriod.startTime.getTime();
        const end = prayerData.currentPeriod.endTime.getTime();
        const span = end - start;
        if (span > 0) {
          setPeriodProgressRatio(Math.min(1, Math.max(0, (now - start) / span)));
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayerData.nextPrayerDate, activeCycle]);

  return { countdownText, periodProgressRatio };
};
