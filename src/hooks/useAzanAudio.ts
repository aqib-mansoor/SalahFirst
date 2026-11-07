import { useState, useEffect, useCallback } from 'react';
import { playAzanAudio, stopAzanAudio } from '@/utils/azanAudio';

export const useAzanAudio = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      stopAzanAudio();
    };
  }, []);

  const play = useCallback(async (customUri?: string) => {
    setIsLoading(true);
    const success = await playAzanAudio((playing, finished) => {
      setIsPlaying(playing && !finished);
      if (finished) {
        setIsLoading(false);
      }
    }, customUri);

    setIsLoading(false);
    setIsPlaying(success);
    return success;
  }, []);

  const stop = useCallback(async () => {
    await stopAzanAudio();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const toggle = useCallback(async (customUri?: string) => {
    if (isPlaying) {
      await stop();
    } else {
      await play(customUri);
    }
  }, [isPlaying, play, stop]);

  return {
    isPlaying,
    isLoading,
    play,
    stop,
    toggle,
  };
};
