import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { HomeTab } from './HomeBottomNav';

export interface IslamicNavIconProps {
  tabId: HomeTab;
  isActive: boolean;
  size?: number;
  customColor?: string;
}

export const IslamicNavIcon: React.FC<IslamicNavIconProps> = ({
  tabId,
  isActive,
  size = 22,
  customColor,
}) => {
  const theme = useTheme();
  const strokeColor = customColor ?? (isActive ? theme.colors.textOnPrimary : theme.colors.textSecondary);

  switch (tabId) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Modern Minimalist House with Pointed Islamic Mihrab Arch */}
          <Path
            d="M3 10.5L12 3L21 10.5V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V10.5Z"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9.5 21V15C9.5 13.8 10.6 12.5 12 12.5C13.4 12.5 14.5 13.8 14.5 15V21"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'prayers':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Modern Salah Clock Dial */}
          <Circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth="2" />
          <Path
            d="M12 7V12L15.5 14"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="12" r="1.2" fill={strokeColor} />
        </Svg>
      );

    case 'qibla':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Sleek Compass Needle */}
          <Circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth="2" />
          <Path
            d="M15.5 8.5L13 15.5L8.5 15.5L11 8.5L15.5 8.5Z"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="12" r="1.2" fill={strokeColor} />
        </Svg>
      );

    case 'hadith':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Modern Clean Open Scripture Book */}
          <Path
            d="M4 19.5C6.5 18 9.5 18 12 19.5C14.5 18 17.5 18 20 19.5V5.5C17.5 4 14.5 4 12 5.5C9.5 4 6.5 4 4 5.5V19.5Z"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M12 5.5V19.5" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );

    case 'progress':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Clean 3-Bar Analytics / Tracker */}
          <Path d="M18 20V10" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M12 20V4" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M6 20V14" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      );
  }
};
