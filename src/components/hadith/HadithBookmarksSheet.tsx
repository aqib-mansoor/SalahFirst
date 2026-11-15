import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppBottomSheet } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { HadithItem, VERIFIED_HADITHS } from '@/data/hadiths';
import { HadithBookmarksSheetHeader } from './HadithBookmarksSheetHeader';
import { HadithBookmarksSheetFilter } from './HadithBookmarksSheetFilter';
import { HadithSavedCardItem } from './HadithSavedCardItem';

export interface HadithBookmarksSheetProps {
  visible: boolean;
  savedHadiths: HadithItem[];
  currentIndex: number;
  onSelectHadith: (index: number) => void;
  onRemoveBookmark: (hadithId: string) => void;
  onClose: () => void;
}

export const HadithBookmarksSheet: React.FC<HadithBookmarksSheetProps> = ({
  visible,
  savedHadiths,
  currentIndex,
  onSelectHadith,
  onRemoveBookmark,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Extract unique sources for filter chips (e.g. Bukhari, Muslim)
  const sources = useMemo(() => {
    const list: string[] = [];
    savedHadiths.forEach((h) => {
      const name = h.source.replace('Sahih ', '').trim();
      if (!list.includes(name)) list.push(name);
    });
    return list;
  }, [savedHadiths]);

  const filteredHadiths = useMemo(() => {
    let result = savedHadiths;

    if (selectedSource !== 'all') {
      result = result.filter((h) => h.source.includes(selectedSource));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.english.toLowerCase().includes(q) ||
          h.badge.toLowerCase().includes(q) ||
          h.source.toLowerCase().includes(q) ||
          h.arabic.includes(q)
      );
    }

    return result;
  }, [savedHadiths, selectedSource, searchQuery]);

  const handleSelect = (hadithId: string) => {
    const idx = VERIFIED_HADITHS.findIndex((h) => h.id === hadithId);
    if (idx !== -1) {
      onSelectHadith(idx);
      onClose();
    }
  };

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      maxHeight="85%"
      containerStyle={styles.sheetOverride}
    >
      {/* Header */}
      <HadithBookmarksSheetHeader
        totalCount={savedHadiths.length}
        onClose={onClose}
      />

      {/* Quick Collection Filters & Search Bar */}
      <HadithBookmarksSheetFilter
        totalCount={savedHadiths.length}
        sources={sources}
        selectedSource={selectedSource}
        searchQuery={searchQuery}
        onSelectSource={setSelectedSource}
        onChangeSearchQuery={setSearchQuery}
        getSourceCount={(src) => savedHadiths.filter((h) => h.source.includes(src)).length}
      />

      {/* Scrollable list of Rich Mini-Cards */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {filteredHadiths.map((item) => {
          const itemIdx = VERIFIED_HADITHS.findIndex((h) => h.id === item.id);
          const isSelected = itemIdx === currentIndex;

          return (
            <HadithSavedCardItem
              key={item.id}
              item={item}
              itemIndex={itemIdx}
              isSelected={isSelected}
              onSelect={() => handleSelect(item.id)}
              onRemove={() => onRemoveBookmark(item.id)}
            />
          );
        })}

        {filteredHadiths.length === 0 && (
          <View style={styles.emptyState}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {t('noMatchingBookmarks') || 'No bookmarks match your search.'}
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
  scrollList: {
    maxHeight: 440,
  },
  scrollContent: {
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  emptyState: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
});
