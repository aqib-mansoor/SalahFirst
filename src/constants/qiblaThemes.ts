/**
 * Centralized Qibla Compass Dial Visual Themes
 * Provides 4 selectable compass skins matching the Qibla style dock.
 */

export type QiblaDialStyleId = 'classic' | 'emerald' | 'rose' | 'obsidian';

export interface QiblaDialThemeSpec {
  id: QiblaDialStyleId;
  label: string;
  dialBg: string;
  dialBorder: string;
  innerRing: string;
  tickMajor: string;
  tickMinor: string;
  northTick: string;
  cardinalText: string;
  northText: string;
  needleNorthLeft: string;
  needleNorthRight: string;
  needleSouthLeft: string;
  needleSouthRight: string;
  hubBg: string;
  hubBorder: string;
  haloGlow: string;
  mapAccent: string;
}

export const QIBLA_DIAL_THEMES: Record<QiblaDialStyleId, QiblaDialThemeSpec> = {
  classic: {
    id: 'classic',
    label: 'Classic Mint',
    dialBg: '#FFFFFF',
    dialBorder: '#A7F3D0',
    innerRing: '#E2E8F0',
    tickMajor: '#0F172A',
    tickMinor: '#64748B',
    northTick: '#EF4444',
    cardinalText: '#475569',
    northText: '#EF4444',
    needleNorthLeft: '#10B981',
    needleNorthRight: '#059669',
    needleSouthLeft: '#6EE7B7',
    needleSouthRight: '#34D399',
    hubBg: '#FFFFFF',
    hubBorder: '#059669',
    haloGlow: 'rgba(16, 185, 129, 0.24)',
    mapAccent: '#10B981',
  },
  emerald: {
    id: 'emerald',
    label: 'Kaaba Orbit',
    dialBg: '#065F46',
    dialBorder: '#34D399',
    innerRing: 'rgba(255, 255, 255, 0.16)',
    tickMajor: '#FFFFFF',
    tickMinor: 'rgba(255, 255, 255, 0.55)',
    northTick: '#FBBF24',
    cardinalText: 'rgba(255, 255, 255, 0.88)',
    northText: '#FBBF24',
    needleNorthLeft: '#FFFFFF',
    needleNorthRight: '#D1FAE5',
    needleSouthLeft: 'rgba(255, 255, 255, 0.38)',
    needleSouthRight: 'rgba(255, 255, 255, 0.22)',
    hubBg: '#064E3B',
    hubBorder: '#FBBF24',
    haloGlow: 'rgba(52, 211, 153, 0.28)',
    mapAccent: '#34D399',
  },
  rose: {
    id: 'rose',
    label: 'Astrolabe Rose',
    dialBg: '#FAF8F5',
    dialBorder: '#D6D3D1',
    innerRing: '#E7E5E4',
    tickMajor: '#292524',
    tickMinor: '#78716C',
    northTick: '#DC2626',
    cardinalText: '#44403C',
    northText: '#DC2626',
    needleNorthLeft: '#EF4444',
    needleNorthRight: '#B91C1C',
    needleSouthLeft: '#94A3B8',
    needleSouthRight: '#475569',
    hubBg: '#FAF8F5',
    hubBorder: '#B91C1C',
    haloGlow: 'rgba(220, 38, 38, 0.18)',
    mapAccent: '#EF4444',
  },
  obsidian: {
    id: 'obsidian',
    label: 'Kiswah Gold',
    dialBg: '#141716',
    dialBorder: '#F3C440',
    innerRing: 'rgba(243, 196, 64, 0.24)',
    tickMajor: '#F3C440',
    tickMinor: 'rgba(243, 196, 64, 0.48)',
    northTick: '#FFF5D6',
    cardinalText: '#E5C678',
    northText: '#FFFFFF',
    needleNorthLeft: '#FDE047',
    needleNorthRight: '#D97706',
    needleSouthLeft: '#57534E',
    needleSouthRight: '#292524',
    hubBg: '#141716',
    hubBorder: '#F3C440',
    haloGlow: 'rgba(243, 196, 64, 0.28)',
    mapAccent: '#F3C440',
  },
} as const;

export const QIBLA_DIAL_STYLE_LIST: QiblaDialThemeSpec[] = [
  QIBLA_DIAL_THEMES.emerald,
  QIBLA_DIAL_THEMES.rose,
  QIBLA_DIAL_THEMES.classic,
  QIBLA_DIAL_THEMES.obsidian,
];

