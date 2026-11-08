import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface StreaksHeroCardProps {
  streakDays: number;
}

export const StreaksHeroCard: React.FC<StreaksHeroCardProps> = ({ streakDays }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const spiritualQuote =
    streakDays === 0
      ? t('beginYourStreak') || 'Begin your sacred prayer streak today.'
      : streakDays < 7
      ? '“The most beloved deed to Allah is that which is done consistently.”'
      : streakDays < 30
      ? '“Take up deeds you can carry out steadfastly.”'
      : '“Istiqamah: Steadfastness is greater than a thousand miracles.”';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.primaryHero,
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
      ]}
    >
      <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.14} />

      <View style={styles.contentCol}>
        <AppText variant="caption" color={theme.colors.accentLight} style={styles.label}>
          {t('currentStreak')}
        </AppText>
        <AppText variant="titleMedium" color={theme.colors.textOnPrimary} style={styles.streakNumber}>
          {streakDays}{' '}
          <AppText variant="bodySmall" color={theme.colors.textOnPrimary} style={styles.unitText}>
            {t('daysFiveOfFive')}
          </AppText>
        </AppText>
        <AppText variant="caption" color={theme.colors.accentLight} style={styles.subtext}>
          {spiritualQuote}
        </AppText>
      </View>

      {/* Slim Flame Badge */}
      <View
        style={[
          styles.flameBadge,
          {
            backgroundColor: theme.colors.accentTint,
            borderColor: 'rgba(255, 255, 255, 0.15)',
          },
        ]}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
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
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  contentCol: {
    flex: 1,
    gap: 2,
    zIndex: 2,
    marginRight: SPACING.sm,
  },
  label: {
    fontWeight: '800',
    fontSize: 10.5,
    letterSpacing: 0.6,
  },
  streakNumber: {
    fontWeight: '800',
    fontSize: 20,
    lineHeight: 25,
  },
  unitText: {
    fontWeight: '600',
    fontSize: 12,
  },
  subtext: {
    lineHeight: 15,
    fontSize: 10.5,
    marginTop: 2,
    fontStyle: 'italic',
    opacity: 0.95,
  },
  flameBadge: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
