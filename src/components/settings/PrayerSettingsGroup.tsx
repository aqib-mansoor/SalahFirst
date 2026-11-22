import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { getIslamicDateFormatted } from '@/utils/hijriCalendar';
import { HijriStepper } from './HijriStepper';
import { FiqhSettingRow } from './FiqhSettingRow';
import { FiqhName, JuristicMethod } from '@/types';

export interface PrayerSettingsGroupProps {
  cityName: string;
  country: string;
  juristicMethod?: JuristicMethod;
  fiqh?: FiqhName;
  calculationMethodName?: string;
  hijriAdjustment?: number;
  adjustmentsSummaryText?: string;
  onUpdateHijriAdjustment?: (newAdjustment: number) => void;
  onOpenLocation: () => void;
  onOpenPrayerAdjustments?: () => void;
  onToggleJuristic?: () => void;
  onOpenFiqh?: () => void;
  onCycleCalculationMethod?: () => void;
}

export const PrayerSettingsGroup: React.FC<PrayerSettingsGroupProps> = ({
  cityName,
  country,
  juristicMethod = 'Hanafi',
  fiqh,
  calculationMethodName = 'University of Islamic Sciences, Karachi',
  hijriAdjustment = 0,
  adjustmentsSummaryText,
  onUpdateHijriAdjustment,
  onOpenLocation,
  onOpenPrayerAdjustments,
  onToggleJuristic,
  onOpenFiqh,
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
            <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.border }]}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx="12" cy="10" r="3" stroke={theme.colors.primary} strokeWidth="2" />
              </Svg>
            </View>
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
            <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.border }]}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={theme.colors.primary} strokeWidth="2" />
                <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
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

        {/* Row 3: Juristic Fiqh Preference */}
        <FiqhSettingRow
          fiqh={fiqh || (juristicMethod === 'Hanafi' ? 'Hanafi' : 'Shafii')}
          onPress={onOpenFiqh || onToggleJuristic || (() => {})}
        />

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 4: Hijri Date Adjustment Stepper */}
        <View style={styles.row}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.border }]}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
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

        {onOpenPrayerAdjustments && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <Pressable onPress={onOpenPrayerAdjustments} style={styles.row}>
              <View style={styles.leftRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.border }]}>
                  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="9" stroke={theme.colors.primary} strokeWidth="2" />
                    <Path d="M12 7v5l3 3" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
                <View style={styles.textCol}>
                  <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                    {t('prayerTimeAdjustmentsTitle')}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary} numberOfLines={1}>
                    {adjustmentsSummaryText || t('prayerTimeAdjustmentsSub')}
                  </AppText>
                </View>
              </View>
              {ChevronRight}
            </Pressable>
          </>
        )}
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 4,
    flex: 1,
    paddingRight: SPACING.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: StyleSheet.hairlineWidth,
    marginLeft: 60,
  },
});
