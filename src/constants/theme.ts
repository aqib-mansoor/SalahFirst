/**
 * Centralized Design System & Theme Tokens
 * Easily change the app's color palette and visual tokens here.
 */

export const PALETTE = {
  // Emerald / Islamic Green primary tones
  primary50: '#E8F5E9',
  primary100: '#C8E6C9',
  primary500: '#10B981',
  primary600: '#059669',
  primary700: '#047857',

  // Deep dark mode backgrounds & surfaces
  darkBackground: '#0B0F12',
  darkSurface: '#141A1F',
  darkSurfaceElevated: '#1D252D',
  darkBorder: '#26313C',

  // Clean light mode backgrounds & surfaces
  lightBackground: '#F8FAFC',
  lightSurface: '#FFFFFF',
  lightSurfaceElevated: '#F1F5F9',
  lightBorder: '#E2E8F0',

  // Text colors
  textLight: '#F1F5F9',
  textLightMuted: '#94A3B8',
  textDark: '#0F172A',
  textDarkMuted: '#64748B',

  // Status & accent
  gold: '#F59E0B',
  goldMuted: '#D97706',
  danger: '#EF4444',
  success: '#10B981',
  info: '#3B82F6',
  transparent: 'transparent',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  primary: string;
  primaryPressed: string;
  accent: string;
  text: string;
  textMuted: string;
  danger: string;
  success: string;
}

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
}

export const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: PALETTE.darkBackground,
    surface: PALETTE.darkSurface,
    surfaceElevated: PALETTE.darkSurfaceElevated,
    border: PALETTE.darkBorder,
    primary: PALETTE.primary500,
    primaryPressed: PALETTE.primary600,
    accent: PALETTE.gold,
    text: PALETTE.textLight,
    textMuted: PALETTE.textLightMuted,
    danger: PALETTE.danger,
    success: PALETTE.success,
  },
};

export const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: PALETTE.lightBackground,
    surface: PALETTE.lightSurface,
    surfaceElevated: PALETTE.lightSurfaceElevated,
    border: PALETTE.lightBorder,
    primary: PALETTE.primary600,
    primaryPressed: PALETTE.primary700,
    accent: PALETTE.goldMuted,
    text: PALETTE.textDark,
    textMuted: PALETTE.textDarkMuted,
    danger: PALETTE.danger,
    success: PALETTE.success,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  titleLarge: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
  titleMedium: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  titleSmall: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
} as const;

export type Spacing = typeof SPACING;
export type Radius = typeof RADIUS;
