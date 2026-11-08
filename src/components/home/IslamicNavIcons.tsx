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
  const strokeColor = customColor ?? (isActive ? theme.colors.accent : theme.colors.textSecondary);
  const fillColor = customColor ? 'none' : (isActive ? theme.colors.accentTint : 'none');

  switch (tabId) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Mosque Dome and Outer Frame */}
          <Path
            d="M12 3C10.5 4.8 5 9 5 13.5V20.5H19V13.5C19 9 13.5 4.8 12 3Z"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={fillColor}
          />
          {/* Inner Pointed Mihrab Arch */}
          <Path
            d="M9 20.5V15C9 13.6 10.3 12.5 12 12.5C13.7 12.5 15 13.6 15 15V20.5"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Finial Star on Dome Peak */}
          <Circle cx="12" cy="3" r="1.2" fill={strokeColor} />
        </Svg>
      );

    case 'prayers':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Circular Salah Time Dial */}
          <Circle
            cx="12"
            cy="13"
            r="8.5"
            stroke={strokeColor}
            strokeWidth="1.8"
            fill={fillColor}
          />
          {/* Hour & Minute Hands */}
          <Path
            d="M12 8.5V13L15 15"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crescent Finial */}
          <Path
            d="M10 2.5C11.2 2.8 12 3.9 11.8 5.1C11.5 6.2 10.4 6.9 9.2 6.7C10.2 7.4 11.5 7.4 12.4 6.7C13.3 6 13.6 4.7 13.1 3.6C12.7 2.7 11.8 2.2 10 2.5Z"
            fill={strokeColor}
          />
        </Svg>
      );

    case 'qibla':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Outer Astrolabe Compass Ring */}
          <Circle
            cx="12"
            cy="12"
            r="9"
            stroke={strokeColor}
            strokeWidth="1.8"
            fill={fillColor}
          />
          {/* Cardinal Axis Markers */}
          <Path
            d="M12 4.5V6.5M12 17.5V19.5M4.5 12H6.5M17.5 12H19.5"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Kaaba Directional Pointer Needle */}
          <Path
            d="M14.5 9.5L12 4L9.5 9.5L12 8L14.5 9.5Z"
            fill={strokeColor}
            stroke={strokeColor}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <Path
            d="M12 8V16"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <Circle cx="12" cy="12" r="1.8" stroke={strokeColor} strokeWidth="1.5" />
        </Svg>
      );

    case 'hadith':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Sacred Open Book Pages */}
          <Path
            d="M4 6.5C7.2 5.2 10.5 6 12 7.2C13.5 6 16.8 5.2 20 6.5V16.5C16.8 15.2 13.5 16 12 17.2C10.5 16 7.2 15.2 4 16.5V6.5Z"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={fillColor}
          />
          {/* Center Book Spine */}
          <Path d="M12 7.2V17.2" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
          {/* Authentic Rehal Wooden Folding Stand Base */}
          <Path
            d="M6 18.5L18 21.5M18 18.5L6 21.5"
            stroke={strokeColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'progress':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Ground Baseline */}
          <Path d="M3.5 21H20.5" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" />
          {/* Ascending Prayer Columns */}
          <Path
            d="M6 19.5V13.5M12 19.5V9M18 19.5V5.5"
            stroke={strokeColor}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Star Milestone on Peak Column */}
          <Path
            d="M18 2.2L18.5 3.5L19.8 3.7L18.8 4.7L19.1 6L18 5.3L16.9 6L17.2 4.7L16.2 3.7L17.5 3.5L18 2.2Z"
            fill={strokeColor}
          />
        </Svg>
      );
  }
};

