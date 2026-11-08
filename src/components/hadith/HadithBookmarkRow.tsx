import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { HadithItem } from '@/data/hadiths';

export interface HadithBookmarkRowProps {
  item: HadithItem;
  itemIndex: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const HadithBookmarkRow: React.FC<HadithBookmarkRowProps> = ({
  item,
  itemIndex,
  isSelected,
  onSelect,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="button"
      accessibilityLabel={`Jump to Hadith ${itemIndex + 1}: ${item.source}`}
      style={({ pressed }) => [
        styles.bookmarkRow,
        {
          backgroundColor: isSelected
            ? theme.colors.secondaryTint
            : theme.colors.surfaceElevated,
          borderColor: isSelected
            ? theme.colors.primary
            : theme.colors.border,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      {/* Number Badge */}
      <View
        style={[
          styles.indexPill,
          {
            backgroundColor: isSelected
              ? theme.colors.primary
              : theme.colors.surface,
            borderColor: isSelected
              ? theme.colors.primary
              : theme.colors.border,
          },
        ]}
      >
        <AppText
          variant="caption"
          color={isSelected ? theme.colors.textInverse : theme.colors.primary}
          style={styles.indexText}
        >
          #{itemIndex + 1}
        </AppText>
      </View>

      {/* Summary & Snippet */}
      <View style={styles.rowInfo}>
        <View style={styles.rowMeta}>
          <AppText
            variant="caption"
            color={isSelected ? theme.colors.primary : theme.colors.text}
            style={styles.sourceText}
            numberOfLines={1}
          >
            {item.source}
          </AppText>
          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            style={styles.badgeText}
            numberOfLines={1}
          >
            • {item.badge}
          </AppText>
        </View>

        <AppText
          variant="bodySmall"
          color={isSelected ? theme.colors.text : theme.colors.textSecondary}
          style={styles.snippetText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.english}
        </AppText>
      </View>

      {/* Right Chevron */}
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9 18L15 12L9 6"
          stroke={isSelected ? theme.colors.primary : theme.colors.textMuted}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  bookmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  indexPill: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontWeight: '800',
    fontSize: 10,
  },
  rowInfo: {
    flex: 1,
    gap: 1,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontWeight: '700',
    fontSize: 11,
  },
  badgeText: {
    fontSize: 10,
    flexShrink: 1,
  },
  snippetText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
