import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { PRAYER_ICON_PALETTE } from '@/constants/theme';

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
}) => {
  const key = prayer.toLowerCase();
  const opacity = muted ? 0.58 : 1;

  if (key.includes('fajr') || key.includes('subuh')) {
    // Fajr: 3D-style dawn sparkles cluster (large top-left, medium right, small bottom dot)
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <RadialGradient id="fajrStarGrad" cx="50%" cy="45%" r="55%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.starLight} />
            <Stop offset="65%" stopColor={PRAYER_ICON_PALETTE.starMid} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.starEdge} />
          </RadialGradient>
        </Defs>
        {/* Main top-left 4-point star */}
        <Path
          d="M9 2.5C9.4 6.1 10.9 7.6 14.5 8C10.9 8.4 9.4 9.9 9 13.5C8.6 9.9 7.1 8.4 3.5 8C7.1 7.6 8.6 6.1 9 2.5Z"
          fill="url(#fajrStarGrad)"
          stroke={PRAYER_ICON_PALETTE.starEdge}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* Secondary right 4-point star */}
        <Path
          d="M17.5 8C17.8 10.3 18.7 11.2 21 11.5C18.7 11.8 17.8 12.7 17.5 15C17.2 12.7 16.3 11.8 14 11.5C16.3 11.2 17.2 10.3 17.5 8Z"
          fill="url(#fajrStarGrad)"
          stroke={PRAYER_ICON_PALETTE.starEdge}
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        {/* Bottom-center small dawn diamond/star */}
        <Path
          d="M12.5 15.8C12.7 17.2 13.3 17.8 14.7 18C13.3 18.2 12.7 18.8 12.5 20.2C12.3 18.8 11.7 18.2 10.3 18C11.7 17.8 12.3 17.2 12.5 15.8Z"
          fill={PRAYER_ICON_PALETTE.starBlue}
        />
      </Svg>
    );
  }

  if (key.includes('dhuhr') || key.includes('dzuhur') || key.includes('jumu')) {
    // Dhuhr: Radiant 3D golden midday sun with warm rays
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <RadialGradient id="dhuhrSunGrad" cx="42%" cy="38%" r="58%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.sunCore} />
            <Stop offset="65%" stopColor={PRAYER_ICON_PALETTE.sunMid} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.sunDeep} />
          </RadialGradient>
        </Defs>
        {/* Outer soft glow */}
        <Circle cx="12" cy="12" r="8.2" fill={PRAYER_ICON_PALETTE.sunMid} opacity={0.22} />
        {/* Sun rays */}
        <Path
          d="M12 2.2V4.3M12 19.7V21.8M5.1 5.1L6.6 6.6M17.4 17.4L18.9 18.9M2.2 12H4.3M19.7 12H21.8M5.1 18.9L6.6 17.4M17.4 6.6L18.9 5.1"
          stroke={PRAYER_ICON_PALETTE.sunDeep}
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        {/* Core 3D sphere */}
        <Circle
          cx="12"
          cy="12"
          r="6.2"
          fill="url(#dhuhrSunGrad)"
          stroke={PRAYER_ICON_PALETTE.sunDeep}
          strokeWidth="0.7"
        />
      </Svg>
    );
  }

  if (key.includes('asr') || key.includes('ashar')) {
    // Asr: Golden sun peeking top-left behind a soft 3D sky-blue cloud
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <RadialGradient id="asrSunGrad" cx="40%" cy="40%" r="60%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.sunCore} />
            <Stop offset="70%" stopColor={PRAYER_ICON_PALETTE.sunMid} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.sunDeep} />
          </RadialGradient>
          <LinearGradient id="asrCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.cloudTop} />
            <Stop offset="62%" stopColor={PRAYER_ICON_PALETTE.cloudMid} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.cloudBase} />
          </LinearGradient>
        </Defs>
        {/* Top-left warm sun */}
        <Circle
          cx="8.5"
          cy="8.5"
          r="4.6"
          fill="url(#asrSunGrad)"
          stroke={PRAYER_ICON_PALETTE.sunDeep}
          strokeWidth="0.6"
        />
        {/* Foreground puffy cloud */}
        <Path
          d="M17.6 19.5H8.2C5.9 19.5 4 17.8 4 15.6C4 13.6 5.5 12 7.5 11.8C8.3 9.7 10.3 8.3 12.7 8.3C15.7 8.3 18.2 10.6 18.4 13.5C20.1 13.8 21.5 15.2 21.5 17C21.5 18.5 19.8 19.5 17.6 19.5Z"
          fill="url(#asrCloudGrad)"
          stroke={PRAYER_ICON_PALETTE.cloudStroke}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (key.includes('maghrib')) {
    // Maghrib: Warm orange-gold sunset dipping behind twilight & green hills
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <LinearGradient id="maghribSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.sunsetSunTop} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.sunsetSunBottom} />
          </LinearGradient>
          <LinearGradient id="maghribBackHill" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.hillBackTop} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.hillBackBottom} />
          </LinearGradient>
          <LinearGradient id="maghribFrontHill" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.hillFrontLeft} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.hillFrontRight} />
          </LinearGradient>
        </Defs>
        {/* Warm setting sun */}
        <Circle cx="10" cy="10.2" r="5" fill="url(#maghribSunGrad)" />
        {/* Back twilight hill (right) */}
        <Path
          d="M9.5 19.5C11.8 14.2 15.2 11.8 18.2 11.8C20.1 11.8 21.4 13.8 22 19.5H9.5Z"
          fill="url(#maghribBackHill)"
        />
        {/* Front green hill (left-to-center) */}
        <Path
          d="M2.2 19.5C4.2 14.5 7.4 13.2 10.6 13.8C13.6 14.4 16.2 16.8 18.8 19.5H2.2Z"
          fill="url(#maghribFrontHill)"
        />
      </Svg>
    );
  }

  // Isha (default): Luminous 3D silver-pearl crescent moon
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <Defs>
        <LinearGradient id="ishaMoonGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.moonLight} />
          <Stop offset="60%" stopColor={PRAYER_ICON_PALETTE.moonMid} />
          <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.moonShadow} />
        </LinearGradient>
      </Defs>
      <Path
        d="M19.8 14.9A8.2 8.2 0 0 1 9.1 4.2a8.3 8.3 0 1 0 10.7 10.7Z"
        fill="url(#ishaMoonGrad)"
        stroke={PRAYER_ICON_PALETTE.moonShadow}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
