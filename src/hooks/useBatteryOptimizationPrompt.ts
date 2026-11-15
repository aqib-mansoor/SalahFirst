import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';
import {
  isIgnoringBatteryOptimizations,
  requestIgnoreBatteryOptimizations,
} from '@/native/AzanServiceModule';

/**
 * Intelligent One-Time Battery Optimization Prompt Hook.
 * Controls the custom explanatory bottom sheet visibility.
 */
export const useBatteryOptimizationPrompt = (shouldCheck: boolean = true) => {
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!shouldCheck || Platform.OS !== 'android' || hasCheckedRef.current) return;

    const checkAndPrompt = async () => {
      try {
        hasCheckedRef.current = true;
        const alreadyPrompted = await storage.get<boolean>(
          APP_CONFIG.storageKeys.batteryPromptShown,
          false
        );
        if (alreadyPrompted) return;

        const isUnrestricted = await isIgnoringBatteryOptimizations();
        if (!isUnrestricted) {
          setIsPromptVisible(true);
        } else {
          await storage.set(APP_CONFIG.storageKeys.batteryPromptShown, true);
        }
      } catch {
        // Silently catch to avoid interrupting user experience
      }
    };

    const timer = setTimeout(checkAndPrompt, 1500);
    return () => clearTimeout(timer);
  }, [shouldCheck]);

  const confirmPrompt = useCallback(async () => {
    setIsPromptVisible(false);
    await storage.set(APP_CONFIG.storageKeys.batteryPromptShown, true);
    await requestIgnoreBatteryOptimizations();
  }, []);

  const dismissPrompt = useCallback(async () => {
    setIsPromptVisible(false);
    await storage.set(APP_CONFIG.storageKeys.batteryPromptShown, true);
  }, []);

  return {
    isPromptVisible,
    confirmPrompt,
    dismissPrompt,
  };
};
