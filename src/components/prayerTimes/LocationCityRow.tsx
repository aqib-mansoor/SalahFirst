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

  return (
    <Pressable
      onPress={() => onSelect(city)}
      accessibilityRole="button"
      accessibilityLabel={`${city.name}, ${city.country}`}
      accessibilityState={{ selected: isSelected }}
      style={({ pressed }) => [
        styles.cityCard,
        {
          backgroundColor: isSelected
            ? theme.colors.secondaryTint
            : pressed
            ? theme.colors.surfaceElevated
            : theme.colors.surface,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          borderWidth: isSelected ? 1.5 : 1,
        },
      ]}
    >
      <View style={styles.cityInfo}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.cityName}>
          {city.name}, {city.country}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1} style={styles.qiblaText}>
          Qibla: {city.qiblaDegrees}° • {city.methodName}
        </AppText>
      </View>

      {isSelected && (
        <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary }]}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 13l4 4L19 7"
              stroke={theme.colors.textOnPrimary}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.xl,
    gap: SPACING.sm,
  },
  cityInfo: {
    gap: 2,
    flex: 1,
  },
  cityName: {
    fontWeight: '700',
    fontSize: 13,
  },
  qiblaText: {
    fontSize: 11,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
