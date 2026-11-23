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
  isThemeHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

let cachedThemeMode: ThemeMode | null = null;

const initialScheme = Appearance.getColorScheme();
const initialIsDark = initialScheme === 'dark';

const ThemeContext = createContext<ThemeContextValue>({
  theme: initialIsDark ? darkTheme : lightTheme,
  themeMode: 'system',
  isDark: initialIsDark,
  isThemeHydrated: false,
  setThemeMode: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hookScheme = useColorScheme();
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    initialScheme || hookScheme || 'light'
  );
  const [themeMode, setThemeModeState] = useState<ThemeMode>(cachedThemeMode || 'system');
  const [isThemeHydrated, setIsThemeHydrated] = useState<boolean>(cachedThemeMode !== null);

  // Synchronous Appearance listener for instantaneous system dark/light switching
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme || 'light');
    });
    return () => sub.remove();
  }, []);

  // Update system scheme if hook changes
  useEffect(() => {
    if (hookScheme) {
      setSystemScheme(hookScheme);
    }
  }, [hookScheme]);

  // Hydrate stored theme preference with legacy fallback before rendering children
  useEffect(() => {
    let isCancelled = false;
    const timeout = setTimeout(() => {
      if (!isCancelled) {
        setIsThemeHydrated(true);
      }
    }, 1000);

    const hydrateTheme = async () => {
      try {
        let stored = await storage.get<ThemeMode | null>(APP_CONFIG.storageKeys.theme, null);
        if (!stored) {
          stored = await storage.get<ThemeMode | null>('salahfirst_theme_mode', null);
        }
        if (stored && !isCancelled) {
          cachedThemeMode = stored;
          setThemeModeState(stored);
        }
      } finally {
        if (!isCancelled) {
          clearTimeout(timeout);
          setIsThemeHydrated(true);
        }
      }
    };

    hydrateTheme();
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    cachedThemeMode = mode;
    setThemeModeState(mode);
    await storage.set(APP_CONFIG.storageKeys.theme, mode);
  }, []);

  const activeScheme = hookScheme || systemScheme;
  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && activeScheme === 'dark');

  const theme: Theme = isDark ? darkTheme : lightTheme;

  // Prevent flash of wrong theme before stored preference is hydrated
  if (!isThemeHydrated) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, isThemeHydrated, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppThemeContext = () => useContext(ThemeContext);
