import { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationBar, NavigationBarStyle } from 'expo-navigation-bar';

export interface UseTransparentNavigationBarOptions {
  isDark: boolean;
  forceLightButtons?: boolean;
}

/**
 * Custom hook to enforce edge-to-edge transparent Android Navigation Bar.
 * Ensures the system navigation bar is never white and stays 100% transparent overlay.
 */
export const useTransparentNavigationBar = ({
  isDark,
  forceLightButtons = false,
}: UseTransparentNavigationBarOptions) => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    try {
      // In expo-navigation-bar:
      // 'dark' = dark bar background with light content (light icons/buttons)
      // 'light' = light bar background with dark content (dark icons/buttons)
      const style: NavigationBarStyle = forceLightButtons || isDark ? 'dark' : 'light';
      NavigationBar.setStyle(style);
    } catch {}
  }, [isDark, forceLightButtons]);
};

export { NavigationBar };
