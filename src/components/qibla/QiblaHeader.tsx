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
  qiblaBearing: number;
  cardinal: string;
  onChangeLocation?: () => void;
}

export const QiblaHeader: React.FC<QiblaHeaderProps> = ({
  cityName,
  country,
  qiblaBearing,
  cardinal,
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
            <AppText variant="caption" color={theme.colors.primary} style={styles.changeAction}>
              {t('changeLocation') || 'Change'}
            </AppText>
          )}
        </Pressable>
      </View>

      <View
        style={[
          styles.bearingBadge,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.bearingLabel}>
          {t('qiblaAngle')}
        </AppText>
        <AppText variant="titleSmall" color={theme.colors.primary} style={styles.bearingValue}>
          {qiblaBearing}° {cardinal}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  titleColumn: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontWeight: '800',
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cityName: {
    fontWeight: '600',
    maxWidth: 160,
  },
  changeAction: {
    fontWeight: '700',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  bearingBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  bearingLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  bearingValue: {
    fontWeight: '800',
  },
});
