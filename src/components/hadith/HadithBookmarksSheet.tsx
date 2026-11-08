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
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handleBar, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.accentTint }]}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z"
                    fill={theme.colors.accent}
                    stroke={theme.colors.accent}
                    strokeWidth="2"
                  />
                </Svg>
              </View>
              <AppText variant="titleMedium" color={theme.colors.text} style={styles.titleText}>
                {t('savedBookmarks')}
              </AppText>
              <View style={[styles.countBadge, { backgroundColor: theme.colors.accentTint, borderColor: theme.colors.accent }]}>
                <AppText variant="caption" color={theme.colors.warning} style={styles.countText}>
                  {savedHadiths.length}
                </AppText>
              </View>
            </View>

            <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6L18 18"
                  stroke={theme.colors.textMuted}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </Svg>
            </Pressable>
          </View>

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
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.full,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 3,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: '800',
  },
  countBadge: {
    paddingHorizontal: SPACING.xs + 3,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  countText: {
    fontWeight: '800',
    fontSize: 11,
  },
  closeBtn: {
    padding: SPACING.xs,
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
