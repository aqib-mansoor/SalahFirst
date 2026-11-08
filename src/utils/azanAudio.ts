import { createAudioPlayer, setAudioModeAsync, AudioPlayer, AudioStatus } from 'expo-audio';

export const AZAN_PRESET_URLS = {
  makkah: 'https://cdn.aladhan.com/audio/adhans/a1.mp3',
  madinah: 'https://cdn.aladhan.com/audio/adhans/a2.mp3',
  alAqsa: 'https://cdn.aladhan.com/audio/adhans/a3.mp3',
} as const;

export type AzanReciterKey = keyof typeof AZAN_PRESET_URLS;

const DEFAULT_AZAN_URL = AZAN_PRESET_URLS.makkah;

let currentPlayer: AudioPlayer | null = null;
let currentSubscription: { remove: () => void } | null = null;

export const configureAudioMode = async (): Promise<void> => {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'duckOthers',
    });
  } catch {}
};

export const playAzanAudio = async (
  onStatusUpdate?: (isPlaying: boolean, isFinished: boolean) => void,
  customUri?: string
): Promise<boolean> => {
  try {
    await stopAzanAudio();
    await configureAudioMode();

    const uri = customUri || DEFAULT_AZAN_URL;
    const player = createAudioPlayer(uri);

    currentSubscription = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      if ((status as any).error) {
        onStatusUpdate?.(false, true);
        return;
      }

      if (status.didJustFinish) {
        onStatusUpdate?.(false, true);
        stopAzanAudio();
      } else {
        onStatusUpdate?.(status.playing, false);
      }
    });

    player.play();
    currentPlayer = player;
    return true;
  } catch {
    onStatusUpdate?.(false, true);
    return false;
  }
};

export const stopAzanAudio = async (): Promise<void> => {
  try {
    if (currentSubscription) {
      currentSubscription.remove();
      currentSubscription = null;
    }
    if (currentPlayer) {
      currentPlayer.pause();
      currentPlayer.seekTo(0);
      currentPlayer.remove();
      currentPlayer = null;
    }
  } catch {
    currentPlayer = null;
    currentSubscription = null;
  }
};

export const pauseAzanAudio = async (): Promise<boolean> => {
  try {
    if (currentPlayer) {
      currentPlayer.pause();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const resumeAzanAudio = async (): Promise<boolean> => {
  try {
    if (currentPlayer) {
      currentPlayer.play();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const isAzanPlaying = async (): Promise<boolean> => {
  try {
    if (!currentPlayer) return false;
    return currentPlayer.playing;
  } catch {
    return false;
  }
};
