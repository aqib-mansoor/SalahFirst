/**
 * Centralized Design System & Theme Tokens: SalahFirst
 * Strict architectural, spiritual, and minimalist color system.
 */

export const salahFirstColors = {
  light: {
    background: '#F8FAF8',
    surface: '#FFFFFF',
    surfaceSubtle: '#F0F5F2',
    primary: '#0E7449',
    primaryHero: '#075E3A',
    primaryDark: '#044328',
    secondary: '#2AA164',
    secondaryTint: '#E9F6EF',
    accent: '#F3C440',
    accentTint: '#FFFBEB',
    textPrimary: '#0A2419',
    textSecondary: '#566E62',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#062518',
    border: '#DFEAE3',
    warning: '#D97706',
    warningBg: '#FEF3C7',
    warningBorder: '#FDE68A',
  },
  dark: {
    background: '#071812',
    surface: '#0D251D',
    surfaceSubtle: '#133429',
    primary: '#10B981',
    primaryHero: '#084F33',
    primaryDark: '#043622',
    secondary: '#34D399',
    secondaryTint: '#0B291F',
    accent: '#F7CF57',
    accentTint: '#2B2308',
    textPrimary: '#F2F9F5',
    textSecondary: '#A8C2B6',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#071812',
    border: '#193F31',
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
  emeraldWatermark: 'rgba(243, 196, 64, 0.12)',
  gold: salahFirstColors.light.accent,
  goldLight: '#FFF5D6',
  goldDark: '#D4A429',
  goldMuted: '#E5C678',
  sageLight: salahFirstColors.light.secondaryTint,
  sageMuted: salahFirstColors.light.secondary,
  sageDim: salahFirstColors.light.textSecondary,
  mintTint: salahFirstColors.light.secondaryTint,
  mintTintPressed: '#DAEFE3',
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
  darkMintPressed: '#103B2C',
  darkText: salahFirstColors.dark.textPrimary,
  darkTextMuted: salahFirstColors.dark.textSecondary,
  darkTextSubtle: salahFirstColors.dark.textSecondary,
  black: '#000000',
  transparent: 'transparent',
} as const;

export const PRAYER_ICON_PALETTE = {
  starLight: '#FFFFFF',
  starMid: '#FFE57F',
  starEdge: '#F59E0B',
  starGlow: '#FCD34D',
  starBlueLight: '#E0F2FE',
  starBlue: '#60A5FA',
  sunSpecular: '#FFFFFF',
  sunCore: '#FFF59D',
  sunMid: '#FFB300',
  sunDeep: '#E65100',
  sunRay: '#FFA000',
  cloudTop: '#FFFFFF',
  cloudMid: '#DBEAFE',
  cloudBase: '#93C5FD',
  cloudShadow: '#60A5FA',
  sunsetGlow: '#FB923C',
  sunsetSunTop: '#FFF176',
  sunsetSunMid: '#FF9800',
  sunsetSunBottom: '#D84315',
  mountainBackLit: '#8B5CF6',
  mountainBackDark: '#3B0764',
  mountainFrontLit: '#A3E635',
  mountainFrontMid: '#22C55E',
  mountainFrontDark: '#14532D',
  moonSpecular: '#FFFFFF',
  moonLight: '#F1F5F9',
  moonMid: '#CBD5E1',
  moonShadow: '#64748B',
  moonCrater: '#94A3B8',
} as const;

export const WELCOME_THEME = {
  background: salahFirstColors.light.primaryHero,
  surface: salahFirstColors.light.primaryDark,
  watermark: 'rgba(243, 196, 64, 0.12)',
  watermarkGold: salahFirstColors.light.accent,
  titleWhite: salahFirstColors.light.textOnPrimary,
  titleAccent: salahFirstColors.light.accent,
  bismillah: '#FFF5D6',
  tagline: '#BFE7D0',
  badge: salahFirstColors.light.secondary,
  buttonBg: salahFirstColors.light.accent,
  buttonPressed: '#DEB032',
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
    accentLight: '#FBE29D',
    accentMuted: '#E5C678',
    watermark: 'rgba(243, 196, 64, 0.12)',
    buttonGold: salahFirstColors.light.accent,
    buttonGoldPressed: '#DEB032',
    buttonGoldText: salahFirstColors.light.textOnAccent,
    bannerGreen: salahFirstColors.light.primaryHero,
    bannerGreenText: salahFirstColors.light.textOnPrimary,
    mintTint: salahFirstColors.light.secondaryTint,
    mintTintPressed: '#DAEFE3',
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
    accentLight: '#FCEAB2',
    accentMuted: salahFirstColors.dark.secondary,
    watermark: 'rgba(247, 207, 87, 0.10)',
    buttonGold: salahFirstColors.dark.accent,
    buttonGoldPressed: '#E5BE42',
    buttonGoldText: salahFirstColors.dark.textOnAccent,
    bannerGreen: salahFirstColors.dark.primaryHero,
    bannerGreenText: salahFirstColors.dark.textOnPrimary,
    mintTint: salahFirstColors.dark.secondaryTint,
    mintTintPressed: '#103B2C',
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
  brandTitle: { fontSize: 26, fontWeight: '800' as const, letterSpacing: -0.5 },
  timerDisplay: { fontSize: 30, fontWeight: '800' as const, letterSpacing: -0.8 },
  headerMotto: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 2.2 },
  arabicMotto: { fontSize: 17, fontWeight: '600' as const, lineHeight: 26, letterSpacing: 0 },
  ayahArabic: { fontSize: 19, fontWeight: '700' as const, lineHeight: 30, letterSpacing: 0 },
  titleLarge: { fontSize: 20, fontWeight: '800' as const, lineHeight: 26 },
  titleMedium: { fontSize: 16, fontWeight: '700' as const, lineHeight: 22 },
  titleSmall: { fontSize: 14, fontWeight: '600' as const, lineHeight: 19 },
  bodyLarge: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodyMedium: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  bodySmall: { fontSize: 11, fontWeight: '400' as const, lineHeight: 15 },
  caption: { fontSize: 11, fontWeight: '500' as const, lineHeight: 15 },
  pill: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 0.6 },
} as const;

export type Spacing = typeof SPACING;
export type Radius = typeof RADIUS;
