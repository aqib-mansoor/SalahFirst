import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface QiblaHeaderProps {
  cityName: string;
  country: string;
  onChangeLocation?: () => void;
}

export const QiblaHeader: React.FC<QiblaHeaderProps> = ({
  cityName,
  country,
  onChangeLocation,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.titleColumn}>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
          {t('navQibla')}
        </AppText>
        <View style={styles.cityRow}>
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
              stroke={theme.colors.primary}
              strokeWidth="2"
            />
            <Circle cx="12" cy="9" r="2.5" stroke={theme.colors.primary} strokeWidth="2" />
          </Svg>
          <AppText
            variant="bodySmall"
            color={theme.colors.textMuted}
            style={styles.cityName}
            numberOfLines={1}
          >
            {cityName}{country ? `, ${country}` : ''}
          </AppText>
        </View>
      </View>

      {onChangeLocation && (
        <Pressable
          onPress={onChangeLocation}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t('changeLocation') || 'Change Location'}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
              borderColor: theme.colors.border,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="9" r="2.5" stroke={theme.colors.primary} strokeWidth="2" />
          </Svg>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  titleColumn: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: -0.3,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cityName: {
    fontSize: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});
