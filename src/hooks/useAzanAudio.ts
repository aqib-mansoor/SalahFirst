import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  playAzanAudio,
  stopAzanAudio,
  pauseAzanAudio,
  resumeAzanAudio,
  AZAN_LOCAL_ASSETS,
  AzanReciterKey,
} from '@/utils/azanAudio';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { notifyPrayerAlertsChanged } from './usePrayerAlerts';
import { getDeviceSoundMode } from '@/native/AzanServiceModule';

export const useAzanAudio = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentReciter, setCurrentReciter] = useState<AzanReciterKey>('makkah');
  const isPreviewActiveRef = useRef<boolean>(false);
  const activePlayIdRef = useRef<number>(0);

  useEffect(() => {
    storage.get<AzanReciterKey>(APP_CONFIG.storageKeys.azanReciter, 'makkah').then((saved) => {
      if (saved && saved in AZAN_LOCAL_ASSETS) {
        setCurrentReciter(saved);
      }
    });

    const appStateSub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state !== 'active' && isPreviewActiveRef.current) {
        isPreviewActiveRef.current = false;
        stopAzanAudio();
        setIsPlaying(false);
        setIsPaused(false);
      }
    });

    return () => {
      appStateSub.remove();
      if (isPreviewActiveRef.current) {
        isPreviewActiveRef.current = false;
        stopAzanAudio();
      }
    };
  }, []);

  const stop = useCallback(async () => {
    activePlayIdRef.current++;
    isPreviewActiveRef.current = false;
    await stopAzanAudio();
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
  }, []);

  const play = useCallback(
    async (reciterKey?: AzanReciterKey) => {
      const key = reciterKey || currentReciter;
      const playId = ++activePlayIdRef.current;

      setError(null);
      setIsLoading(true);
      isPreviewActiveRef.current = true;

      // Check device sound mode
      const soundState = await getDeviceSoundMode();
      if (!soundState.canPlayAudibleSound) {
        if (playId === activePlayIdRef.current) {
          setIsLoading(false);
          setIsPlaying(false);
          isPreviewActiveRef.current = false;
          setError(soundState.suppressionReason || 'Phone is in Silent/Vibrate mode.');
        }
        return false;
      }

      const success = await playAzanAudio(
        (playing, finished) => {
          if (playId !== activePlayIdRef.current) return;
          setIsPlaying(playing && !finished);
          if (finished) {
            isPreviewActiveRef.current = false;
            setIsLoading(false);
            setIsPaused(false);
          }
        },
        key,
        true // Respect Silent / DND modes
      );

      if (playId === activePlayIdRef.current) {
        setIsLoading(false);
        setIsPlaying(success);
        setIsPaused(false);
        if (!success) {
          isPreviewActiveRef.current = false;
          setError('Unable to play audio. Check device sound profile.');
        }
      }
      return success;
    },
    [currentReciter]
  );

  const pause = useCallback(async () => {
    const success = await pauseAzanAudio();
    if (success) {
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(async () => {
    const success = await resumeAzanAudio();
    if (success) {
      setIsPaused(false);
      setIsPlaying(true);
    }
  }, []);

  const toggle = useCallback(
    async (reciterKey?: AzanReciterKey) => {
      if (isPlaying) {
        await stop();
      } else if (isPaused) {
        await resume();
      } else {
        await play(reciterKey);
      }
    },
    [isPlaying, isPaused, play, resume, stop]
  );

  const selectReciter = useCallback(
    async (key: AzanReciterKey) => {
      setCurrentReciter(key);
      await storage.set(APP_CONFIG.storageKeys.azanReciter, key);
      notifyPrayerAlertsChanged();

      // If already playing or user tapped a different reciter, immediately switch to the new one
      if (isPlaying || isLoading) {
        await stop();
        await play(key);
      }
    },
    [isPlaying, isLoading, play, stop]
  );

  return {
    isPlaying,
    isPaused,
    isLoading,
    error,
    currentReciter,
    selectReciter,
    play,
    pause,
    resume,
    stop,
    toggle,
  };
};
