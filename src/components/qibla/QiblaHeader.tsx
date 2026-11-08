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
        <Pressable
          onPress={onChangeLocation}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${cityName}, ${country} - ${t('changeLocation') || 'Change Location'}`}
          style={styles.cityRow}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
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
          {onChangeLocation && (
            <View style={[styles.changeBadge, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
              <AppText variant="caption" color={theme.colors.primary} style={styles.changeAction}>
                {t('changeLocation') || 'Change'}
              </AppText>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  titleColumn: {
    gap: 4,
  },
  title: {
    fontWeight: '800',
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cityName: {
    fontWeight: '600',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  changeAction: {
    fontWeight: '700',
    fontSize: 10,
  },
});
