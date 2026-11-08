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
import { HadithBookmarkRow } from './HadithBookmarkRow';
import { HadithBookmarksSheetHeader } from './HadithBookmarksSheetHeader';

export interface HadithBookmarksSheetProps {
  visible: boolean;
  savedHadiths: HadithItem[];
  currentIndex: number;
  onSelectHadith: (index: number) => void;
  onClose: () => void;
}

export const HadithBookmarksSheet: React.FC<HadithBookmarksSheetProps> = ({
  visible,
  savedHadiths,
  currentIndex,
  onSelectHadith,
  onClose,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHadiths = useMemo(() => {
    if (!searchQuery.trim()) return savedHadiths;
    const query = searchQuery.toLowerCase().trim();
    return savedHadiths.filter(
      (h) =>
        h.english.toLowerCase().includes(query) ||
        h.badge.toLowerCase().includes(query) ||
        h.source.toLowerCase().includes(query) ||
        h.arabic.includes(query)
    );
  }, [savedHadiths, searchQuery]);

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

          {/* Search Input when 5+ saved items */}
          {savedHadiths.length >= 5 && (
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
            </View>
          )}

          {/* Scrollable list of all saved items */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredHadiths.map((item) => {
              const itemIdx = VERIFIED_HADITHS.findIndex((h) => h.id === item.id);
              const isSelected = itemIdx === currentIndex;

              return (
                <HadithBookmarkRow
                  key={item.id}
                  item={item}
                  itemIndex={itemIdx}
                  isSelected={isSelected}
                  onSelect={() => handleSelect(item.id)}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheetContainer: {
    maxHeight: '80%',
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
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
    maxHeight: 400,
  },
  scrollContent: {
    gap: SPACING.xs + 2,
    paddingVertical: SPACING.xs,
  },
  emptyState: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
});
