import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { NotificationMode } from '@/types';

export interface NotificationModeIconProps {
  mode: NotificationMode;
  color: string;
  size?: number;
}

export const NotificationModeIcon: React.FC<NotificationModeIconProps> = ({
  mode,
  color,
  size = 18,
}) => {
  switch (mode) {
    case 'AZAN':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M21 4a8 8 0 0 1 0 16M19 7a5 5 0 0 1 0 10"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'TONE':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'VIBRATE':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="7"
            y="4"
            width="10"
            height="16"
            rx="2"
            stroke={color}
            strokeWidth="2"
          />
          <Path
            d="M3 8v8M1 10v4M21 8v8M23 10v4M11 17h2"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'SILENT':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M3 3l18 18"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </Svg>
      );
  }
};
