/**
 * Centralized Theme Hook
 * Seamlessly consumes global theme context (Light, Dark, System)
 */
import { darkTheme, lightTheme, Theme } from '@/constants/theme';
import { useAppThemeContext } from '@/context/ThemeContext';

export const useTheme = (overrideMode?: 'dark' | 'light'): Theme => {
  const context = useAppThemeContext();

  if (overrideMode) {
    return overrideMode === 'light' ? lightTheme : darkTheme;
  }

  return context.theme;
};

export const useThemeState = () => {
  const { theme, themeMode, isDark, setThemeMode } = useAppThemeContext();
  return { theme, themeMode, isDark, setThemeMode };
};
