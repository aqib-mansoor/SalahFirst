/**
 * Centralized Design System & Theme Tokens: SalahFirst
 * Strict architectural, spiritual, and minimalist color system.
 */

export const salahFirstColors = {
  light: {
    background: '#F8F7F2',
    surface: '#FFFFFF',
    surfaceSubtle: '#F0EFE9',
    primary: '#145A46',
    primaryHero: '#145A46',
    primaryDark: '#0E4031',
    secondary: '#A8C6B0',
    secondaryTint: '#F0F6F2',
    accent: '#D6B56D',
    accentTint: '#FBF6EA',
    textPrimary: '#202923',
    textSecondary: '#777F79',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#202923',
    border: '#E6E4DD',
    warning: '#C87A28',
    warningBg: '#FFF8EC',
    warningBorder: '#E8D0A7',
  },
  dark: {
    background: '#121815',
    surface: '#1C2520',
    surfaceSubtle: '#25302A',
    primary: '#1E7A60',
    primaryHero: '#145A46',
    primaryDark: '#0B2E23',
    secondary: '#3A5A47',
    secondaryTint: '#1E2E25',
    accent: '#DFC17B',
    accentTint: '#2D281C',
    textPrimary: '#F2F4F3',
    textSecondary: '#9CA69E',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#121815',
    border: '#2C3831',
    warning: '#E09648',
    warningBg: '#2B2116',
    warningBorder: '#4A3823',
  },
} as const;

export type ThemeMode = keyof typeof salahFirstColors;
export type ColorTheme = typeof salahFirstColors.light;

export const PALETTE = {
  emeraldDark: salahFirstColors.light.primary,
  emeraldDeep: salahFirstColors.light.primaryDark,
  emeraldSurface: salahFirstColors.light.primaryHero,
  emeraldElevated: salahFirstColors.dark.primary,
  emeraldBorder: salahFirstColors.light.primaryDark,
  emeraldWatermark: 'rgba(255, 255, 255, 0.05)',
  gold: salahFirstColors.light.accent,
  goldLight: salahFirstColors.light.accentTint,
  goldDark: '#B58E50',
  goldMuted: '#CBB28C',
  sageLight: salahFirstColors.light.secondaryTint,
  sageMuted: salahFirstColors.light.secondary,
  sageDim: salahFirstColors.light.textSecondary,
  mintTint: salahFirstColors.light.secondaryTint,
  mintTintPressed: '#E2EFE7',
  privacyBg: salahFirstColors.light.secondaryTint,
  privacyText: salahFirstColors.light.primary,
  white: salahFirstColors.light.surface,
  cardBorder: salahFirstColors.light.border,
  trackBg: salahFirstColors.light.border,
  streakOrange: salahFirstColors.light.accent,
  inputBg: salahFirstColors.light.surfaceSubtle,
  textDark: salahFirstColors.light.textPrimary,
  textSlate: salahFirstColors.light.textSecondary,
  textDim: salahFirstColors.light.textSecondary,
  obsidianBg: salahFirstColors.dark.background,
  obsidianSurface: salahFirstColors.dark.surface,
  obsidianElevated: salahFirstColors.dark.surfaceSubtle,
  obsidianBorder: salahFirstColors.dark.border,
  emeraldVibrant: salahFirstColors.dark.primary,
  emeraldVibrantPressed: salahFirstColors.dark.primaryDark,
  darkMintTint: salahFirstColors.dark.secondaryTint,
  darkMintPressed: '#263B30',
  darkText: salahFirstColors.dark.textPrimary,
  darkTextMuted: salahFirstColors.dark.textSecondary,
  darkTextSubtle: salahFirstColors.dark.textSecondary,
  black: '#000000',
  transparent: 'transparent',
} as const;

export const WELCOME_THEME = {
  background: salahFirstColors.light.primaryHero,
  surface: salahFirstColors.light.primaryDark,
  watermark: 'rgba(255, 255, 255, 0.05)',
  watermarkGold: salahFirstColors.light.accent,
  titleWhite: salahFirstColors.light.textOnPrimary,
  titleAccent: salahFirstColors.light.accent,
  bismillah: salahFirstColors.light.accentTint,
  tagline: salahFirstColors.light.secondary,
  badge: salahFirstColors.light.secondary,
  buttonBg: salahFirstColors.light.accent,
  buttonPressed: '#B58E50',
  buttonText: salahFirstColors.light.textOnAccent,
} as const;

