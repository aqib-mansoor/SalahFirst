import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { HadithItem, VERIFIED_HADITHS } from '@/data/hadiths';
import { HadithBookmarksSheetHeader } from './HadithBookmarksSheetHeader';
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

          {/* Quick Collection Filter Chips */}
          {sources.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTrack}
            >
              <Pressable
                onPress={() => setSelectedSource('all')}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selectedSource === 'all'
                      ? theme.colors.primary
                      : theme.colors.surfaceElevated,
                    borderColor: selectedSource === 'all'
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={selectedSource === 'all' ? theme.colors.textInverse : theme.colors.text}
                  style={styles.filterChipText}
                >
                  {t('filterAll') || 'All'} ({savedHadiths.length})
                </AppText>
              </Pressable>

              {sources.map((src) => {
                const count = savedHadiths.filter((h) => h.source.includes(src)).length;
                const active = selectedSource === src;
                return (
                  <Pressable
                    key={src}
                    onPress={() => setSelectedSource(active ? 'all' : src)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: active
                          ? theme.colors.primary
                          : theme.colors.surfaceElevated,
                        borderColor: active
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      color={active ? theme.colors.textInverse : theme.colors.text}
                      style={styles.filterChipText}
                    >
                      {src} ({count})
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* Search Input when 4+ saved items */}
          {savedHadiths.length >= 4 && (
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke={theme.colors.textMuted}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('searchBookmarks') || 'Search bookmarks...'}
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.searchInput, { color: theme.colors.text }]}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M18 6L6 18M6 6L18 18"
                      stroke={theme.colors.textMuted}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </Svg>
                </Pressable>
              )}
            </View>
          )}

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
  filterTrack: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
    paddingBottom: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontWeight: '700',
    fontSize: 11,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs + 2,
    marginBottom: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
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
