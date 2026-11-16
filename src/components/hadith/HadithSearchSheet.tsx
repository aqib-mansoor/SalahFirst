import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, TextInput, FlatList, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import {
  VERIFIED_HADITHS,
  HadithItem,
  HadithCategoryId,
  getHadithIndicesForCategory,
  getHadithReflection,
} from '@/data/hadiths';

export interface HadithSearchSheetProps {
  visible: boolean;
  currentIndex: number;
  selectedCategory: HadithCategoryId;
  onSelectHadith: (index: number) => void;
  onClose: () => void;
}

interface PreIndexedHadith {
  item: HadithItem;
  idx: number;
  searchCorpus: string;
}

// Pre-index searchable text once at module load to avoid repeated runtime string operations
const PRE_INDEXED_HADITHS: PreIndexedHadith[] = VERIFIED_HADITHS.map((item, idx) => {
  const reflectionEn = getHadithReflection(item, idx, 'en');
  const reflectionUr = getHadithReflection(item, idx, 'ur');
  const reflectionAr = getHadithReflection(item, idx, 'ar');
  const searchCorpus = [
    item.english,
    item.urdu,
    item.arabic,
    item.badge,
    item.source,
    item.reference,
    reflectionEn,
    reflectionUr,
    reflectionAr,
    `#${idx + 1}`,
    `${idx + 1}`,
  ]
    .join(' ')
    .toLowerCase();

  return { item, idx, searchCorpus };
});

export const HadithSearchSheet: React.FC<HadithSearchSheetProps> = ({
  visible,
  currentIndex,
  selectedCategory,
  onSelectHadith,
  onClose,
}) => {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const [query, setQuery] = useState('');

  const matchingItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const baseIndices = getHadithIndicesForCategory(selectedCategory);
      return baseIndices.map((idx) => PRE_INDEXED_HADITHS[idx]);
    }
    return PRE_INDEXED_HADITHS.filter((entry) => entry.searchCorpus.includes(q));
  }, [selectedCategory, query]);

  const HeaderIcon = useMemo(
    () => (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="7" stroke={theme.colors.accent} strokeWidth="2.2" />
        <Path d="M20 20L16.2 16.2" stroke={theme.colors.accent} strokeWidth="2.2" strokeLinecap="round" />
      </Svg>
    ),
    [theme.colors.accent]
  );

  const renderHadithRow = useCallback(
    ({ item: { item, idx } }: { item: PreIndexedHadith }) => {
      const isSelected = idx === currentIndex;
      const takeaway = getHadithReflection(item, idx, language);

      return (
        <Pressable
          onPress={() => {
            onSelectHadith(idx);
            onClose();
          }}
          style={({ pressed }) => [
            styles.rowCard,
            {
              backgroundColor: isSelected ? theme.colors.secondaryTint : theme.colors.surface,
              borderColor: isSelected ? theme.colors.primary : theme.colors.border,
              opacity: pressed ? 0.84 : 1,
            },
          ]}
        >
          <View style={styles.topRow}>
            <View
              style={[
                styles.indexPill,
                { backgroundColor: theme.colors.accentTint, borderColor: theme.colors.accent },
              ]}
            >
              <AppText variant="caption" color={theme.colors.warning} style={styles.indexText}>
                #{idx + 1}
              </AppText>
            </View>
            <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText} numberOfLines={1}>
              {item.badge}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.sourceText} numberOfLines={1}>
              {item.source} • {item.reference}
            </AppText>
          </View>

          <AppText variant="bodySmall" color={theme.colors.textPrimary} numberOfLines={2} style={styles.englishText}>
            {language === 'ur' ? item.urdu : item.english}
          </AppText>

          <AppText variant="caption" color={theme.colors.primary} numberOfLines={1} style={styles.takeawayPreview}>
            {t('hadithTakeawayLabel')} • {takeaway}
          </AppText>
        </Pressable>
      );
    },
    [currentIndex, language, onSelectHadith, onClose, t, theme]
  );

  const keyExtractor = useCallback((entry: PreIndexedHadith) => entry.item.id, []);

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title={t('searchAllHadithsTitle')}
      badgeText={`${matchingItems.length}/${VERIFIED_HADITHS.length}`}
      subtitleText={t('dailyHadithWisdom')}
      icon={HeaderIcon}
      maxHeight="86%"
      containerStyle={styles.sheetOverride}
    >
      {/* Search Bar */}
      <View
        style={[
          styles.searchBox,
          { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border },
        ]}
      >
        <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={theme.colors.textMuted} strokeWidth="2" />
          <Path d="M20 20L16.2 16.2" stroke={theme.colors.textMuted} strokeWidth="2" strokeLinecap="round" />
        </Svg>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchHadithsPlaceholder')}
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.searchInput, { color: theme.colors.textPrimary }]}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6L18 18" stroke={theme.colors.textMuted} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </Pressable>
        )}
      </View>

      {/* Virtualized FlatList for 0-Lag Instant Display */}
      <FlatList
        data={matchingItems}
        keyExtractor={keyExtractor}
        renderItem={renderHadithRow}
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText variant="bodySmall" color={theme.colors.textMuted}>
              {t('noMatchingHadiths')}
            </AppText>
          </View>
        }
      />
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetOverride: {
    paddingHorizontal: SPACING.lg,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 4,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 2,
  },
  scrollList: {
    maxHeight: 420,
  },
  scrollContent: {
    gap: SPACING.xs + 4,
    paddingVertical: SPACING.xs,
  },
  rowCard: {
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indexPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  indexText: {
    fontWeight: '800',
    fontSize: 10,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10.5,
    flexShrink: 1,
  },
  sourceText: {
    fontSize: 10.5,
    marginLeft: 'auto',
    fontWeight: '600',
  },
  englishText: {
    lineHeight: 18,
    fontSize: 12.5,
  },
  takeawayPreview: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
});
