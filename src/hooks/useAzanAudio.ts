import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  playAzanAudio,
  stopAzanAudio,
  pauseAzanAudio,
  resumeAzanAudio,
  AZAN_PRESET_URLS,
  AzanReciterKey,
} from '@/utils/azanAudio';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import { notifyPrayerAlertsChanged } from './usePrayerAlerts';

export const useAzanAudio = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentReciter, setCurrentReciter] = useState<AzanReciterKey>('makkah');
  const isPreviewActiveRef = useRef<boolean>(false);

  useEffect(() => {
    storage.get<AzanReciterKey>(APP_CONFIG.storageKeys.azanReciter, 'makkah').then((saved) => {
      if (saved && saved in AZAN_PRESET_URLS) {
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

  const play = useCallback(async (reciterKey?: AzanReciterKey) => {
    const key = reciterKey || currentReciter;
    setError(null);
    setIsLoading(true);
    isPreviewActiveRef.current = true;

    const success = await playAzanAudio((playing, finished) => {
      setIsPlaying(playing && !finished);
      if (finished) {
        isPreviewActiveRef.current = false;
        setIsLoading(false);
        setIsPaused(false);
      }
    }, key);

    setIsLoading(false);
    setIsPlaying(success);
    setIsPaused(false);
    if (!success) {
      isPreviewActiveRef.current = false;
      setError('Audio stream unavailable. Check internet connection.');
    }
    return success;
  }, [currentReciter]);

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

  const stop = useCallback(async () => {
    isPreviewActiveRef.current = false;
    await stopAzanAudio();
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
    setError(null);
  }, []);

  const toggle = useCallback(async (reciterKey?: AzanReciterKey) => {
    if (isPlaying) {
      await stop();
    } else if (isPaused) {
      await resume();
    } else {
      await play(reciterKey);
    }
  }, [isPlaying, isPaused, play, resume, stop]);

  const selectReciter = useCallback(async (key: AzanReciterKey) => {
    setCurrentReciter(key);
    await storage.set(APP_CONFIG.storageKeys.azanReciter, key);
    notifyPrayerAlertsChanged();
    if (isPlaying) {
      await stop();
      await play(key);
    }
  }, [isPlaying, play, stop]);

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
