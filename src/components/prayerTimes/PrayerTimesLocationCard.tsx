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
  isGps?: boolean;
  onOpenLocationSheet: () => void;
  onUseGps: () => void;
}

export const PrayerTimesLocationCard: React.FC<PrayerTimesLocationCardProps> = ({
  cityName,
  country,
  methodName = CALCULATION_METHOD_LABELS.Karachi,
  juristicMethod = 'Hanafi',
  isGps = false,
  onOpenLocationSheet,
  onUseGps,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const displayCity = cityName || t('detectingLocation');
  const locationLabel = country ? `${displayCity}, ${country}` : displayCity;
  const juristicLabel = juristicMethod === 'Hanafi' ? t('hanafiAsr') : t('standardAsr');

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Pressable
        onPress={onOpenLocationSheet}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Change city selection"
        style={({ pressed }) => [styles.titleGroup, { opacity: pressed ? 0.78 : 1 }]}
      >
        <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint }]}>
          <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
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

        <View style={styles.locationInfo}>
          <View style={styles.cityRow}>
            <AppText variant="titleSmall" color={theme.colors.text} numberOfLines={1} style={styles.cityTitle}>
              {locationLabel}
            </AppText>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 9l6 6 6-6"
                stroke={theme.colors.textMuted}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1} style={styles.methodSubtitle}>
            {methodName} • {juristicLabel}
          </AppText>
        </View>
      </Pressable>

      <Pressable
        onPress={onUseGps}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Detect current location via device GPS"
        style={({ pressed }) => [
          styles.gpsBtn,
          {
            backgroundColor: pressed
              ? theme.colors.surfaceElevated
              : isGps
              ? theme.colors.secondaryTint
              : theme.colors.surfaceElevated,
            borderColor: isGps ? theme.colors.primary : theme.colors.border,
          },
        ]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2v3M12 19v3M2 12h3M19 12h3M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
        <AppText variant="caption" color={theme.colors.primary} style={styles.gpsBtnText}>
          GPS
        </AppText>
      </Pressable>
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
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginHorizontal: SPACING.lg,
    marginVertical: 4,
    gap: SPACING.sm,
  },
  titleGroup: {
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
  locationInfo: {
    flex: 1,
    gap: 1,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityTitle: {
    fontWeight: '700',
    fontSize: 14,
    flexShrink: 1,
  },
  methodSubtitle: {
    fontSize: 11,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  gpsBtnText: {
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
