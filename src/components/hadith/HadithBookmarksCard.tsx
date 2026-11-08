import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { HadithItem, VERIFIED_HADITHS } from '@/data/hadiths';
import { HadithBookmarkRow } from './HadithBookmarkRow';

export interface HadithBookmarksCardProps {
  savedHadiths: HadithItem[];
  currentIndex: number;
  onSelectHadith: (index: number) => void;
  onOpenAllBookmarks: () => void;
}

const MAX_PREVIEW_ITEMS = 3;

export const HadithBookmarksCard: React.FC<HadithBookmarksCardProps> = ({
  savedHadiths,
  currentIndex,
  onSelectHadith,
  onOpenAllBookmarks,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSelectBookmark = (hadithId: string) => {
    const idx = VERIFIED_HADITHS.findIndex((h) => h.id === hadithId);
    if (idx !== -1) {
      onSelectHadith(idx);
    }
  };

  const previewItems = savedHadiths.slice(0, MAX_PREVIEW_ITEMS);
  const hasMore = savedHadiths.length > MAX_PREVIEW_ITEMS;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* Header with Warm Gold Bookmark Badge */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
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
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldTitle}>
              {t('savedBookmarks')}
            </AppText>
          </View>

          <Pressable
            onPress={onOpenAllBookmarks}
            hitSlop={6}
            style={[
              styles.countBadge,
              {
                backgroundColor: theme.colors.accentTint,
                borderColor: theme.colors.accent,
              },
            ]}
          >
            <AppText variant="caption" color={theme.colors.warning} style={styles.countText}>
              {savedHadiths.length} {t('saved')}
            </AppText>
          </Pressable>
        </View>

        {/* Content: Top 3 Preview Rows OR Clean Empty State */}
        {savedHadiths.length > 0 ? (
          <View style={styles.rowsList}>
            {previewItems.map((item) => {
              const itemIdx = VERIFIED_HADITHS.findIndex((h) => h.id === item.id);
              const isSelected = itemIdx === currentIndex;

              return (
                <HadithBookmarkRow
                  key={item.id}
                  item={item}
                  itemIndex={itemIdx}
                  isSelected={isSelected}
                  onSelect={() => handleSelectBookmark(item.id)}
                />
              );
            })}

            {/* View All Button when > 3 items */}
            {hasMore && (
              <Pressable
                onPress={onOpenAllBookmarks}
                accessibilityRole="button"
                accessibilityLabel={`View all ${savedHadiths.length} saved bookmarks`}
                style={({ pressed }) => [
                  styles.viewAllBtn,
                  {
                    backgroundColor: theme.colors.surfaceElevated,
                    borderColor: theme.colors.border,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <AppText
                  variant="caption"
                  color={theme.colors.primary}
                  style={styles.viewAllText}
                >
                  {t('viewAllBookmarks', { count: savedHadiths.length }) || `View All (${savedHadiths.length})`}
                </AppText>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke={theme.colors.primary}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.emptyText}>
              {t('noBookmarksYet')}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.sm + 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldTitle: {
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  countText: {
    fontWeight: '800',
    fontSize: 11,
  },
  rowsList: {
    gap: SPACING.xs + 2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 6,
    marginTop: 2,
  },
  viewAllText: {
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
