import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { PresetCity } from '@/data';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface CityModalCityRowProps {
  city: PresetCity;
  subtitle?: string;
  onPress: () => void;
}

export const CityModalCityRow: React.FC<CityModalCityRowProps> = ({
  city,
  subtitle,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Select city: ${city.name}, ${city.country}`}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: theme.colors.border,
          backgroundColor: pressed ? theme.colors.mintTint : 'transparent',
        },
      ]}
    >
      <AppText variant="titleSmall" color={theme.colors.text}>
        {city.name}
      </AppText>
      <AppText variant="caption" color={theme.colors.textMuted}>
        {subtitle || `${city.country} • Qibla ${city.qiblaDegrees}°`}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
});
