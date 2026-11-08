import { Audio, AVPlaybackStatus } from 'expo-av';

const DEFAULT_AZAN_URL =
  'https://cdn.aladhan.com/audio/adhans/makkah.mp3';

let currentSound: Audio.Sound | null = null;
let currentPlaybackListener: ((status: AVPlaybackStatus) => void) | null = null;

export const configureAudioMode = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
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
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, volume: 1.0 },
      (status) => {
        if (!status.isLoaded) {
          if (status.error) {
            onStatusUpdate?.(false, true);
          }
          return;
        }

        if (status.didJustFinish) {
          onStatusUpdate?.(false, true);
          stopAzanAudio();
        } else {
          onStatusUpdate?.(status.isPlaying, false);
        }
      }
    );

    currentSound = sound;
    return true;
  } catch {
    onStatusUpdate?.(false, true);
    return false;
  }
};

export const stopAzanAudio = async (): Promise<void> => {
  try {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }
  } catch {
    currentSound = null;
  }
};

export const pauseAzanAudio = async (): Promise<boolean> => {
  try {
    if (currentSound) {
      await currentSound.pauseAsync();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const resumeAzanAudio = async (): Promise<boolean> => {
  try {
    if (currentSound) {
      await currentSound.playAsync();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const isAzanPlaying = async (): Promise<boolean> => {
  try {
    if (!currentSound) return false;
    const status = await currentSound.getStatusAsync();
    return status.isLoaded && status.isPlaying;
  } catch {
    return false;
  }
};

