import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface SunriseCardProps {
  time?: string;
}

export const SunriseCard: React.FC<SunriseCardProps> = ({ time = '06:39 AM' }) => {
  const theme = useTheme('light');

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
      <View style={styles.leftRow}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="4" stroke={PALETTE.gold} strokeWidth="2" />
          <Path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
            stroke={PALETTE.gold}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
        <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.title}>
          Sunrise (Shuruq)
        </AppText>
      </View>

      <AppText variant="titleSmall" color={theme.colors.text} style={styles.timeText}>
        {time}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md - 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontWeight: '600',
  },
  timeText: {
    fontWeight: '700',
  },
});

