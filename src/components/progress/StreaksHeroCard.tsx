import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface StreaksHeroCardProps {
  streakDays: number;
}

export const StreaksHeroCard: React.FC<StreaksHeroCardProps> = ({ streakDays }) => {
  const theme = useTheme('light');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.borderGold,
        },
      ]}
    >
      <View style={styles.watermarkLayer}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <G transform="translate(60, 60)">
            <Rect x="-40" y="-40" width="80" height="80" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
            <Rect x="-40" y="-40" width="80" height="80" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" transform="rotate(45)" />
          </G>
        </Svg>
      </View>

      <View style={styles.contentCol}>
        <AppText variant="caption" color={theme.colors.accentLight} style={styles.label}>
          CURRENT FULL-DAY STREAK
        </AppText>
        <AppText variant="titleLarge" color={theme.colors.textInverse} style={styles.streakNumber}>
          {streakDays}{' '}
          <AppText variant="titleMedium" color={theme.colors.textInverse} style={styles.unitText}>
            days (5/5 Salah)
          </AppText>
        </AppText>
        <AppText variant="bodySmall" color="rgba(255,255,255,0.8)" style={styles.subtext}>
          Every prayer you offer counts—consistency grows one Salah at a time.
        </AppText>
      </View>

      {/* Flame Icon Badge */}
      <View style={[styles.flameBadge, { backgroundColor: 'rgba(204,161,95,0.2)', borderColor: theme.colors.accent }]}>
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <Path
            d="M8.5 14.5C8.5 16.43 10.07 18 12 18C13.93 18 15.5 16.43 15.5 14.5C15.5 12.5 13.5 10.5 12 8C10.5 10.5 8.5 12.5 8.5 14.5Z"
            fill={theme.colors.accent}
          />
          <Path
            d="M12 2C8 6 6 9.5 6 13.5C6 16.81 8.69 19.5 12 19.5C15.31 19.5 18 16.81 18 13.5C18 9.5 16 6 12 2Z"
            stroke={theme.colors.accent}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  watermarkLayer: {
    position: 'absolute',
    right: -10,
    top: -10,
  },
  contentCol: {
    flex: 1,
    gap: 4,
    zIndex: 2,
    marginRight: SPACING.sm,
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  streakNumber: {
    fontWeight: '800',
  },
  unitText: {
    fontWeight: '600',
  },
  subtext: {
    lineHeight: 18,
    marginTop: 2,
  },
  flameBadge: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
