import { useEffect } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

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

    const configureNavbar = async () => {
      try {
        await NavigationBar.setPositionAsync('absolute');
        await NavigationBar.setBackgroundColorAsync('#00000000');
        const buttonStyle = forceLightButtons || isDark ? 'light' : 'dark';
        await NavigationBar.setButtonStyleAsync(buttonStyle);
      } catch {}
    };

    configureNavbar();

    // Re-enforce on app resume
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (status === 'active') {
        configureNavbar();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isDark, forceLightButtons]);
};
