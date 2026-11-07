/**
 * Theme Hook
 * Provides current active theme tokens and toggle utility.
 */
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from '@/constants/theme';

export const useTheme = (overrideMode?: 'dark' | 'light'): Theme => {
  const systemScheme = useColorScheme();
  
  if (overrideMode) {
    return overrideMode === 'light' ? lightTheme : darkTheme;
  }

  return systemScheme === 'light' ? lightTheme : darkTheme;
};

