import { Vibration } from 'react-native';
import { store } from '@/store';

export type HapticStyle = 'light' | 'medium' | 'success';

const DURATION_MAP: Record<HapticStyle, number | number[]> = {
  light: 12,
  medium: 24,
  success: 36,
};

/**
 * Fires a subtle tactile vibration pulse when Haptic Feedback is enabled in user preferences.
 */
export const triggerHaptic = (style: HapticStyle = 'light'): void => {
  try {
    const enabled = store.getState().preferences.hapticFeedback;
    if (!enabled) return;
    Vibration.vibrate(DURATION_MAP[style]);
  } catch {
    // Non-blocking fallback if vibration hardware is unavailable
  }
};
