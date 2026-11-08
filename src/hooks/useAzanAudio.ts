import { useState, useEffect, useCallback } from 'react';
import { playAzanAudio, stopAzanAudio, pauseAzanAudio, resumeAzanAudio } from '@/utils/azanAudio';

export const useAzanAudio = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopAzanAudio();
    };
  }, []);

  const play = useCallback(async (customUri?: string) => {
    setError(null);
    setIsLoading(true);
    const success = await playAzanAudio((playing, finished) => {
      setIsPlaying(playing && !finished);
      if (finished) {
        setIsLoading(false);
        setIsPaused(false);
      }
    }, customUri);

    setIsLoading(false);
    setIsPlaying(success);
    setIsPaused(false);
    if (!success) {
      setError('Audio stream unavailable. Check internet connection.');
    }
    return success;
  }, []);

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

  const toggle = useCallback(async (customUri?: string) => {
    if (isPlaying) {
      await stop();
    } else if (isPaused) {
      await resume();
    } else {
      await play(customUri);
    }
  }, [isPlaying, isPaused, play, resume, stop]);

  return {
    isPlaying,
    isPaused,
    isLoading,
    error,
    play,
    pause,
    resume,
    stop,
    toggle,
  };
};

