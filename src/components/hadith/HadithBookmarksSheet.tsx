import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Modal, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
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
  const insets = useSafeAreaInsets();
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom + 16, 24),
            },
          ]}
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheetContainer: {
    maxHeight: '85%',
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
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
