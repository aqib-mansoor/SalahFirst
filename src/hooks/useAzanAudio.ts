import { useState, useEffect, useCallback } from 'react';
import {
  playAzanAudio,
  stopAzanAudio,
  pauseAzanAudio,
  resumeAzanAudio,
  AZAN_PRESET_URLS,
  AzanReciterKey,
} from '@/utils/azanAudio';

export const useAzanAudio = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentReciter, setCurrentReciter] = useState<AzanReciterKey>('makkah');

  useEffect(() => {
    return () => {
      stopAzanAudio();
    };
  }, []);

  const play = useCallback(async (reciterKey?: AzanReciterKey) => {
    const key = reciterKey || currentReciter;
    setError(null);
    setIsLoading(true);

    const success = await playAzanAudio((playing, finished) => {
      setIsPlaying(playing && !finished);
      if (finished) {
        setIsLoading(false);
        setIsPaused(false);
      }
    }, key);

    setIsLoading(false);
    setIsPlaying(success);
    setIsPaused(false);
    if (!success) {
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
