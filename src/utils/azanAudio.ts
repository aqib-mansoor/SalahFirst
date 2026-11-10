import { createAudioPlayer, setAudioModeAsync, AudioPlayer, AudioStatus } from 'expo-audio';

export const AZAN_PRESET_URLS = {
  makkah: 'https://cdn.aladhan.com/audio/adhans/a1.mp3',
  madinah: 'https://cdn.aladhan.com/audio/adhans/a2.mp3',
  alAqsa: 'https://cdn.aladhan.com/audio/adhans/a3.mp3',
} as const;

export type AzanReciterKey = keyof typeof AZAN_PRESET_URLS;

// 100% Offline Bundled Local Audio Assets
export const AZAN_LOCAL_ASSETS: Record<AzanReciterKey, any> = {
  makkah: require('../../assets/audio/azan_makkah.mp3'),
  madinah: require('../../assets/audio/azan_madinah.mp3'),
  alAqsa: require('../../assets/audio/azan_alaqsa.mp3'),
};

// Exact seconds offset to eliminate pre-recitation silence/delay (bundled offline assets are trimmed to start immediately at 0s)
export const AZAN_START_OFFSETS: Record<AzanReciterKey, number> = {
  makkah: 0,
  madinah: 0,
  alAqsa: 0,
};

let currentPlayer: AudioPlayer | null = null;
let currentSubscription: { remove: () => void } | null = null;

/**
 * respectSilentMode = true  -> automatic prayer-time Azan stays muted on Silent/Vibrate/DND.
 * respectSilentMode = false -> user-initiated preview always plays.
 */
export const configureAudioMode = async (respectSilentMode: boolean = false): Promise<void> => {
  try {
    await setAudioModeAsync({
      playsInSilentMode: !respectSilentMode,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
    });
  } catch {}
};

export const playAzanAudio = async (
  onStatusUpdate?: (isPlaying: boolean, isFinished: boolean) => void,
  reciterOrUri?: AzanReciterKey | string,
  respectSilentMode: boolean = false
): Promise<boolean> => {
  try {
    await stopAzanAudio();
    await configureAudioMode(respectSilentMode);

    const isReciterKey = reciterOrUri && reciterOrUri in AZAN_PRESET_URLS;
    const reciterKey: AzanReciterKey = isReciterKey ? (reciterOrUri as AzanReciterKey) : 'makkah';

    // Prioritize bundled local offline asset first, fallback to remote CDN
    const source = isReciterKey
      ? (AZAN_LOCAL_ASSETS[reciterKey] || AZAN_PRESET_URLS[reciterKey])
      : (reciterOrUri || AZAN_LOCAL_ASSETS.makkah);

    const player = createAudioPlayer(source);

    // Apply start offset to skip intro silence (e.g. 3.8s for Makkah) so Azan recites immediately
    const startOffset = isReciterKey ? (AZAN_START_OFFSETS[reciterKey] || 0) : 0;
    if (startOffset > 0) {
      try {
        await player.seekTo(startOffset);
      } catch {}
    }

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
