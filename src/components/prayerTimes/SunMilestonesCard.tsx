import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface SunMilestonesCardProps {
  sunriseTime: string;
  sunsetTime: string;
}

export const SunMilestonesCard: React.FC<SunMilestonesCardProps> = ({
  sunriseTime,
  sunsetTime,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Sunrise */}
      <View style={styles.milestone}>
        <View style={[styles.iconPill, { backgroundColor: theme.colors.accentTint }]}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="4" stroke={theme.colors.accent} strokeWidth="2" />
            <Path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
              stroke={theme.colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </View>
        <View style={styles.textCol}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.label}>
            {t('sunrise')}
          </AppText>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.time}>
            {sunriseTime}
          </AppText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      {/* Sunset / Iftar */}
      <View style={styles.milestone}>
        <View style={[styles.iconPill, { backgroundColor: theme.colors.secondaryTint }]}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M17 18a5 5 0 0 0-10 0M12 9v4M12 17v-1M4 20h16M7 7l1.5 1.5M17 7l-1.5 1.5"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <View style={styles.textCol}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.label}>
            {t('sunset')}
          </AppText>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.time}>
            {sunsetTime}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 4,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginHorizontal: SPACING.lg,
    marginVertical: 4,
  },
  milestone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  time: {
    fontWeight: '700',
    fontSize: 13,
  },
  divider: {
    width: 1,
    height: 22,
  },
});

