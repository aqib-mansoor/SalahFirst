import React from 'react';
import Svg, { Path, Circle, Ellipse, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { PRAYER_ICON_PALETTE } from '@/constants/theme';

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
}) => {
  const key = prayer.toLowerCase();
  const opacity = muted ? 0.55 : 1;

  if (key.includes('fajr') || key.includes('subuh')) {
    // Fajr: Realistic 3D glossy sparkles cluster (no flat cartoon outlines)
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <RadialGradient id="fajrGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.starGlow} stopOpacity="0.45" />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.starGlow} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="fajrMainStar" cx="45%" cy="42%" r="58%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.starLight} />
            <Stop offset="45%" stopColor={PRAYER_ICON_PALETTE.starMid} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.starEdge} />
          </RadialGradient>
          <RadialGradient id="fajrBlueStar" cx="45%" cy="45%" r="55%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.starLight} />
            <Stop offset="55%" stopColor={PRAYER_ICON_PALETTE.starBlueLight} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.starBlue} />
          </RadialGradient>
        </Defs>
        {/* Soft ambient glow behind main star */}
        <Circle cx="9" cy="8.5" r="7" fill="url(#fajrGlow)" />
        {/* Main top-left 3D 4-point star */}
        <Path
          d="M9 1.8C9.45 5.9 11.1 7.55 15.2 8C11.1 8.45 9.45 10.1 9 14.2C8.55 10.1 6.9 8.45 2.8 8C6.9 7.55 8.55 5.9 9 1.8Z"
          fill="url(#fajrMainStar)"
        />
        {/* Specular highlight center on main star */}
        <Circle cx="8.8" cy="7.8" r="1.5" fill={PRAYER_ICON_PALETTE.starLight} opacity={0.9} />
        {/* Secondary right 3D 4-point star */}
        <Path
          d="M17.8 7.5C18.1 10.1 19.1 11.1 21.7 11.4C19.1 11.7 18.1 12.7 17.8 15.3C17.5 12.7 16.5 11.7 13.9 11.4C16.5 11.1 17.5 10.1 17.8 7.5Z"
          fill="url(#fajrMainStar)"
        />
        <Circle cx="17.7" cy="11.3" r="0.9" fill={PRAYER_ICON_PALETTE.starLight} opacity={0.85} />
        {/* Bottom-center small dawn star */}
        <Path
          d="M12.2 15.4C12.45 17.3 13.2 18.05 15.1 18.3C13.2 18.55 12.45 19.3 12.2 21.2C11.95 19.3 11.2 18.55 9.3 18.3C11.2 18.05 11.95 17.3 12.2 15.4Z"
          fill="url(#fajrBlueStar)"
        />
      </Svg>
    );
  }

  if (key.includes('dhuhr') || key.includes('dzuhur') || key.includes('jumu')) {
    // Dhuhr: Realistic 3D volumetric golden sun with corona & tapered rays
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <RadialGradient id="dhuhrCorona" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.sunMid} stopOpacity="0.55" />
            <Stop offset="70%" stopColor={PRAYER_ICON_PALETTE.sunRay} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.sunDeep} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="dhuhrSphere" cx="36%" cy="32%" r="65%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.sunSpecular} />
            <Stop offset="28%" stopColor={PRAYER_ICON_PALETTE.sunCore} />
            <Stop offset="72%" stopColor={PRAYER_ICON_PALETTE.sunMid} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.sunDeep} />
          </RadialGradient>
        </Defs>
        {/* Soft outer solar corona */}
        <Circle cx="12" cy="12" r="10.8" fill="url(#dhuhrCorona)" />
        {/* Sculpted sunburst rays */}
        <Path
          d="M12 1.4L13.3 4.6L16.5 2.4L15.9 5.9L19.9 5.3L17.7 8.5L21.6 9.8L18.2 11.8L21.6 14.2L17.7 15.5L19.9 18.7L15.9 18.1L16.5 21.6L13.3 19.4L12 22.6L10.7 19.4L7.5 21.6L8.1 18.1L4.1 18.7L6.3 15.5L2.4 14.2L5.8 11.8L2.4 9.8L6.3 8.5L4.1 5.3L8.1 5.9L7.5 2.4L10.7 4.6L12 1.4Z"
          fill={PRAYER_ICON_PALETTE.sunRay}
          opacity={0.85}
        />
        {/* 3D Spherical Sun Core */}
        <Circle cx="12" cy="12" r="6.8" fill="url(#dhuhrSphere)" />
        {/* Top-left glossy 3D specular reflection */}
        <Ellipse
          cx="10.1"
          cy="9.6"
          rx="2.6"
          ry="1.6"
          transform="rotate(-28 10.1 9.6)"
          fill={PRAYER_ICON_PALETTE.sunSpecular}
          opacity={0.45}
        />
      </Svg>
    );
  }

  if (key.includes('asr') || key.includes('ashar')) {
    // Asr: Realistic 3D golden sun behind a multi-puff volumetric 3D cloud
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <RadialGradient id="asrSunGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.sunMid} stopOpacity="0.45" />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.sunMid} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="asrSunBody" cx="38%" cy="35%" r="62%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.sunSpecular} />
            <Stop offset="35%" stopColor={PRAYER_ICON_PALETTE.sunCore} />
            <Stop offset="75%" stopColor={PRAYER_ICON_PALETTE.sunMid} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.sunDeep} />
          </RadialGradient>
          <LinearGradient id="asrCloudBody" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.cloudTop} />
            <Stop offset="58%" stopColor={PRAYER_ICON_PALETTE.cloudMid} />
            <Stop offset="88%" stopColor={PRAYER_ICON_PALETTE.cloudBase} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.cloudShadow} />
          </LinearGradient>
          <RadialGradient id="asrCloudPuff" cx="42%" cy="35%" r="58%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.cloudTop} stopOpacity="0.95" />
            <Stop offset="70%" stopColor={PRAYER_ICON_PALETTE.cloudMid} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.cloudBase} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {/* Sun outer glow */}
        <Circle cx="8.2" cy="8.4" r="6.8" fill="url(#asrSunGlow)" />
        {/* 3D Sun sphere */}
        <Circle cx="8.2" cy="8.4" r="4.9" fill="url(#asrSunBody)" />
        {/* Volumetric 3D cloud base silhouette (no cartoon stroke) */}
        <Path
          d="M17.8 19.6H7.9C5.5 19.6 3.6 17.8 3.6 15.5C3.6 13.4 5.1 11.7 7.1 11.5C8 9.3 10.1 7.9 12.6 7.9C15.8 7.9 18.4 10.3 18.6 13.4C20.4 13.7 21.8 15.1 21.8 16.9C21.8 18.5 20.1 19.6 17.8 19.6Z"
          fill="url(#asrCloudBody)"
        />
        {/* 3D Spherical puff highlights for realistic cloud depth */}
        <Circle cx="12.6" cy="12.4" r="4.1" fill="url(#asrCloudPuff)" />
        <Circle cx="8.1" cy="15.1" r="3.2" fill="url(#asrCloudPuff)" />
        <Circle cx="17.2" cy="15.8" r="2.8" fill="url(#asrCloudPuff)" />
      </Svg>
    );
  }

  if (key.includes('maghrib')) {
    // Maghrib: Realistic 3D sunset with glowing sun & faceted mountain peaks
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <RadialGradient id="maghribSkyGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.sunsetGlow} stopOpacity="0.45" />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.sunsetGlow} stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="maghribSun" x1="35%" y1="15%" x2="65%" y2="95%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.sunsetSunTop} />
            <Stop offset="55%" stopColor={PRAYER_ICON_PALETTE.sunsetSunMid} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.sunsetSunBottom} />
          </LinearGradient>
          <LinearGradient id="maghribBackMtn" x1="20%" y1="0%" x2="85%" y2="100%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.mountainBackLit} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.mountainBackDark} />
          </LinearGradient>
          <LinearGradient id="maghribFrontMtn" x1="15%" y1="10%" x2="85%" y2="95%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.mountainFrontLit} />
            <Stop offset="48%" stopColor={PRAYER_ICON_PALETTE.mountainFrontMid} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.mountainFrontDark} />
          </LinearGradient>
        </Defs>
        {/* Warm horizon glow */}
        <Circle cx="10.2" cy="11.2" r="8.5" fill="url(#maghribSkyGlow)" />
        {/* 3D Setting Sun */}
        <Circle cx="10" cy="10.5" r="5.1" fill="url(#maghribSun)" />
        {/* Distant twilight mountain range (right) */}
        <Path
          d="M8.8 19.6L14.9 10.8C15.5 9.9 16.7 9.9 17.3 10.8L22.2 19.6H8.8Z"
          fill="url(#maghribBackMtn)"
        />
        {/* Foreground lush sunset-lit mountain slope (left-to-center) */}
        <Path
          d="M1.8 19.6L7.6 12C8.3 11.1 9.5 11.1 10.2 12L17.4 19.6H1.8Z"
          fill="url(#maghribFrontMtn)"
        />
      </Svg>
    );
  }

  // Isha (default): Realistic 3D sculpted crescent moon with craters & spherical shading
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <Defs>
        <RadialGradient id="ishaMoonBody" cx="30%" cy="25%" r="75%">
          <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.moonSpecular} />
          <Stop offset="38%" stopColor={PRAYER_ICON_PALETTE.moonLight} />
          <Stop offset="74%" stopColor={PRAYER_ICON_PALETTE.moonMid} />
          <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.moonShadow} />
        </RadialGradient>
      </Defs>
      {/* Sculpted 3D crescent moon body */}
      <Path
        d="M20.1 14.8A8.4 8.4 0 0 1 9.2 3.9a8.5 8.5 0 1 0 10.9 10.9Z"
        fill="url(#ishaMoonBody)"
      />
      {/* Subtle 3D lunar surface craters */}
      <Circle cx="9.2" cy="14.2" r="1.4" fill={PRAYER_ICON_PALETTE.moonCrater} opacity={0.28} />
      <Circle cx="12.8" cy="17.2" r="1.0" fill={PRAYER_ICON_PALETTE.moonCrater} opacity={0.24} />
      <Circle cx="7.3" cy="10.4" r="0.85" fill={PRAYER_ICON_PALETTE.moonCrater} opacity={0.22} />
    </Svg>
  );
};
