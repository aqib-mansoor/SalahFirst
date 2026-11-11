import { useEffect } from 'react';
import { Platform, NativeModules } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';
import { salahFirstColors } from '@/constants/theme';

const { SystemNavModule } = NativeModules;

export interface UseAdaptiveNavigationBarOptions {
  isDark: boolean;
  forceLightButtons?: boolean;
}

/**
 * Custom hook to enforce matching Android System Navigation Bar colors.
 * Light mode: #F8FAF8 background with dark contrast button icons.
 * Dark mode: #071812 background with light contrast button icons.
 * Welcome / Wallpaper screens: #075E3A (Primary Hero) background with light buttons.
 */
export const useTransparentNavigationBar = ({
  isDark,
  forceLightButtons = false,
}: UseAdaptiveNavigationBarOptions) => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    try {
      const bgColor = forceLightButtons
        ? salahFirstColors.light.primaryHero
        : isDark
        ? salahFirstColors.dark.background
        : salahFirstColors.light.background;

      const isDarkMode = forceLightButtons || isDark;

      if (SystemNavModule?.setNavigationBarTheme) {
        SystemNavModule.setNavigationBarTheme(isDarkMode, bgColor);
      } else {
        NavigationBar.setStyle(isDarkMode ? 'dark' : 'light');
      }
    } catch {}
  }, [isDark, forceLightButtons]);
};

export { NavigationBar };
