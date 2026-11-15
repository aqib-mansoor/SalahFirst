import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import {
  isIgnoringBatteryOptimizations,
  requestIgnoreBatteryOptimizations,
} from '@/native/AzanServiceModule';

/**
 * Intelligent One-Time Battery Optimization Prompt Hook.
 * Prompts the user once to allow unrestricted background execution
 * so OEM task killers (Realme, Xiaomi, Oppo, Samsung) don't silence the Azan.
 */
export const useBatteryOptimizationPrompt = (shouldCheck: boolean = true) => {
  const hasPromptedRef = useRef(false);

  useEffect(() => {
    if (!shouldCheck || Platform.OS !== 'android' || hasPromptedRef.current) return;

    const checkAndPrompt = async () => {
      try {
        const alreadyPrompted = await storage.get<boolean>(
          APP_CONFIG.storageKeys.batteryPromptShown,
          false
        );
        if (alreadyPrompted) return;

        const isUnrestricted = await isIgnoringBatteryOptimizations();
        if (!isUnrestricted) {
          hasPromptedRef.current = true;
          await storage.set(APP_CONFIG.storageKeys.batteryPromptShown, true);
          await requestIgnoreBatteryOptimizations();
        } else {
          await storage.set(APP_CONFIG.storageKeys.batteryPromptShown, true);
        }
      } catch {
        // Silently catch to avoid interrupting user experience
      }
    };

    const timer = setTimeout(checkAndPrompt, 1200);
    return () => clearTimeout(timer);
  }, [shouldCheck]);
};
