import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { getIslamicDateFormatted } from '@/utils/hijriCalendar';

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
  onVerifyAlAdhan?: () => void;
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
  onVerifyAlAdhan,
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
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
              {t('locationAndCalculation')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {cityName}{country ? `, ${country}` : ''}
            </AppText>
          </View>
          {ChevronRight}
        </Pressable>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 2: Calculation Method */}
        <Pressable onPress={onCycleCalculationMethod} style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
              {t('calculationMethod')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {calculationMethodName}
            </AppText>
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
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
              {t('asrJuristicPreference')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {t('standardOrHanafi')}
            </AppText>
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
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
              Hijri Date Adjustment
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {previewDate}
            </AppText>
          </View>

          <View style={styles.stepperContainer}>
            <Pressable
              onPress={() => onUpdateHijriAdjustment?.(hijriAdjustment - 1)}
              disabled={hijriAdjustment <= -2}
              style={({ pressed }) => [
                styles.stepperBtn,
                {
                  backgroundColor: theme.colors.surfaceSubtle,
                  borderColor: theme.colors.border,
                  opacity: hijriAdjustment <= -2 ? 0.35 : pressed ? 0.7 : 1,
                },
              ]}
              hitSlop={6}
            >
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.stepperSign}>
                −
              </AppText>
            </Pressable>

            <View style={[styles.offsetPill, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.primary }]}>
              <AppText variant="caption" color={theme.colors.primary} style={styles.offsetText}>
                {hijriAdjustment > 0 ? `+${hijriAdjustment}` : hijriAdjustment}d
              </AppText>
            </View>

            <Pressable
              onPress={() => onUpdateHijriAdjustment?.(hijriAdjustment + 1)}
              disabled={hijriAdjustment >= 2}
              style={({ pressed }) => [
                styles.stepperBtn,
                {
                  backgroundColor: theme.colors.surfaceSubtle,
                  borderColor: theme.colors.border,
                  opacity: hijriAdjustment >= 2 ? 0.35 : pressed ? 0.7 : 1,
                },
              ]}
              hitSlop={6}
            >
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.stepperSign}>
                +
              </AppText>
            </Pressable>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 5: Azan Sounds & Notifications */}
        <Pressable onPress={onOpenAzanPrefs} style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
              {t('azanAudioReminders')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              Makkah Haram • 15m pre-reminder
            </AppText>
          </View>
          {ChevronRight}
        </Pressable>

        {onVerifyAlAdhan && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <Pressable onPress={onVerifyAlAdhan} style={styles.row}>
              <View style={styles.textCol}>
                <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                  Verify Times (AlAdhan API)
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Optional independent ephemeris check
                </AppText>
              </View>
              <View style={[styles.pillBadge, { backgroundColor: theme.colors.surfaceSubtle }]}>
                <AppText variant="caption" color={theme.colors.accent} style={styles.pillText}>
                  Compare
                </AppText>
              </View>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: SPACING.xs + 2 },
  sectionLabel: { fontWeight: '800', letterSpacing: 0.8, paddingHorizontal: SPACING.xs },
  card: { borderRadius: RADIUS.xl, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  textCol: { flex: 1, gap: 2, paddingRight: SPACING.sm },
  rowTitle: { fontWeight: '700' },
  pillBadge: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full },
  pillText: { fontWeight: '700' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSign: { fontSize: 18, lineHeight: 20, fontWeight: '700' },
  offsetPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    minWidth: 32,
    alignItems: 'center',
  },
  offsetText: { fontWeight: '800', fontSize: 11 },
  divider: { height: 1, width: '100%' },
});
