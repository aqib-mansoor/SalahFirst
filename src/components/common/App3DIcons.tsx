import React from 'react';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';

export interface ThreeDIconProps {
  size?: number;
}

/**
 * 3D Glossy Fiery Flame Icon
 * Rendered with rich volumetric fire gradients, glowing yellow core, and specular shine.
 */
export const ThreeDFlameIcon: React.FC<ThreeDIconProps> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Defs>
      <LinearGradient id="flameBackGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FF4500" stopOpacity="0.4" />
        <Stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
      </LinearGradient>
      <LinearGradient id="flameOuter" x1="50%" y1="0%" x2="50%" y2="100%">
        <Stop offset="0%" stopColor="#FF3B30" />
        <Stop offset="45%" stopColor="#FF6B00" />
        <Stop offset="100%" stopColor="#FF9500" />
      </LinearGradient>
      <LinearGradient id="flameMid" x1="50%" y1="15%" x2="50%" y2="100%">
        <Stop offset="0%" stopColor="#FF9500" />
        <Stop offset="55%" stopColor="#FFCC00" />
        <Stop offset="100%" stopColor="#FFE066" />
      </LinearGradient>
      <LinearGradient id="flameCore" x1="30%" y1="0%" x2="70%" y2="100%">
        <Stop offset="0%" stopColor="#FFFFFF" />
        <Stop offset="45%" stopColor="#FFF9E6" />
        <Stop offset="100%" stopColor="#FFD60A" />
      </LinearGradient>
    </Defs>
    <Circle cx="16" cy="20" r="11" fill="url(#flameBackGlow)" />
    {/* Outer Flame Tongue */}
    <Path
      d="M16 2C16 2 25 10 25 19.5C25 24.5 21 29 16 29C11 29 7 24.5 7 19.5C7 11.5 13 8 16 2Z"
      fill="url(#flameOuter)"
    />
    {/* Middle Golden Flare */}
    <Path
      d="M16 8.5C16 8.5 22 14.5 22 20.5C22 24.5 19.2 27.5 16 27.5C12.8 27.5 10 24.5 10 20.5C10 14.5 14.5 12.5 16 8.5Z"
      fill="url(#flameMid)"
    />
    {/* Brilliant Radiant Core */}
    <Path
      d="M16 15C16 15 19.2 18.5 19.2 22C19.2 24.2 17.8 26 16 26C14.2 26 12.8 24.2 12.8 22C12.8 18.5 15.2 17 16 15Z"
      fill="url(#flameCore)"
    />
    {/* Glossy Specular Highlight */}
    <Ellipse cx="13" cy="18" rx="2" ry="4" transform="rotate(-18 13 18)" fill="#FFFFFF" opacity={0.4} />
  </Svg>
);

/**
 * 3D Lustrous Golden Trophy Icon
 * Volumetric golden bowl, specular reflection, and weighted pedestal.
 */
export const ThreeDTrophyIcon: React.FC<ThreeDIconProps> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Defs>
      <LinearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFF1B8" />
        <Stop offset="25%" stopColor="#F5C242" />
        <Stop offset="70%" stopColor="#D49A1A" />
        <Stop offset="100%" stopColor="#8C6107" />
      </LinearGradient>
      <LinearGradient id="trophyCupShade" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#FFDF70" />
        <Stop offset="100%" stopColor="#BA8311" />
      </LinearGradient>
      <LinearGradient id="trophyBase" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#3C2C0A" />
        <Stop offset="50%" stopColor="#8C6514" />
        <Stop offset="100%" stopColor="#3C2C0A" />
      </LinearGradient>
    </Defs>
    {/* Left Handle */}
    <Path
      d="M9 7H6C4.3 7 3 8.3 3 10V11C3 13.8 5.2 16 8 16H9V14H8C6.3 14 5 12.7 5 11V10C5 9.4 5.4 9 6 9H9V7Z"
      fill="url(#trophyGold)"
    />
    {/* Right Handle */}
    <Path
      d="M23 7H26C27.7 7 29 8.3 29 10V11C29 13.8 26.8 16 24 16H23V14H24C25.7 14 27 12.7 27 11V10C27 9.4 26.6 9 26 9H23V7Z"
      fill="url(#trophyGold)"
    />
    {/* Cup Bowl */}
    <Path
      d="M7 5H25V13C25 18 21 21 16 21C11 21 7 18 7 13V5Z"
      fill="url(#trophyCupShade)"
    />
    {/* Cup Rim Lip */}
    <Ellipse cx="16" cy="5" rx="9" ry="2" fill="url(#trophyGold)" />
    {/* Stem */}
    <Path d="M14 20H18V24H14V20Z" fill="url(#trophyGold)" />
    {/* Pedestal Base */}
    <Path d="M10 24H22L24 28H8L10 24Z" fill="url(#trophyBase)" />
    <Rect x="7" y="28" width="18" height="2.5" rx="1" fill="url(#trophyGold)" />
    {/* Specular Highlight */}
    <Path
      d="M10 7C10 7 12 15 14 17C12.5 16 11 13 11 9L10 7Z"
      fill="#FFFFFF"
      opacity={0.5}
    />
  </Svg>
);

