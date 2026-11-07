/**
 * Centralized Design System & Theme Tokens
 * Easily change the app's color palette and visual tokens here.
 */

export const PALETTE = {
  // Emerald / Islamic Green brand tones
  emeraldDark: '#114B36',
  emeraldDeep: '#0D3828',
  emeraldSurface: '#0E3B2B',
  emeraldElevated: '#17573F',
  emeraldBorder: '#1F674A',
  emeraldWatermark: '#1F5E46',

  // Gold accents & metallics
  gold: '#CCA15F',
  goldLight: '#E8CA94',
  goldDark: '#B58E50',
  goldMuted: '#CBB28C',

  // Sage / mint tones
  sageLight: '#F0F6F2',
  sageMuted: '#A7C6B6',
  sageDim: '#749785',
  mintTint: '#E7EFEA',
  mintTintPressed: '#D7E5DC',
  privacyBg: '#EDF4F0',
  privacyText: '#365345',

  // Light / Setup warm ivory background & surfaces
  ivoryBg: '#F9F7F2',
  white: '#FFFFFF',
  cardBorder: '#EAE6DF',
  inputBg: '#F1EDE6',
  textDark: '#111827',
  textSlate: '#5A6760',
  textDim: '#8B9790',

  black: '#000000',
  transparent: 'transparent',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderGold: string;
  primary: string;
  primaryPressed: string;
  accent: string;
  accentLight: string;
  accentMuted: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverse: string;
  watermark: string;
  buttonGold: string;
  buttonGoldPressed: string;
  buttonGoldText: string;
  bannerGreen: string;
  bannerGreenText: string;
  mintTint: string;
  mintTintPressed: string;
  privacyBg: string;
  privacyText: string;
}

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
}

export const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: PALETTE.emeraldDark,
    surface: PALETTE.emeraldSurface,
    surfaceElevated: PALETTE.emeraldElevated,
    border: PALETTE.emeraldBorder,
    borderGold: PALETTE.gold,
    primary: PALETTE.gold,
    primaryPressed: PALETTE.goldDark,
    accent: PALETTE.gold,
    accentLight: PALETTE.goldLight,
    accentMuted: PALETTE.goldMuted,
    text: PALETTE.white,
    textMuted: PALETTE.sageMuted,
    textSubtle: PALETTE.sageDim,
    textInverse: PALETTE.emeraldDeep,
    watermark: PALETTE.emeraldWatermark,
    buttonGold: PALETTE.gold,
    buttonGoldPressed: PALETTE.goldDark,
    buttonGoldText: PALETTE.emeraldDeep,
    bannerGreen: PALETTE.emeraldDark,
    bannerGreenText: PALETTE.white,
    mintTint: PALETTE.mintTint,
    mintTintPressed: PALETTE.mintTintPressed,
    privacyBg: PALETTE.privacyBg,
    privacyText: PALETTE.privacyText,
  },
};

export const lightTheme: Theme = {
  isDark: false,
  colors: {
    ...darkTheme.colors,
    background: PALETTE.ivoryBg,
    surface: PALETTE.white,
    surfaceElevated: PALETTE.inputBg,
    border: PALETTE.cardBorder,
    primary: PALETTE.emeraldDark,
    primaryPressed: PALETTE.emeraldDeep,
    text: PALETTE.textDark,
    textMuted: PALETTE.textSlate,
    textSubtle: PALETTE.textDim,
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
  huge: 48,
} as const;

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  brandTitle: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.5 },
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
