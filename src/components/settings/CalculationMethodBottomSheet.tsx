import React from 'react';
import { Modal, StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
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
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  if (!visible) return null;

  const handleSelect = (method: CalculationMethodName) => {
    onSelectMethod(method);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, SPACING.lg),
            },
          ]}
        >
          <View style={styles.handleBar}>
            <View style={[styles.handleIndicator, { backgroundColor: theme.colors.border }]} />
          </View>

          <View style={styles.header}>
            <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.title}>
              {t('calculationMethod')}
            </AppText>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke={theme.colors.textSecondary} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.list}>
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    maxHeight: '78%',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: SPACING.md,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
  },
  handleIndicator: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.full,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  title: {
    fontWeight: '700',
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  scrollArea: {
    flexGrow: 0,
  },
  list: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    paddingBottom: SPACING.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 3,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
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
