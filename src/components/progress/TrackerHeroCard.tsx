import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface TrackerHeroCardProps {
  completedCount: number;
}

export const TrackerHeroCard: React.FC<TrackerHeroCardProps> = ({ completedCount }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const total = 5;
  const percentage = Math.round((completedCount / total) * 100);
  const remaining = total - completedCount;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.primaryHero,
          borderColor: 'rgba(243, 196, 64, 0.35)',
        },
      ]}
    >
      <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.16} />

      {/* Left Content Column */}
      <View style={styles.textColumn}>
        <AppText variant="caption" color="rgba(255,255,255,0.7)" style={styles.subtitle}>
          {t('todaysProgress')}
        </AppText>
        <AppText variant="titleLarge" color={theme.colors.textInverse} style={styles.headline}>
          {completedCount} {t('of')} 5 {t('completedSuffix')}
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.accentLight} style={styles.remainingText}>
          {remaining === 0
            ? t('allPrayersCompleted')
            : t('prayersRemainingCount', { count: remaining })}
        </AppText>
      </View>

      {/* Right Circular Progress Ring */}
      <View style={[styles.progressRingOuter, { borderColor: theme.colors.accent }]}>
        <AppText variant="titleMedium" color={theme.colors.textInverse} style={styles.percentageText}>
          {percentage}%
        </AppText>
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
  textColumn: {
    flex: 1,
    gap: 4,
    zIndex: 2,
  },
  subtitle: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headline: {
    fontWeight: '800',
    fontSize: 22,
  },
  remainingText: {
    fontWeight: '600',
    marginTop: 2,
  },
  progressRingOuter: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 2,
  },
  percentageText: {
    fontWeight: '800',
    fontSize: 16,
  },
});
