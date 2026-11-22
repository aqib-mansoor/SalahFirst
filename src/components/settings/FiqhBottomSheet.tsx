import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Switch } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet } from '@/components/common';
import { useTranslation, TranslationKey } from '@/context/LocalizationContext';
import { FiqhName } from '@/types';
import { FIQH_OPTIONS, getFiqhDetails } from '@/constants/fiqh';
import { triggerHaptic } from '@/utils/haptics';

export interface FiqhBottomSheetProps {
  visible: boolean;
  selectedFiqh: FiqhName;
  onSelectFiqh: (fiqh: FiqhName, applyRecommendedCalc: boolean) => void;
  onClose: () => void;
}

export const FiqhBottomSheet: React.FC<FiqhBottomSheetProps> = ({
  visible,
  selectedFiqh,
  onSelectFiqh,
  onClose,
}) => {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const [applyRecommended, setApplyRecommended] = useState<boolean>(true);

  const activeDetails = getFiqhDetails(selectedFiqh);
  const activeTitle = language === 'ar' ? activeDetails.titleAr : language === 'ur' ? activeDetails.titleUr : activeDetails.titleEn;

  const handleSelect = (fiqh: FiqhName) => {
    triggerHaptic();
    onSelectFiqh(fiqh, applyRecommended);
    onClose();
  };

  const headerIcon = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="5" stroke={theme.colors.primary} strokeWidth="2.2" />
      <Path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke={theme.colors.primary}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title={t('selectFiqh')}
      badgeText={activeTitle}
      subtitleText={t('offlineFirst')}
      icon={headerIcon}
    >
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Toggle: Apply Recommended Calculation Method */}
        <View
          style={[
            styles.syncCard,
            {
              backgroundColor: theme.isDark ? theme.colors.surfaceSubtle : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.syncTextCol}>
            <AppText variant="caption" color={theme.colors.textPrimary} style={styles.syncTitle}>
              {t('applyFiqhRecommendedCalc')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary} style={styles.syncDesc}>
              {t('applyFiqhRecommendedCalcDesc')}
            </AppText>
          </View>
          <Switch
            value={applyRecommended}
            onValueChange={setApplyRecommended}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>

        {/* Fiqh Options List */}
        <View
          style={[
            styles.listCard,
            {
              backgroundColor: theme.isDark ? theme.colors.surfaceSubtle : theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {FIQH_OPTIONS.map((item, idx) => {
            const isSelected = selectedFiqh === item.id;
            const itemTitle = language === 'ar' ? item.titleAr : language === 'ur' ? item.titleUr : item.titleEn;

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
                  <View style={styles.nameHeader}>
                    <AppText
                      variant="titleSmall"
                      color={isSelected ? theme.colors.primary : theme.colors.textPrimary}
                      style={styles.nameText}
                    >
                      {itemTitle} • {item.titleAr}
                    </AppText>
                  </View>
                  <AppText variant="caption" color={theme.colors.textSecondary} style={styles.descText}>
                    {t(item.descKey as TranslationKey)}
                  </AppText>
                </View>

                {isSelected ? (
                  <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary }]}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                ) : (
                  <View style={[styles.emptyRadio, { borderColor: theme.colors.border }]} />
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
    maxHeight: 460,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  syncTextCol: {
    flex: 1,
    marginRight: SPACING.md,
  },
  syncTitle: {
    fontWeight: '700',
    marginBottom: 2,
  },
  syncDesc: {
    fontSize: 11,
    lineHeight: 15,
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
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textCol: {
    flex: 1,
    marginRight: SPACING.md,
  },
  nameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontWeight: '700',
    marginRight: SPACING.sm,
  },
  descText: {
    fontSize: 12,
    lineHeight: 16,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
});
