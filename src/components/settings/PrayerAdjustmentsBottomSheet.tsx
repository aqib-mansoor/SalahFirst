import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet, PrayerTimeIcon } from '@/components/common';
import { useTranslation, TranslationKey } from '@/context/LocalizationContext';
import { PrayerMinuteAdjustments } from '@/types';
import { DEFAULT_PRAYER_ADJUSTMENTS } from '@/utils/prayerCalculationBase';
import { triggerHaptic } from '@/utils/haptics';

export interface PrayerAdjustmentsBottomSheetProps {
  visible: boolean;
  adjustments: PrayerMinuteAdjustments;
  currentTimes: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  onUpdateAdjustments: (updated: PrayerMinuteAdjustments) => void;
  onClose: () => void;
}

interface PrayerAdjItem {
  key: keyof PrayerMinuteAdjustments;
  labelKey: TranslationKey;
  iconPrayer: string;
}

const PRAYER_ITEMS: PrayerAdjItem[] = [
  { key: 'fajr', labelKey: 'fajr', iconPrayer: 'Fajr' },
  { key: 'sunrise', labelKey: 'sunrise', iconPrayer: 'Sunrise' },
  { key: 'dhuhr', labelKey: 'dhuhr', iconPrayer: 'Dhuhr' },
  { key: 'asr', labelKey: 'asr', iconPrayer: 'Asr' },
  { key: 'maghrib', labelKey: 'maghrib', iconPrayer: 'Maghrib' },
  { key: 'isha', labelKey: 'isha', iconPrayer: 'Isha' },
];

export const PrayerAdjustmentsBottomSheet: React.FC<PrayerAdjustmentsBottomSheetProps> = ({
  visible,
  adjustments,
  currentTimes,
  onUpdateAdjustments,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const hasNonZero = Object.values(adjustments).some((v) => v !== 0);

  const handleStep = (key: keyof PrayerMinuteAdjustments, delta: number) => {
    const current = adjustments[key] || 0;
    const next = Math.max(-30, Math.min(30, current + delta));
    if (next === current) return;
    triggerHaptic('light');
    onUpdateAdjustments({ ...adjustments, [key]: next });
  };

  const handleResetAll = () => {
    if (!hasNonZero) return;
    triggerHaptic('medium');
    onUpdateAdjustments({ ...DEFAULT_PRAYER_ADJUSTMENTS });
  };

  const headerIcon = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={theme.colors.primary} strokeWidth="2.2" />
      <Path
        d="M12 7v5l3 3"
        stroke={theme.colors.primary}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title={t('prayerTimeAdjustmentsTitle')}
      badgeText="±30m"
      subtitleText={t('prayerTimeAdjustmentsSub')}
      icon={headerIcon}
    >
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={styles.scrollArea}>
        <View
          style={[
            styles.listCard,
            {
              backgroundColor: theme.isDark ? theme.colors.surfaceSubtle : theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {PRAYER_ITEMS.map((item, idx) => {
            const val = adjustments[item.key] || 0;
            const timeStr = currentTimes[item.key] || '--:--';
            const formattedOffset = val > 0 ? `+${val}m` : `${val}m`;

            return (
              <View
                key={item.key}
                style={[styles.row, idx > 0 && [styles.rowBorder, { borderColor: theme.colors.border }]]}
              >
                <View style={styles.leftCol}>
                  <PrayerTimeIcon prayer={item.iconPrayer} size={22} />
                  <View style={styles.textCol}>
                    <AppText variant="bodyMedium" color={theme.colors.textPrimary} style={styles.prayerTitle}>
                      {t(item.labelKey)}
                    </AppText>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      {timeStr}
                    </AppText>
                  </View>
                </View>

                <View style={styles.stepper}>
                  <Pressable
                    onPress={() => handleStep(item.key, -1)}
                    disabled={val <= -30}
                    hitSlop={6}
                    style={({ pressed }) => [
                      styles.stepBtn,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        opacity: val <= -30 ? 0.35 : pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.stepSign}>
                      −
                    </AppText>
                  </Pressable>

                  <View
                    style={[
                      styles.valuePill,
                      {
                        backgroundColor: val !== 0 ? theme.colors.secondaryTint : theme.colors.surface,
                        borderColor: val !== 0 ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      color={val !== 0 ? theme.colors.primary : theme.colors.textSecondary}
                      style={styles.valueText}
                    >
                      {formattedOffset}
                    </AppText>
                  </View>

                  <Pressable
                    onPress={() => handleStep(item.key, 1)}
                    disabled={val >= 30}
                    hitSlop={6}
                    style={({ pressed }) => [
                      styles.stepBtn,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        opacity: val >= 30 ? 0.35 : pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.stepSign}>
                      +
                    </AppText>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footerRow}>
        {hasNonZero && (
          <Pressable
            onPress={handleResetAll}
            style={({ pressed }) => [
              styles.resetBtn,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderColor: theme.colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <AppText variant="caption" color={theme.colors.textSecondary} style={styles.resetText}>
              {t('resetAllAdjustments')}
            </AppText>
          </Pressable>
        )}

        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.doneBtn,
            { backgroundColor: theme.colors.primary, opacity: pressed ? 0.88 : 1 },
          ]}
        >
          <AppText variant="bodyMedium" color={theme.colors.textOnPrimary} style={styles.doneText}>
            {t('save')}
          </AppText>
        </Pressable>
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollArea: { maxHeight: 380 },
  listCard: { borderRadius: RADIUS.lg, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
  },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth },
  leftCol: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm + 2, flex: 1 },
  textCol: { gap: 1 },
  prayerTitle: { fontWeight: '700' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSign: { fontSize: 16, lineHeight: 18, fontWeight: '600' },
  valuePill: {
    minWidth: 46,
    paddingHorizontal: SPACING.xs + 3,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
  },
  valueText: { fontWeight: '800', fontSize: 11.5 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.md },
  resetBtn: {
    height: 44,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: { fontWeight: '700' },
  doneBtn: { flex: 1, height: 44, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center' },
  doneText: { fontWeight: '700', letterSpacing: 0.3 },
});
