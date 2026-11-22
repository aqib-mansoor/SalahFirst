import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export interface PrayerTimeIconProps {
  prayer: string;
  size?: number;
  muted?: boolean;
  tintColor?: string;
}

export const PrayerTimeIcon: React.FC<PrayerTimeIconProps> = ({
  prayer,
  size = 20,
  muted = false,
  tintColor,
}) => {
  const theme = useTheme();
  const key = prayer.toLowerCase();

  const color = tintColor ?? (muted ? theme.colors.textMuted : theme.colors.primary);
  const opacity = muted ? 0.6 : 1;

  if (key.includes('fajr') || key.includes('subuh')) {
    // Fajr: Radiant Dawn Star with subtle atmospheric diamond glow
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Circle cx="12" cy="12" r="7" fill={color} opacity={0.12} />
        {/* Primary 4-point dawn star */}
        <Path
          d="M12 2C12.6 7 14.5 8.9 19.5 9.5C14.5 10.1 12.6 12 12 17C11.4 12 9.5 10.1 4.5 9.5C9.5 8.9 11.4 7 12 2Z"
          fill={color}
        />
        {/* Small morning sparkle */}
        <Path
          d="M18 15C18.3 17 19 17.7 21 18C19 18.3 18.3 19 18 21C17.7 19 17 18.3 15 18C17 17.7 17.7 17 18 15Z"
          fill={color}
          opacity={0.8}
        />
      </Svg>
    );
  }

  if (key.includes('dhuhr') || key.includes('dzuhur') || key.includes('jumu')) {
    // Dhuhr: Radiant Zenith Sun with clean geometric rays
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Circle cx="12" cy="12" r="8" fill={color} opacity={0.12} />
        <Circle cx="12" cy="12" r="4.5" fill={color} />
        <Path
          d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (key.includes('asr') || key.includes('ashar')) {
    // Asr: Afternoon Sun with dynamic angled rays
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Circle cx="10" cy="10" r="7" fill={color} opacity={0.12} />
        <Circle cx="10" cy="10" r="4.5" fill={color} />
        {/* Angled afternoon rays */}
        <Path
          d="M10 2.5v2M4.7 4.7l1.4 1.4M2.5 10h2M15.3 4.7l-1.4 1.4M4.7 15.3l1.4-1.4"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Horizon slope */}
        <Path
          d="M3 19.5h18M13 16h6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.65}
        />
      </Svg>
    );
  }

  if (key.includes('maghrib')) {
    // Maghrib: Serene Sunset dipping into peaceful horizon
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Circle cx="12" cy="13" r="6" fill={color} opacity={0.12} />
        {/* Semi-sun dipping below horizon */}
        <Path
          d="M6.5 14a5.5 5.5 0 0 1 11 0"
          fill={color}
        />
        <Path
          d="M12 4.5v2.5M6 7.5l1.6 1.6M18 7.5l-1.6 1.6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Clean dual horizon lines */}
        <Path
          d="M2.5 16h19M5 19.5h14"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  // Isha / Tahajjud (default): Sculpted Crescent Moon with evening star
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <Circle cx="11" cy="12" r="7" fill={color} opacity={0.12} />
      {/* Sleek Islamic Crescent Moon */}
      <Path
        d="M18.8 14.5A7.8 7.8 0 0 1 8.5 4.2A8 8 0 1 0 18.8 14.5Z"
        fill={color}
      />
      {/* Delicate celestial star */}
      <Circle cx="16.5" cy="6.5" r="1.3" fill={color} />
    </Svg>
  );
};
