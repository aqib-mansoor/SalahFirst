import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { getIslamicDateFormatted } from '@/utils/hijriCalendar';
import { HijriStepper } from './HijriStepper';

export interface PrayerSettingsGroupProps {
  cityName: string;
  country: string;
  juristicMethod: 'Hanafi' | 'Standard';
  calculationMethodName?: string;
  hijriAdjustment?: number;
  onUpdateHijriAdjustment?: (newAdjustment: number) => void;
  onOpenLocation: () => void;
  onOpenAzanPrefs: () => void;
  onToggleJuristic: () => void;
  onCycleCalculationMethod?: () => void;
}

export const PrayerSettingsGroup: React.FC<PrayerSettingsGroupProps> = ({
  cityName,
  country,
  juristicMethod,
  calculationMethodName = 'University of Islamic Sciences, Karachi',
  hijriAdjustment = 0,
  onUpdateHijriAdjustment,
  onOpenLocation,
  onOpenAzanPrefs,
  onToggleJuristic,
  onCycleCalculationMethod,
}) => {
  const theme = useTheme();
  const { t, language } = useTranslation();

  const previewDate = getIslamicDateFormatted(new Date(), language, hijriAdjustment);

  const ChevronRight = (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={theme.colors.textSecondary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.textSecondary} style={styles.sectionLabel}>
        {t('prayerTimes').toUpperCase()}
      </AppText>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Row 1: Location */}
        <Pressable onPress={onOpenLocation} style={styles.row}>
          <View style={styles.leftRow}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx="12" cy="10" r="3" stroke={theme.colors.primary} strokeWidth="2" />
            </Svg>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('locationAndCalculation')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {cityName}{country ? `, ${country}` : ''}
              </AppText>
            </View>
          </View>
          {ChevronRight}
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 2: Calculation Method */}
        <Pressable onPress={onCycleCalculationMethod} style={styles.row}>
          <View style={styles.leftRow}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="10" stroke={theme.colors.primary} strokeWidth="2" />
              <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('calculationMethod')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary} numberOfLines={1}>
                {calculationMethodName}
              </AppText>
            </View>
          </View>
          <View style={[styles.pillBadge, { backgroundColor: theme.colors.secondaryTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.pillText}>
              {t('switchAction')}
            </AppText>
          </View>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 3: Asr Juristic Preference */}
        <Pressable onPress={onToggleJuristic} style={styles.row}>
          <View style={styles.leftRow}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="5" stroke={theme.colors.primary} strokeWidth="2" />
              <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" />
            </Svg>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('asrJuristicPreference')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {t('standardOrHanafi')}
              </AppText>
            </View>
          </View>
          <View style={[styles.pillBadge, { backgroundColor: theme.colors.secondaryTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.pillText}>
              {juristicMethod}
            </AppText>
          </View>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 4: Hijri Date Adjustment Stepper */}
        <View style={styles.row}>
          <View style={styles.leftRow}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('hijriDateAdjustment')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {previewDate}
              </AppText>
            </View>
          </View>

          <HijriStepper
            adjustment={hijriAdjustment}
            onUpdate={(val) => onUpdateHijriAdjustment?.(val)}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 5: Azan Sounds & Notifications */}
        <Pressable onPress={onOpenAzanPrefs} style={styles.row}>
          <View style={styles.leftRow}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('azanAudioReminders')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Makkah Haram • 15m pre-reminder
              </AppText>
            </View>
          </View>
          {ChevronRight}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs + 2,
  },
  sectionLabel: {
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
    paddingRight: SPACING.sm,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontWeight: '700',
  },
  pillBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  pillText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