/**
 * 3D Serene Islamic Mosque Icon
 * Features emerald dome, golden crescent finial, and polished marble minarets.
 */
export const ThreeDMosqueIcon: React.FC<ThreeDIconProps> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Defs>
      <LinearGradient id="mosqueDome" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#34D399" />
        <Stop offset="45%" stopColor="#10B981" />
        <Stop offset="100%" stopColor="#045638" />
      </LinearGradient>
      <LinearGradient id="mosqueGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFF1B8" />
        <Stop offset="70%" stopColor="#F5C242" />
        <Stop offset="100%" stopColor="#B37D08" />
      </LinearGradient>
      <LinearGradient id="mosqueMarble" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#E5E7EB" />
        <Stop offset="50%" stopColor="#F9FAFB" />
        <Stop offset="100%" stopColor="#D1D5DB" />
      </LinearGradient>
    </Defs>
    {/* Left Minaret */}
    <Path d="M5.5 6L7 11H4L5.5 6Z" fill="url(#mosqueGold)" />
    <Circle cx="5.5" cy="5" r="0.8" fill="url(#mosqueGold)" />

    {/* Right Minaret */}
    <Rect x="25" y="11" width="3" height="17" rx="0.8" fill="url(#mosqueMarble)" />
    <Path d="M26.5 6L28 11H25L26.5 6Z" fill="url(#mosqueGold)" />
    <Circle cx="26.5" cy="5" r="0.8" fill="url(#mosqueGold)" />

    {/* Central Structure */}
    <Rect x="7" y="17" width="18" height="11" fill="url(#mosqueMarble)" />
    <Path d="M13 28V22C13 20.3 14.3 19 16 19C17.7 19 19 20.3 19 22V28H13Z" fill="#063E28" />

    {/* Grand Central Dome */}
    <Path
      d="M16 7C16 7 23 11 23 17H9C9 11 16 7 16 7Z"
      fill="url(#mosqueDome)"
    />
    {/* Crescent Finial */}
    <Circle cx="16" cy="4.5" r="1.5" fill="url(#mosqueGold)" />
    <Circle cx="16.5" cy="4.2" r="1.2" fill="#0E7449" />

    {/* Base Trim */}
    <Rect x="3" y="27.5" width="26" height="2" rx="0.8" fill="url(#mosqueGold)" />
  </Svg>
);

/**
 * 3D Gleaming Gold Milestone Medal Icon
 * Radiant gold disc with cyan-blue ribbon and star emblem.
 */
export const ThreeDMedalIcon: React.FC<ThreeDIconProps> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Defs>
      <LinearGradient id="medalRibbonLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#38BDF8" />
        <Stop offset="100%" stopColor="#0284C7" />
      </LinearGradient>
      <LinearGradient id="medalRibbonRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#0284C7" />
        <Stop offset="100%" stopColor="#0369A1" />
      </LinearGradient>
      <LinearGradient id="medalGoldBody" x1="20%" y1="10%" x2="80%" y2="90%">
        <Stop offset="0%" stopColor="#FFF9E6" />
        <Stop offset="35%" stopColor="#FACC15" />
        <Stop offset="75%" stopColor="#D97706" />
        <Stop offset="100%" stopColor="#92400E" />
      </LinearGradient>
    </Defs>
    {/* Ribbon Wings */}
    <Path d="M11 2L7 15L13 14L16 8L11 2Z" fill="url(#medalRibbonLeft)" />
    <Path d="M21 2L25 15L19 14L16 8L21 2Z" fill="url(#medalRibbonRight)" />
    {/* Medal Outer Rim */}
    <Circle cx="16" cy="20" r="9" fill="url(#medalGoldBody)" />
    <Circle cx="16" cy="20" r="7.5" stroke="#FFF1B8" strokeWidth="1" fill="none" opacity={0.6} />
    {/* Star Crest */}
    <Path
      d="M16 14.5L17.5 18H21.2L18.2 20.2L19.3 23.7L16 21.6L12.7 23.7L13.8 20.2L10.8 18H14.5L16 14.5Z"
      fill="#FFFFFF"
      opacity={0.9}
    />
  </Svg>
);

