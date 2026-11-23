import React from 'react';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
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
  tintColor,
}) => {
  const key = prayer.toLowerCase();
  const opacity = muted ? 0.5 : 1;

  if (key.includes('fajr') || key.includes('subuh')) {
    // Fajr: Authentic 3D Dawn Horizon (Al-Fajr As-Sadiq) with rising golden solar crest
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <LinearGradient id="fajrSkyAura" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor={tintColor || '#F7CF57'} stopOpacity="0.45" />
            <Stop offset="65%" stopColor={tintColor || '#10B981'} stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#042F1F" stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="fajrDawnSun" x1="20%" y1="10%" x2="80%" y2="90%">
            <Stop offset="0%" stopColor="#FFFBEB" />
            <Stop offset="30%" stopColor={tintColor || '#FDE68A'} />
            <Stop offset="70%" stopColor={tintColor || '#F59E0B'} />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>
          <LinearGradient id="fajrHorizonLine" x1="0%" y1="50%" x2="100%" y2="50%">
            <Stop offset="0%" stopColor={tintColor || '#F7CF57'} stopOpacity="0.2" />
            <Stop offset="50%" stopColor={tintColor || '#F7CF57'} stopOpacity="0.95" />
            <Stop offset="100%" stopColor={tintColor || '#F7CF57'} stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* Ambient Dawn Glow */}
        <Circle cx="12" cy="14" r="9" fill="url(#fajrSkyAura)" />

        {/* Dawn Beams */}
        <Path d="M12 3v3M6.5 6.5l2.2 2.2M17.5 6.5l-2.2 2.2M3 14h3M18 14h3" stroke={tintColor || '#FDE68A'} strokeWidth="1.6" strokeLinecap="round" opacity={0.85} />

        {/* Rising Solar Crest (Semi-Circle above Horizon) */}
        <Path
          d="M 6.8,14.5 A 5.5,5.5 0 0,1 17.2,14.5 Z"
          fill="url(#fajrDawnSun)"
        />

        {/* Specular Inner Dawn Rim */}
        <Path
          d="M 8.2,14.5 A 4,4 0 0,1 15.8,14.5"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity={0.65}
          fill="none"
        />

        {/* Sleek Golden Horizon Filament */}
        <Path
          d="M 2 15.2 Q 12 14.8 22 15.2"
          stroke="url(#fajrHorizonLine)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (key.includes('dhuhr') || key.includes('dzuhur') || key.includes('jumu')) {
    // Dhuhr: Volumetric golden sun with corona & tapered rays
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <LinearGradient id="dhuhrCorona" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunMid} stopOpacity="0.55" />
            <Stop offset="70%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunRay} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunDeep} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="dhuhrSphere" x1="20%" y1="10%" x2="80%" y2="90%">
            <Stop offset="0%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunSpecular} />
            <Stop offset="28%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunCore} />
            <Stop offset="72%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunMid} />
            <Stop offset="100%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunDeep} />
          </LinearGradient>
        </Defs>
        <Circle cx="12" cy="12" r="10.8" fill="url(#dhuhrCorona)" />
        <Path
          d="M12 1.4L13.3 4.6L16.5 2.4L15.9 5.9L19.9 5.3L17.7 8.5L21.6 9.8L18.2 11.8L21.6 14.2L17.7 15.5L19.9 18.7L15.9 18.1L16.5 21.6L13.3 19.4L12 22.6L10.7 19.4L7.5 21.6L8.1 18.1L4.1 18.7L6.3 15.5L2.4 14.2L5.8 11.8L2.4 9.8L6.3 8.5L4.1 5.3L8.1 5.9L7.5 2.4L10.7 4.6L12 1.4Z"
          fill={tintColor || PRAYER_ICON_PALETTE.sunRay}
          opacity={0.85}
        />
        <Circle cx="12" cy="12" r="6.8" fill="url(#dhuhrSphere)" />
        <Ellipse
          cx="10.1"
          cy="9.6"
          rx="2.6"
          ry="1.6"
          transform="rotate(-28 10.1 9.6)"
          fill={tintColor || PRAYER_ICON_PALETTE.sunSpecular}
          opacity={0.45}
        />
      </Svg>
    );
  }

  if (key.includes('asr') || key.includes('ashar')) {
    // Asr: Afternoon golden sun behind soft clouds
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <LinearGradient id="asrSunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunCore} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunDeep} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="asrSunBody" x1="20%" y1="10%" x2="80%" y2="90%">
            <Stop offset="0%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunSpecular} />
            <Stop offset="35%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunCore} />
            <Stop offset="80%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunMid} />
            <Stop offset="100%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunDeep} />
          </LinearGradient>
          <LinearGradient id="asrCloudBody" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor={PRAYER_ICON_PALETTE.cloudTop} />
            <Stop offset="58%" stopColor={PRAYER_ICON_PALETTE.cloudMid} />
            <Stop offset="88%" stopColor={PRAYER_ICON_PALETTE.cloudBase} />
            <Stop offset="100%" stopColor={PRAYER_ICON_PALETTE.cloudShadow} />
          </LinearGradient>
        </Defs>
        <Circle cx="8.2" cy="8.4" r="6.8" fill="url(#asrSunGlow)" />
        <Circle cx="8.2" cy="8.4" r="4.9" fill="url(#asrSunBody)" />
        <Path
          d="M17.8 19.6H7.9C5.5 19.6 3.6 17.8 3.6 15.5C3.6 13.4 5.1 11.7 7.1 11.5C8 9.3 10.1 7.9 12.6 7.9C15.8 7.9 18.4 10.3 18.6 13.4C20.4 13.7 21.8 15.1 21.8 16.9C21.8 18.5 20.1 19.6 17.8 19.6Z"
          fill="url(#asrCloudBody)"
        />
        <Circle cx="12.6" cy="12.4" r="4.1" fill={PRAYER_ICON_PALETTE.cloudTop} opacity={0.6} />
        <Circle cx="8.1" cy="15.1" r="3.2" fill={PRAYER_ICON_PALETTE.cloudTop} opacity={0.5} />
      </Svg>
    );
  }

  if (key.includes('maghrib')) {
    // Maghrib: Sunset with glowing sun & faceted mountain peaks
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
        <Defs>
          <LinearGradient id="maghribSkyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunsetGlow} stopOpacity="0.45" />
            <Stop offset="100%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunsetGlow} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="maghribSun" x1="35%" y1="15%" x2="65%" y2="95%">
            <Stop offset="0%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunsetSunTop} />
            <Stop offset="55%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunsetSunMid} />
            <Stop offset="100%" stopColor={tintColor || PRAYER_ICON_PALETTE.sunsetSunBottom} />
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
        <Circle cx="10.2" cy="11.2" r="8.5" fill="url(#maghribSkyGlow)" />
        <Circle cx="10" cy="10.5" r="5.1" fill="url(#maghribSun)" />
        <Path
          d="M8.8 19.6L14.9 10.8C15.5 9.9 16.7 9.9 17.3 10.8L22.2 19.6H8.8Z"
          fill="url(#maghribBackMtn)"
        />
        <Path
          d="M1.8 19.6L7.6 12C8.3 11.1 9.5 11.1 10.2 12L17.4 19.6H1.8Z"
          fill="url(#maghribFrontMtn)"
        />
      </Svg>
    );
  }

  // Isha / Tahajjud (default): Centered 3D celestial crescent moon
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <Defs>
        <LinearGradient id="ishaMoonBody" x1="15%" y1="10%" x2="85%" y2="90%">
          <Stop offset="0%" stopColor={tintColor || '#FFFBEB'} />
          <Stop offset="35%" stopColor={tintColor || '#F7CF57'} />
          <Stop offset="75%" stopColor={tintColor || '#D4A429'} />
          <Stop offset="100%" stopColor={tintColor || '#8C6107'} />
        </LinearGradient>
      </Defs>
      {/* Centered Celestial Crescent */}
      <Path
        d="M 14.5,2.5 C 9.25,2.5 5,6.75 5,12 C 5,17.25 9.25,21.5 14.5,21.5 C 17.3,21.5 19.8,20.3 21.5,18.4 C 16,18 11.7,13.5 11.7,8 C 11.7,5.8 12.5,3.8 13.9,2.2 C 14.1,2.4 14.3,2.5 14.5,2.5 Z"
        fill="url(#ishaMoonBody)"
      />
      {/* Specular Edge Gleam */}
      <Path
        d="M 14.5,2.5 C 9.25,2.5 5,6.75 5,12 C 5,17.25 9.25,21.5 14.5,21.5"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeOpacity={0.65}
        fill="none"
      />
    </Svg>
  );
};
