import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer, AudioStatus } from 'expo-audio';
import { getDeviceSoundMode } from '@/native/AzanServiceModule';

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

// Android res/raw names (same files used by native AzanService). A bare name makes
// expo-audio load the raw resource directly, independent of the Metro dev server.
const ANDROID_RAW_NAMES: Record<AzanReciterKey, string> = {
  makkah: 'azan_makkah',
  madinah: 'azan_madinah',
  alAqsa: 'azan_alaqsa',
};

const getAzanSource = (key: AzanReciterKey) =>
  Platform.OS === 'android' ? { uri: ANDROID_RAW_NAMES[key] } : AZAN_LOCAL_ASSETS[key];

let currentPlayer: AudioPlayer | null = null;
let currentSubscription: { remove: () => void } | null = null;
let activeSessionId = 0;

/**
 * Configure audio mode to respect system ringer and DND constraints.
 */
export const configureAudioMode = async (respectSilentMode: boolean = true): Promise<void> => {
  try {
    await setAudioModeAsync({
      playsInSilentMode: !respectSilentMode,
      shouldPlayInBackground: false,
      interruptionMode: 'duckOthers',
    });
  } catch {}
};

/**
 * Stop and completely release any active audio player.
 */
export const stopAzanAudio = async (): Promise<void> => {
  activeSessionId++;
  if (currentSubscription) {
    try {
      currentSubscription.remove();
    } catch {}
    currentSubscription = null;
  }

  if (currentPlayer) {
    try {
      currentPlayer.pause();
      currentPlayer.remove();
    } catch {}
    currentPlayer = null;
  }
};

export interface PlayAzanAudioOptions {
  onStatusUpdate?: AzanStatusCallback;
  reciterOrUri?: AzanReciterKey | string;
  respectSilentMode?: boolean;
}

/**
 * Play selected Azan audio file with safe single-instance player lifecycle.
 */
export type AzanStatusCallback = (isPlaying: boolean, isFinished: boolean, hadError?: boolean) => void;

export const playAzanAudio = async (
  onStatusUpdate?: AzanStatusCallback,
  reciterOrUri?: AzanReciterKey | string,
  respectSilentMode: boolean = true
): Promise<boolean> => {
  // Always stop previous player instance cleanly first
  await stopAzanAudio();

  const thisSessionId = ++activeSessionId;

  // Inspect Android sound mode before initiating playback
  if (respectSilentMode) {
    const soundState = await getDeviceSoundMode();
    if (!soundState.canPlayAudibleSound) {
      onStatusUpdate?.(false, true);
      return false;
    }
  }

  try {
    await configureAudioMode(respectSilentMode);

    const isReciterKey = reciterOrUri && reciterOrUri in AZAN_LOCAL_ASSETS;
    const reciterKey: AzanReciterKey = isReciterKey ? (reciterOrUri as AzanReciterKey) : 'makkah';

    // Strictly prioritize bundled offline asset
    const player = createAudioPlayer(getAzanSource(reciterKey));

    if (thisSessionId !== activeSessionId) {
      player.remove();
      return false;
    }

    currentSubscription = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      if (thisSessionId !== activeSessionId) return;

      if (status.error) {
        if (__DEV__) console.warn('[azanAudio] playback error:', status.error);
        onStatusUpdate?.(false, true, true);
        stopAzanAudio();
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
  } catch (e) {
    if (__DEV__) console.warn('[azanAudio] failed to start playback:', e);
    if (thisSessionId === activeSessionId) {
      onStatusUpdate?.(false, true, true);
      await stopAzanAudio();
    }
    return false;
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
