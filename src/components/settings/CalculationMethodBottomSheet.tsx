import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet } from '@/components/common';
import { useTranslation, TranslationKey } from '@/context/LocalizationContext';
import { CalculationMethodName } from '@/types';

export interface CalculationMethodBottomSheetProps {
  visible: boolean;
  selectedMethod: CalculationMethodName;
  onSelectMethod: (method: CalculationMethodName) => void;
  onClose: () => void;
}

interface CalcMethodItem {
  id: CalculationMethodName;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

export const CALCULATION_METHODS_LIST: CalcMethodItem[] = [
  { id: 'Karachi', titleKey: 'calcMethodKarachi', descKey: 'calcMethodKarachiDesc' },
  { id: 'UmmAlQura', titleKey: 'calcMethodUmmAlQura', descKey: 'calcMethodUmmAlQuraDesc' },
  { id: 'MuslimWorldLeague', titleKey: 'calcMethodMuslimWorldLeague', descKey: 'calcMethodMuslimWorldLeagueDesc' },
  { id: 'NorthAmerica', titleKey: 'calcMethodNorthAmerica', descKey: 'calcMethodNorthAmericaDesc' },
  { id: 'Egyptian', titleKey: 'calcMethodEgyptian', descKey: 'calcMethodEgyptianDesc' },
  { id: 'Dubai', titleKey: 'calcMethodDubai', descKey: 'calcMethodDubaiDesc' },
  { id: 'MoonsightingCommittee', titleKey: 'calcMethodMoonsightingCommittee', descKey: 'calcMethodMoonsightingCommitteeDesc' },
  { id: 'Qatar', titleKey: 'calcMethodQatar', descKey: 'calcMethodQatarDesc' },
  { id: 'Kuwait', titleKey: 'calcMethodKuwait', descKey: 'calcMethodKuwaitDesc' },
  { id: 'Singapore', titleKey: 'calcMethodSingapore', descKey: 'calcMethodSingaporeDesc' },
  { id: 'Turkey', titleKey: 'calcMethodTurkey', descKey: 'calcMethodTurkeyDesc' },
  { id: 'Tehran', titleKey: 'calcMethodTehran', descKey: 'calcMethodTehranDesc' },
];

export const CalculationMethodBottomSheet: React.FC<CalculationMethodBottomSheetProps> = ({
  visible,
  selectedMethod,
  onSelectMethod,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSelect = (method: CalculationMethodName) => {
    onSelectMethod(method);
    onClose();
  };

  const headerIcon = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={theme.colors.primary} strokeWidth="2.2" />
      <Path
        d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
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
      title={t('calculationMethod')}
      badgeText={selectedMethod}
      subtitleText={t('offlineFirst')}
      icon={headerIcon}
    >
      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View
          style={[
            styles.listCard,
            {
              backgroundColor: theme.isDark
                ? theme.colors.surfaceSubtle
                : theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {CALCULATION_METHODS_LIST.map((item, idx) => {
            const isSelected = selectedMethod === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelect(item.id)}
                style={({ pressed }) => [
                  styles.optionRow,
                  idx > 0 && [styles.rowBorder, { borderColor: theme.colors.border }],
                  isSelected && { backgroundColor: theme.colors.secondaryTint },
                  pressed && { opacity: 0.75 },
                ]}
              >
                <View style={styles.textCol}>
                  <AppText
                    variant="bodyMedium"
                    color={isSelected ? theme.colors.primary : theme.colors.textPrimary}
                    style={[styles.methodTitle, isSelected && styles.selectedTitle]}
                  >
                    {t(item.titleKey)}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    {t(item.descKey)}
                  </AppText>
                </View>

                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary }]}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M20 6L9 17l-5-5"
                        stroke={theme.colors.textOnPrimary}
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    maxHeight: 420,
  },
  listCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 3,
    paddingHorizontal: SPACING.md,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textCol: {
    flex: 1,
    gap: 2,
    paddingRight: SPACING.sm,
  },
  methodTitle: {
    fontWeight: '600',
  },
  selectedTitle: {
    fontWeight: '700',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
