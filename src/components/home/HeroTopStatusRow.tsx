import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import type { PrayerPeriodCategory } from '@/types';

export interface HeroTopStatusRowProps {
  localizedCurrentPrayer: string;
  currentTimeFormatted: string;
  isCurrentCompleted: boolean;
  periodCategory?: PrayerPeriodCategory;
  periodId?: string;
}

export const HeroTopStatusRow: React.FC<HeroTopStatusRowProps> = ({
  localizedCurrentPrayer,
  currentTimeFormatted,
  isCurrentCompleted,
  periodCategory = 'obligatory',
  periodId,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const defaultObligatory = {
    text: isCurrentCompleted ? `${t('completed')} ✓` : t('pending'),
    color: isCurrentCompleted ? theme.colors.accent : 'rgba(255, 255, 255, 0.85)',
    dot: theme.colors.accent,
  };

  const statusConfig = {
    prohibited: { text: t('prohibited'), color: '#FF8A80', dot: '#FF8A80' },
    nafl: {
      text: periodId === 'tahajjud_last_third' ? t('lastThirdPill') : t('nafl'),
      color: theme.colors.accent,
      dot: theme.colors.accent,
    },
    informational: { text: t('detectingLocation'), color: 'rgba(255, 255, 255, 0.85)', dot: theme.colors.secondary },
    obligatory: defaultObligatory,
  }[periodCategory] || defaultObligatory;

  const showStatusPill =
    periodCategory !== 'nafl' &&
    periodId !== 'tahajjud_last_third';

  return (
    <View style={styles.topRow}>
      <View
        style={[
          styles.currentTag,
          { borderColor: 'rgba(247, 207, 87, 0.35)', backgroundColor: 'rgba(0, 0, 0, 0.25)' },
        ]}
      >
        <View style={[styles.goldDot, { backgroundColor: statusConfig.dot }]} />
        <AppText variant="caption" color={theme.colors.accentLight} style={styles.currentText} numberOfLines={1}>
          {t('currentPrayer').toUpperCase()}: {localizedCurrentPrayer} ({currentTimeFormatted})
        </AppText>
      </View>

      {showStatusPill && (
        <View
          style={[
            styles.statusPill,
            { backgroundColor: 'rgba(0, 0, 0, 0.25)', borderColor: 'rgba(247, 207, 87, 0.30)' },
          ]}
        >
          <AppText variant="caption" color={statusConfig.color} style={styles.statusText}>
            {statusConfig.text}
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  currentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  goldDot: { width: 6, height: 6, borderRadius: 3 },
  currentText: { fontWeight: '700', fontSize: 11, letterSpacing: 0.3 },
  statusPill: { paddingHorizontal: SPACING.sm + 4, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 1 },
  statusText: { fontWeight: '700', fontSize: 11 },
});

