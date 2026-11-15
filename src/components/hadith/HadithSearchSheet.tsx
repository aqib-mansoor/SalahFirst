import React, { useState, useMemo } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { VERIFIED_HADITHS, HadithCategoryId, getHadithIndicesForCategory } from '@/data/hadiths';

export interface HadithSearchSheetProps {
  visible: boolean;
  currentIndex: number;
  selectedCategory: HadithCategoryId;
  onSelectHadith: (index: number) => void;
  onClose: () => void;
}

export const HadithSearchSheet: React.FC<HadithSearchSheetProps> = ({
  visible,
  currentIndex,
  selectedCategory,
  onSelectHadith,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const matchingItems = useMemo(() => {
    const baseIndices = getHadithIndicesForCategory(selectedCategory);
    const q = query.trim().toLowerCase();
    return baseIndices
      .map((idx) => ({ item: VERIFIED_HADITHS[idx], idx }))
      .filter(({ item, idx }) => {
        if (!q) return true;
        return (
          item.english.toLowerCase().includes(q) ||
          item.urdu.includes(q) ||
          item.arabic.includes(q) ||
          item.badge.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.reference.toLowerCase().includes(q) ||
          `#${idx + 1}` === q ||
          `${idx + 1}` === q
        );
      });
  }, [selectedCategory, query]);

  const HeaderIcon = (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={theme.colors.accent} strokeWidth="2.2" />
      <Path d="M20 20L16.2 16.2" stroke={theme.colors.accent} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title={t('searchAllHadithsTitle')}
      badgeText={`${matchingItems.length}/${VERIFIED_HADITHS.length}`}
      subtitle={t('dailyHadithWisdom')}
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
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6L18 18" stroke={theme.colors.textMuted} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </Pressable>
        )}
      </View>

      {/* Scrollable Results */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {matchingItems.map(({ item, idx }) => {
          const isSelected = idx === currentIndex;
          return (
            <Pressable
              key={item.id}
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
                <View style={[styles.indexPill, { backgroundColor: theme.colors.accentTint, borderColor: theme.colors.accent }]}>
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
                “{item.english}”
              </AppText>
            </Pressable>
          );
        })}

        {matchingItems.length === 0 && (
          <View style={styles.emptyState}>
            <AppText variant="bodySmall" color={theme.colors.textMuted}>
              {t('noMatchingHadiths')}
            </AppText>
          </View>
        )}
      </ScrollView>
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
  emptyState: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
});
