import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { HadithItem, VERIFIED_HADITHS } from '@/data/hadiths';

export interface HadithBookmarksCardProps {
  savedHadiths: HadithItem[];
  currentIndex: number;
  onSelectHadith: (index: number) => void;
}

export const HadithBookmarksCard: React.FC<HadithBookmarksCardProps> = ({
  savedHadiths,
  currentIndex,
  onSelectHadith,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSelectBookmark = (hadithId: string) => {
    const idx = VERIFIED_HADITHS.findIndex((h) => h.id === hadithId);
    if (idx !== -1) {
      onSelectHadith(idx);
    }
  };

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint }]}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z"
                  fill={theme.colors.primary}
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                />
              </Svg>
            </View>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldTitle}>
              {t('savedBookmarks')}
            </AppText>
          </View>

          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <AppText variant="caption" color={theme.colors.primary} style={styles.countText}>
              {savedHadiths.length} {t('saved')}
            </AppText>
          </View>
        </View>

        {/* Content: List of Bookmarks OR Empty State */}
        {savedHadiths.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookmarkScroll}
          >
            {savedHadiths.map((item) => {
              const itemIdx = VERIFIED_HADITHS.findIndex((h) => h.id === item.id);
              const isSelected = itemIdx === currentIndex;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleSelectBookmark(item.id)}
                  hitSlop={4}
                  accessibilityRole="button"
                  accessibilityLabel={`Hadith ${itemIdx + 1}: ${item.badge}`}
                  style={[
                    styles.bookmarkChip,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.secondaryTint
                        : theme.colors.surfaceElevated,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                    },
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={isSelected ? theme.colors.primary : theme.colors.text}
                    style={styles.chipNumber}
                  >
                    #{itemIdx + 1}
                  </AppText>
                  <AppText
                    variant="caption"
                    color={isSelected ? theme.colors.primary : theme.colors.textMuted}
                    style={styles.chipBadge}
                    numberOfLines={1}
                  >
                    {item.badge}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>
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
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
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
    gap: SPACING.xs + 4,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bookmarkScroll: {
    gap: SPACING.xs + 2,
    paddingVertical: 2,
  },
  bookmarkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  chipNumber: {
    fontWeight: '800',
    fontSize: 11,
  },
  chipBadge: {
    fontWeight: '600',
    fontSize: 11,
    maxWidth: 130,
  },
  emptyContainer: {
    paddingVertical: SPACING.xs,
  },
  emptyText: {
    fontSize: 11,
    lineHeight: 16,
  },
});

