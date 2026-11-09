import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from '@/constants/theme';
import { ThemeMode } from '@/types';
import { storage } from '@/utils/storage';
import { APP_CONFIG } from '@/constants/config';

export interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const initialScheme = Appearance.getColorScheme();
const initialIsDark = initialScheme === 'dark';

const ThemeContext = createContext<ThemeContextValue>({
  theme: initialIsDark ? darkTheme : lightTheme,
  themeMode: 'system',
  isDark: initialIsDark,
  setThemeMode: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hookScheme = useColorScheme();
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    initialScheme || hookScheme || 'light'
  );
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Synchronous Appearance listener for instantaneous system dark/light switching
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  // Update system scheme if hook changes
  useEffect(() => {
    if (hookScheme) {
      setSystemScheme(hookScheme);
    }
  }, [hookScheme]);

  // Hydrate stored theme preference with legacy fallback
  useEffect(() => {
    const hydrateTheme = async () => {
      let stored = await storage.get<ThemeMode | null>(APP_CONFIG.storageKeys.theme, null);
      if (!stored) {
        stored = await storage.get<ThemeMode | null>('salahfirst_theme_mode', null);
      }
      if (stored) {
        setThemeModeState(stored);
      }
    };
    hydrateTheme();
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await storage.set(APP_CONFIG.storageKeys.theme, mode);
  }, []);

  const activeScheme = hookScheme || systemScheme;
  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && activeScheme === 'dark');

  const theme: Theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppThemeContext = () => useContext(ThemeContext);
