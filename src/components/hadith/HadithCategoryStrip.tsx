import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation, TranslationKey } from '@/context/LocalizationContext';
import { HadithCategoryId } from '@/data/hadiths';

export interface HadithCategoryStripProps {
  selectedCategory: HadithCategoryId;
  onSelectCategory: (category: HadithCategoryId) => void;
  onOpenSearch: () => void;
}

const CATEGORIES: { id: HadithCategoryId; labelKey: TranslationKey; count: number }[] = [
  { id: 'all', labelKey: 'filterAll', count: 140 },
  { id: 'youth', labelKey: 'hadithCatYouth', count: 20 },
  { id: 'peace', labelKey: 'hadithCatPeace', count: 20 },
  { id: 'salah', labelKey: 'hadithCatSalah', count: 20 },
  { id: 'wudu', labelKey: 'hadithCatWudu', count: 20 },
  { id: 'khushoo', labelKey: 'hadithCatKhushoo', count: 20 },
  { id: 'congregation', labelKey: 'hadithCatCongregation', count: 20 },
  { id: 'character', labelKey: 'hadithCatCharacter', count: 20 },
];

export const HadithCategoryStrip: React.FC<HadithCategoryStripProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Search 100 Hadiths Pill Button */}
        <Pressable
          onPress={onOpenSearch}
          accessibilityRole="button"
          accessibilityLabel={t('searchAllHadithsTitle')}
          style={({ pressed }) => [
            styles.searchPill,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.78 : 1,
            },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Circle cx="11" cy="11" r="7" stroke={theme.colors.primary} strokeWidth="2.2" />
            <Path d="M20 20L16.2 16.2" stroke={theme.colors.primary} strokeWidth="2.2" strokeLinecap="round" />
          </Svg>
          <AppText variant="caption" color={theme.colors.primary} style={styles.searchPillText}>
            {t('hadithSearchBtn')}
          </AppText>
        </Pressable>

        {/* Thematic Category Pills */}
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: isActive ? theme.colors.primary : theme.colors.border,
                  opacity: pressed ? 0.82 : 1,
                },
              ]}
            >
              <AppText
                variant="caption"
                color={isActive ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                style={styles.chipText}
              >
                {t(cat.labelKey)} ({cat.count})
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: -4,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: 8,
    alignItems: 'center',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  searchPillText: {
    fontWeight: '800',
    fontSize: 11.5,
  },
  chip: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: '700',
    fontSize: 11.5,
  },
});
