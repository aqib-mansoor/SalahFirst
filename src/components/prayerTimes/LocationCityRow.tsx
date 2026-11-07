import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PresetCity } from '@/data';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface LocationCityRowProps {
  city: PresetCity;
  isSelected: boolean;
  onSelect: (city: PresetCity) => void;
}

export const LocationCityRow: React.FC<LocationCityRowProps> = ({
  city,
  isSelected,
  onSelect,
}) => {
  const theme = useTheme();
  const cardBg = isSelected ? theme.colors.bannerGreen : theme.colors.surfaceElevated;
  const textColor = isSelected ? theme.colors.bannerGreenText : theme.colors.text;
  const subtextColor = isSelected ? theme.colors.accentLight : theme.colors.textMuted;

  return (
    <Pressable
      onPress={() => onSelect(city)}
      accessibilityRole="button"
      accessibilityLabel={`${city.name}, ${city.country}, Qibla angle ${city.qiblaDegrees} degrees`}
      accessibilityState={{ selected: isSelected }}
      style={({ pressed }) => [
        styles.cityCard,
        {
          backgroundColor: cardBg,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.cityInfo}>
        <AppText variant="titleSmall" color={textColor} style={styles.cityName}>
          {city.name}, {city.country}
        </AppText>
        <AppText variant="caption" color={subtextColor} style={styles.qiblaText}>
          Qibla: {city.qiblaDegrees}° • {city.methodName}
        </AppText>
      </View>

      {isSelected && (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 13l4 4L19 7"
            stroke={theme.colors.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  cityInfo: {
    gap: 2,
    flex: 1,
  },
  cityName: {
    fontWeight: '700',
  },
  qiblaText: {
    fontWeight: '500',
  },
});

