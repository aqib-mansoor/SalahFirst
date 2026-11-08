/**
 * Centralized Design System & Theme Tokens: SalahFirst
 * Strict architectural, spiritual, and minimalist color system.
 */

export const salahFirstColors = {
  light: {
    background: '#F7F9F7',
    surface: '#FFFFFF',
    surfaceSubtle: '#EFF5F1',
    primary: '#0A6847',
    primaryHero: '#034D35',
    primaryDark: '#023524',
    secondary: '#2E8B57',
    secondaryTint: '#E8F5EE',
    accent: '#D4AF37',
    accentTint: '#FDF7E7',
    textPrimary: '#0F261D',
    textSecondary: '#5A6F65',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#072418',
    border: '#E0EAE3',
    warning: '#D97706',
    warningBg: '#FEF3C7',
    warningBorder: '#FDE68A',
  },
  dark: {
    background: '#071510',
    surface: '#0E221B',
    surfaceSubtle: '#142E25',
    primary: '#10B981',
    primaryHero: '#043E2B',
    primaryDark: '#02261A',
    secondary: '#34D399',
    secondaryTint: '#0B291F',
    accent: '#E5B842',
    accentTint: '#2B230C',
    textPrimary: '#F2F8F5',
    textSecondary: '#8CA599',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#071510',
    border: '#1B3D30',
    warning: '#F59E0B',
    warningBg: '#2D1D06',
    warningBorder: '#633E0E',
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
  emeraldWatermark: 'rgba(212, 175, 55, 0.08)',
  gold: salahFirstColors.light.accent,
  goldLight: salahFirstColors.light.accentTint,
  goldDark: '#B89328',
  goldMuted: '#D9BA78',
  sageLight: salahFirstColors.light.secondaryTint,
  sageMuted: salahFirstColors.light.secondary,
  sageDim: salahFirstColors.light.textSecondary,
  mintTint: salahFirstColors.light.secondaryTint,
  mintTintPressed: '#DCF0E1',
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
  darkMintPressed: '#12382B',
  darkText: salahFirstColors.dark.textPrimary,
  darkTextMuted: salahFirstColors.dark.textSecondary,
  darkTextSubtle: salahFirstColors.dark.textSecondary,
  black: '#000000',
  transparent: 'transparent',
} as const;

export const WELCOME_THEME = {
  background: salahFirstColors.light.primaryHero,
  surface: salahFirstColors.light.primaryDark,
  watermark: 'rgba(212, 175, 55, 0.08)',
  watermarkGold: salahFirstColors.light.accent,
  titleWhite: salahFirstColors.light.textOnPrimary,
  titleAccent: salahFirstColors.light.accent,
  bismillah: salahFirstColors.light.accentTint,
  tagline: salahFirstColors.light.secondary,
  badge: salahFirstColors.light.secondary,
  buttonBg: salahFirstColors.light.accent,
  buttonPressed: '#B89328',
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
    accentMuted: '#CBB28C',
    watermark: 'rgba(212, 175, 55, 0.08)',
    buttonGold: salahFirstColors.light.accent,
    buttonGoldPressed: '#B89328',
    buttonGoldText: salahFirstColors.light.textOnAccent,
    bannerGreen: salahFirstColors.light.primaryHero,
    bannerGreenText: salahFirstColors.light.textOnPrimary,
    mintTint: salahFirstColors.light.secondaryTint,
    mintTintPressed: '#DCF0E1',
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
    watermark: 'rgba(229, 184, 66, 0.07)',
    buttonGold: salahFirstColors.dark.accent,
    buttonGoldPressed: '#C59B27',
    buttonGoldText: salahFirstColors.dark.textOnAccent,
    bannerGreen: salahFirstColors.dark.primaryHero,
    bannerGreenText: salahFirstColors.dark.textOnPrimary,
    mintTint: salahFirstColors.dark.secondaryTint,
    mintTintPressed: '#12382B',
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
