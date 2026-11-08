import React from 'react';
import { StyleSheet, View, Pressable, TextInput, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface HadithBookmarksSheetFilterProps {
  totalCount: number;
  sources: string[];
  selectedSource: string;
  searchQuery: string;
  onSelectSource: (source: string) => void;
  onChangeSearchQuery: (query: string) => void;
  getSourceCount: (source: string) => number;
}

export const HadithBookmarksSheetFilter: React.FC<HadithBookmarksSheetFilterProps> = ({
  totalCount,
  sources,
  selectedSource,
  searchQuery,
  onSelectSource,
  onChangeSearchQuery,
  getSourceCount,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Quick Collection Filter Chips */}
      {sources.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTrack}
        >
          <Pressable
            onPress={() => onSelectSource('all')}
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
              {t('filterAll') || 'All'} ({totalCount})
            </AppText>
          </Pressable>

          {sources.map((src) => {
            const count = getSourceCount(src);
            const active = selectedSource === src;
            return (
              <Pressable
                key={src}
                onPress={() => onSelectSource(active ? 'all' : src)}
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
      {totalCount >= 4 && (
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
            onChangeText={onChangeSearchQuery}
            placeholder={t('searchBookmarks') || 'Search bookmarks...'}
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => onChangeSearchQuery('')} hitSlop={6}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  filterTrack: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
    paddingBottom: SPACING.xs + 2,
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
});

