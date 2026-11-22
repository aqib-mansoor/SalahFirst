import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export const CalendarGridLegend: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.legendRow, { borderTopColor: theme.colors.border }]}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.legendText}>
          {t('prayedLegend')}
        </AppText>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: theme.colors.border }]} />
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.legendText}>
          {t('pending')}
        </AppText>
      </View>
      <View style={styles.legendItem}>
        <View
          style={[
            styles.legendBox,
            {
              backgroundColor: theme.colors.secondaryTint,
              borderColor: theme.colors.primary,
            },
          ]}
        />
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.legendText}>
          {t('fiveOfFiveComplete')}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    marginTop: 4,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendBox: {
    width: 11,
    height: 11,
    borderRadius: 3,
    borderWidth: 1.2,
  },
  legendText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
});

