import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, PrayerTimeIcon } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface NextTomorrowPrayerCardProps {
  prayerName: string;
  timeFormatted: string;
  remainingTimeText?: string;
}

export const NextTomorrowPrayerCard: React.FC<NextTomorrowPrayerCardProps> = ({
  prayerName,
  timeFormatted,
  remainingTimeText,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.accent,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.accentTint }]}>
          <PrayerTimeIcon prayer={prayerName} size={20} />
        </View>

        <View style={styles.textColumn}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.bannerLabel}>
            {t('nextPrayerTomorrow')}
          </AppText>
          <View style={styles.nameRow}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.prayerTitle}>
              {t(prayerName.toLowerCase() as any) || prayerName}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.atText}>
              • {timeFormatted}
            </AppText>
          </View>
        </View>
      </View>

      {remainingTimeText && (
        <View style={[styles.countdownBadge, { backgroundColor: theme.colors.accent }]}>
          <AppText variant="caption" color={theme.colors.textOnAccent} style={styles.countdownText}>
            NEXT • {remainingTimeText}
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    gap: 1,
  },
  bannerLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prayerTitle: {
    fontWeight: '800',
  },
  atText: {
    fontSize: 12,
    fontWeight: '600',
  },
  countdownBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.4,
  },
});

