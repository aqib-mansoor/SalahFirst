import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export interface PrayerTimeIconProps {
  prayer: string;
  size?: number;
  muted?: boolean;
  tintColor?: string;
}

export const PrayerTimeIcon: React.FC<PrayerTimeIconProps> = ({
  prayer,
  size = 18,
  muted = false,
  tintColor,
}) => {
  const theme = useTheme();
  const key = prayer.toLowerCase();

  const sunFill = tintColor || theme.colors.accent;
  const sunStroke = tintColor || theme.colors.warning;
  const primaryTone = tintColor || theme.colors.primary;
  const secondaryTone = tintColor || theme.colors.secondary;
  const moonFill = tintColor || theme.colors.accentLight;
  const opacity = muted ? 0.55 : 1;

  if (key === 'fajr') {
    // Dawn stars cluster (matching Fajr morning stars)
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Path
          d="M9.5 3.5L11 7.5L15 9L11 10.5L9.5 14.5L8 10.5L4 9L8 7.5L9.5 3.5Z"
          fill={sunFill}
          stroke={sunStroke}
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <Path
          d="M17.5 8.5L18.4 11L21 11.9L18.4 12.8L17.5 15.3L16.6 12.8L14 11.9L16.6 11L17.5 8.5Z"
          fill={moonFill}
          stroke={sunFill}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        <Circle cx="12.5" cy="18.5" r="1.6" fill={secondaryTone} />
      </Svg>
    );
  }

  if (key === 'dhuhr') {
    // Full radiant midday sun
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Circle cx="12" cy="12" r="5.2" fill={sunFill} stroke={sunStroke} strokeWidth="1.2" />
        <Path
          d="M12 2.5V5M12 19V21.5M4.9 4.9L6.7 6.7M17.3 17.3L19.1 19.1M2.5 12H5M19 12H21.5M4.9 19.1L6.7 17.3M17.3 6.7L19.1 4.9"
          stroke={sunStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (key === 'asr') {
    // Afternoon sun with cloud
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Circle cx="9" cy="9" r="4" fill={sunFill} stroke={sunStroke} strokeWidth="1" />
        <Path
          d="M9 2.5V4M4.4 4.4L5.5 5.5M2.5 9H4M13.6 4.4L12.5 5.5"
          stroke={sunStroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M17.5 19H8.5C6.3 19 4.5 17.3 4.5 15.2C4.5 13.3 5.9 11.7 7.8 11.5C8.5 9.5 10.4 8.2 12.6 8.2C15.5 8.2 17.8 10.4 18 13.2C19.7 13.5 21 14.9 21 16.6C21 18 19.5 19 17.5 19Z"
          fill={secondaryTone}
          stroke={primaryTone}
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (key === 'maghrib') {
    // Sunset dipping over horizon slope
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Circle cx="10.5" cy="10.5" r="4.2" fill={sunFill} stroke={sunStroke} strokeWidth="1.2" />
        <Path
          d="M3 18.5C5.5 14.5 9.5 14 13.5 16.5C16 18 18.8 18.5 21 18.5H3Z"
          fill={primaryTone}
        />
        <Path
          d="M3 18.5C6 15.2 10 15.2 14.5 18.5"
          stroke={secondaryTone}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <Path
          d="M4 20.5H20"
          stroke={primaryTone}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  // Isha (default): Crescent moon
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <Path
        d="M20.2 14.8A8.2 8.2 0 0 1 9.2 3.8a8.2 8.2 0 1 0 11 11Z"
        fill={moonFill}
        stroke={sunFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="17.5" cy="6.5" r="1.2" fill={sunFill} />
    </Svg>
  );
};
