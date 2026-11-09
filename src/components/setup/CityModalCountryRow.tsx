import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface CityModalCountryRowProps {
  country: string;
  cityCount: number;
  onPress: () => void;
}

export const CityModalCountryRow: React.FC<CityModalCountryRowProps> = ({
  country,
  cityCount,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Select country: ${country}, ${cityCount} cities`}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: theme.colors.border,
          backgroundColor: pressed ? theme.colors.mintTint : 'transparent',
        },
      ]}
    >
      <View>
        <AppText variant="titleSmall" color={theme.colors.text}>
          {country}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {cityCount} {cityCount === 1 ? 'city' : 'cities'}
        </AppText>
      </View>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9 18L15 12L9 6"
          stroke={theme.colors.textMuted}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
