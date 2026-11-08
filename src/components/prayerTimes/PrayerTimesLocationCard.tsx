import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

import { JuristicMethod } from '@/types';
import { CALCULATION_METHOD_LABELS } from '@/utils/prayerCalculationBase';

export interface PrayerTimesLocationCardProps {
  cityName?: string;
  country?: string;
  methodName?: string;
  juristicMethod?: JuristicMethod;
  onOpenLocationSheet: () => void;
}

export const PrayerTimesLocationCard: React.FC<PrayerTimesLocationCardProps> = ({
  cityName,
  country,
  methodName = CALCULATION_METHOD_LABELS.Karachi,
  juristicMethod = 'Hanafi',
  onOpenLocationSheet,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const displayCity = cityName || t('detectingLocation');
  const locationLabel = country ? `${displayCity}, ${country}` : displayCity;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: theme.colors.mintTint }]}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="9" r="2.5" stroke={theme.colors.primary} strokeWidth="2" />
        </Svg>
      </View>

      <View style={styles.textColumn}>
        <AppText variant="titleSmall" color={theme.colors.text} numberOfLines={1} style={styles.cityTitle}>
          {locationLabel}
        </AppText>

        <View style={styles.methodRow}>
          <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1} style={styles.methodText}>
            {methodName} •
          </AppText>
          <Pressable
            onPress={onOpenLocationSheet}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Change location or calculation method"
            accessibilityHint="Opens location selection sheet"
          >
            <AppText variant="caption" color={theme.colors.primary} style={styles.changeLink}>
              {t('changeLocation')}
            </AppText>
          </Pressable>
        </View>

        <AppText variant="caption" color={theme.colors.textMuted} style={styles.juristicText}>
          {juristicMethod === 'Hanafi' ? t('hanafiAsr') : t('standardAsr')}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
    gap: SPACING.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  cityTitle: {
    fontWeight: '700',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  methodText: {
    flexShrink: 1,
  },
  changeLink: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  juristicText: {
    fontWeight: '500',
  },
});

