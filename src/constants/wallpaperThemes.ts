/**
 * Centralized Wallpaper Theme Definitions
 */

export interface WallpaperTheme {
  id: string;
  name: string;
  backgroundColor: string;
  ambientBackground: string;
  cardBg: string;
  cardBorder: string;
  arabicColor: string;
  englishColor: string;
  sourceColor: string;
  watermarkColor: string;
  isDark: boolean;
}

export const WALLPAPER_THEMES: WallpaperTheme[] = [
  {
    id: 'emerald-sanctuary',
    name: 'Emerald Sanctuary',
    backgroundColor: '#0D3828',
    ambientBackground: '#051A12',
    cardBg: 'rgba(17, 75, 54, 0.65)',
    cardBorder: 'rgba(204, 161, 95, 0.4)',
    arabicColor: '#CCA15F',
    englishColor: '#FFFFFF',
    sourceColor: '#CCA15F',
    watermarkColor: 'rgba(204, 161, 95, 0.22)',
    isDark: true,
  },
  {
    id: 'warm-khorasan-cream',
    name: 'Warm Khorasan Cream',
    backgroundColor: '#F7F4EC',
    ambientBackground: '#26221A',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    cardBorder: 'rgba(17, 75, 54, 0.25)',
    arabicColor: '#114B36',
    englishColor: '#2C3A33',
    sourceColor: '#114B36',
    watermarkColor: 'rgba(17, 75, 54, 0.14)',
    isDark: false,
  },
  {
    id: 'midnight-qiyam',
    name: 'Midnight Qiyam',
    backgroundColor: '#0F1512',
    ambientBackground: '#060A08',
    cardBg: 'rgba(24, 32, 28, 0.75)',
    cardBorder: 'rgba(204, 161, 95, 0.45)',
    arabicColor: '#E8CA94',
    englishColor: '#E0E7E3',
    sourceColor: '#CCA15F',
    watermarkColor: 'rgba(204, 161, 95, 0.25)',
    isDark: true,
  },
  {
    id: 'andalusian-sage',
    name: 'Andalusian Sage',
    backgroundColor: '#274438',
    ambientBackground: '#10211A',
    cardBg: 'rgba(20, 48, 38, 0.7)',
    cardBorder: 'rgba(167, 198, 182, 0.4)',
    arabicColor: '#EAE6DF',
    englishColor: '#F0F6F2',
    sourceColor: '#CCA15F',
    watermarkColor: 'rgba(167, 198, 182, 0.22)',
    isDark: true,
  },
];
