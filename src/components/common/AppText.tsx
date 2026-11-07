import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { TYPOGRAPHY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export type TextVariant = keyof typeof TYPOGRAPHY;

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  muted?: boolean;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'bodyMedium',
  color,
  muted = false,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const theme = useTheme();
  const textColor = color ?? (muted ? theme.colors.textMuted : theme.colors.text);

  return (
    <Text
      style={[
        TYPOGRAPHY[variant],
        { color: textColor, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