/**
 * 3D Royal Gold Crown Icon
 * 3-peaked royal crown with emerald & ruby jewel gems.
 */
export const ThreeDCrownIcon: React.FC<ThreeDIconProps> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Defs>
      <LinearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFFBEB" />
        <Stop offset="30%" stopColor="#FBBF24" />
        <Stop offset="70%" stopColor="#D97706" />
        <Stop offset="100%" stopColor="#78350F" />
      </LinearGradient>
      <LinearGradient id="gemRuby" x1="20%" y1="10%" x2="80%" y2="90%">
        <Stop offset="0%" stopColor="#FDA4AF" />
        <Stop offset="60%" stopColor="#E11D48" />
        <Stop offset="100%" stopColor="#881337" />
      </LinearGradient>
      <LinearGradient id="gemEmerald" x1="20%" y1="10%" x2="80%" y2="90%">
        <Stop offset="0%" stopColor="#6EE7B7" />
        <Stop offset="60%" stopColor="#10B981" />
        <Stop offset="100%" stopColor="#064E3B" />
      </LinearGradient>
    </Defs>
    {/* Crown Base Band */}
    <Rect x="4" y="23" width="24" height="4" rx="1.5" fill="url(#crownGold)" />
    {/* Crown Body with 3 Distinct Peaks */}
    <Path
      d="M4 23L6 11L11.5 17L16 7L20.5 17L26 11L28 23H4Z"
      fill="url(#crownGold)"
    />
    {/* Peak Pearl Spheres */}
    <Circle cx="6" cy="11" r="2" fill="#FFFBEB" />
    <Circle cx="16" cy="7" r="2.4" fill="#FFFBEB" />
    <Circle cx="26" cy="11" r="2" fill="#FFFBEB" />

    {/* Jewel Inserts */}
    <Circle cx="16" cy="25" r="1.3" fill="url(#gemRuby)" />
    <Circle cx="10" cy="25" r="1.1" fill="url(#gemEmerald)" />
    <Circle cx="22" cy="25" r="1.1" fill="url(#gemEmerald)" />
  </Svg>
);

/**
 * 3D Lustrous Tasbih Prayer Beads Icon
 * Volumetric green & gold prayer beads with silk loop.
 */
export const ThreeDTasbihIcon: React.FC<ThreeDIconProps> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Defs>
      <LinearGradient id="beadGrad" x1="20%" y1="10%" x2="80%" y2="90%">
        <Stop offset="0%" stopColor="#A7F3D0" />
        <Stop offset="45%" stopColor="#10B981" />
        <Stop offset="85%" stopColor="#047857" />
        <Stop offset="100%" stopColor="#064E3B" />
      </LinearGradient>
      <LinearGradient id="tasselGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FDE68A" />
        <Stop offset="60%" stopColor="#D97706" />
        <Stop offset="100%" stopColor="#92400E" />
      </LinearGradient>
    </Defs>
    {/* Loop Beads */}
    <Circle cx="16" cy="6" r="2.4" fill="url(#beadGrad)" />
    <Circle cx="21" cy="8" r="2.4" fill="url(#beadGrad)" />
    <Circle cx="24" cy="12" r="2.4" fill="url(#beadGrad)" />
    <Circle cx="24" cy="17" r="2.4" fill="url(#beadGrad)" />
    <Circle cx="20" cy="21" r="2.4" fill="url(#beadGrad)" />
    <Circle cx="16" cy="22" r="2.6" fill="url(#tasselGold)" />
    <Circle cx="12" cy="21" r="2.4" fill="url(#beadGrad)" />
    <Circle cx="8" cy="17" r="2.4" fill="url(#beadGrad)" />
    <Circle cx="8" cy="12" r="2.4" fill="url(#beadGrad)" />
    <Circle cx="11" cy="8" r="2.4" fill="url(#beadGrad)" />
    {/* Tassel Minaret Finial */}
    <Path d="M16 23L18 29H14L16 23Z" fill="url(#tasselGold)" />
    <Circle cx="16" cy="29.5" r="1.2" fill="#D97706" />
  </Svg>
);