export interface ThemeColors {
  background: string; surface: string; surfaceSubtle: string;
  primary: string; primaryHero: string; primaryDark: string;
  secondary: string; secondaryTint: string; accent: string; accentTint: string;
  textPrimary: string; textSecondary: string; textOnPrimary: string; textOnAccent: string;
  border: string; warning: string; warningBg: string; warningBorder: string;
  // Compatibility & Semantic Aliases
  text: string; textMuted: string; textSubtle: string; textInverse: string;
  surfaceElevated: string; primaryPressed: string; borderGold: string;
  accentLight: string; accentMuted: string; watermark: string;
  buttonGold: string; buttonGoldPressed: string; buttonGoldText: string;
  bannerGreen: string; bannerGreenText: string; mintTint: string; mintTintPressed: string;
  privacyBg: string; privacyText: string; error: string; notificationRed: string;
}

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
}

export const lightTheme: Theme = {
  isDark: false,
  colors: {
    ...salahFirstColors.light,
    text: salahFirstColors.light.textPrimary,
    textMuted: salahFirstColors.light.textSecondary,
    textSubtle: salahFirstColors.light.textSecondary,
    textInverse: salahFirstColors.light.textOnPrimary,
    surfaceElevated: salahFirstColors.light.surfaceSubtle,
    primaryPressed: salahFirstColors.light.primaryDark,
    borderGold: salahFirstColors.light.accent,
    accentLight: salahFirstColors.light.accentTint,
    accentMuted: salahFirstColors.light.secondary,
    watermark: 'rgba(255, 255, 255, 0.05)',
    buttonGold: salahFirstColors.light.accent,
    buttonGoldPressed: '#B58E50',
    buttonGoldText: salahFirstColors.light.textOnAccent,
    bannerGreen: salahFirstColors.light.primaryHero,
    bannerGreenText: salahFirstColors.light.textOnPrimary,
    mintTint: salahFirstColors.light.secondaryTint,
    mintTintPressed: '#E2EFE7',
    privacyBg: salahFirstColors.light.secondaryTint,
    privacyText: salahFirstColors.light.primary,
    error: '#DC2626',
    notificationRed: '#DC2626',
  },
};

export const darkTheme: Theme = {
  isDark: true,
  colors: {
    ...salahFirstColors.dark,
    text: salahFirstColors.dark.textPrimary,
    textMuted: salahFirstColors.dark.textSecondary,
    textSubtle: salahFirstColors.dark.textSecondary,
    textInverse: salahFirstColors.dark.textOnPrimary,
    surfaceElevated: salahFirstColors.dark.surfaceSubtle,
    primaryPressed: salahFirstColors.dark.primaryDark,
    borderGold: salahFirstColors.dark.accent,
    accentLight: salahFirstColors.dark.accentTint,
    accentMuted: salahFirstColors.dark.secondary,
    watermark: 'rgba(255, 255, 255, 0.05)',
    buttonGold: salahFirstColors.dark.accent,
    buttonGoldPressed: '#CBB28C',
    buttonGoldText: salahFirstColors.dark.textOnAccent,
    bannerGreen: salahFirstColors.dark.primaryHero,
    bannerGreenText: salahFirstColors.dark.textOnPrimary,
    mintTint: salahFirstColors.dark.secondaryTint,
    mintTintPressed: '#263B30',
    privacyBg: salahFirstColors.dark.secondaryTint,
    privacyText: salahFirstColors.dark.secondary,
    error: '#F87171',
    notificationRed: '#F87171',
  },
};

export const ELEVATION = {
  soft: {
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  card: {
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48,
} as const;

export const RADIUS = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, full: 9999,
} as const;

export const TYPOGRAPHY = {
  brandTitle: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.5 },
  timerDisplay: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -1 },
  headerMotto: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 2.8 },
  arabicMotto: { fontSize: 18, fontWeight: '600' as const, lineHeight: 28, letterSpacing: 0 },
  ayahArabic: { fontSize: 21, fontWeight: '700' as const, lineHeight: 34, letterSpacing: 0 },
  titleLarge: { fontSize: 26, fontWeight: '800' as const, lineHeight: 32 },
  titleMedium: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  titleSmall: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  bodyLarge: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  pill: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.8 },
} as const;

export type Spacing = typeof SPACING;
export type Radius = typeof RADIUS;
