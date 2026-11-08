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
      {/* Top Header Row: Icon + Location Title + GPS/Preset Status Badge */}
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.mintTint }]}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
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
            <AppText variant="titleSmall" color={theme.colors.text} numberOfLines={1} style={styles.cityTitle}>
              {locationLabel}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted} numberOfLines={1} style={styles.methodSubtitle}>
              {methodName} • {juristicLabel}
            </AppText>
          </View>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: isGps ? theme.colors.secondaryTint : theme.colors.surfaceElevated,
              borderColor: isGps ? theme.colors.primary : theme.colors.border,
            },
          ]}
        >
          <AppText variant="caption" color={isGps ? theme.colors.primary : theme.colors.textMuted} style={styles.badgeText}>
            {isGps ? t('gpsActive') : t('presetCity')}
          </AppText>
        </View>
      </View>

      {/* Bottom Side-by-Side Quick Actions */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={onOpenLocationSheet}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Change city selection"
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
              stroke={theme.colors.text}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="9" r="2.5" stroke={theme.colors.text} strokeWidth="2" />
          </Svg>
          <AppText variant="caption" color={theme.colors.text} style={styles.btnText}>
            {t('changeCity')}
          </AppText>
        </Pressable>

        <Pressable
          onPress={onUseGps}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Detect current location via device GPS"
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.secondaryTint,
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
          <AppText variant="caption" color={theme.colors.primary} style={styles.btnText}>
            {t('gpsAutoDetect')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
    gap: SPACING.sm + 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    gap: 1,
  },
  cityTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  methodSubtitle: {
    fontSize: 11,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  btnText: {
    fontWeight: '700',
    fontSize: 11,
  },
});
