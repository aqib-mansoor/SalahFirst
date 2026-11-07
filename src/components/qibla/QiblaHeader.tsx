import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface QiblaHeaderProps {
  cityName: string;
  country: string;
  qiblaBearing: number;
  cardinal: string;
}

export const QiblaHeader: React.FC<QiblaHeaderProps> = ({
  cityName,
  country,
  qiblaBearing,
  cardinal,
}) => {
  const theme = useTheme('light');

  return (
    <View style={styles.container}>
      <View style={styles.titleColumn}>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
          Qibla Compass
        </AppText>
        <View style={styles.cityRow}>
          <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
              stroke={theme.colors.primary}
              strokeWidth="2"
            />
            <Circle cx="12" cy="9" r="2.5" stroke={theme.colors.primary} strokeWidth="2" />
          </Svg>
          <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.cityName}>
            {cityName}, {country}
          </AppText>
        </View>
      </View>

      <View style={[styles.bearingBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.bearingLabel}>
          Qibla Bearing
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
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  titleColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '800',
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityName: {
    fontWeight: '600',
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
