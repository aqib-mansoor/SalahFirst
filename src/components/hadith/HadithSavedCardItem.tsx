import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { HadithItem } from '@/data/hadiths';

export interface HadithSavedCardItemProps {
  item: HadithItem;
  itemIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export const HadithSavedCardItem: React.FC<HadithSavedCardItemProps> = ({
  item,
  itemIndex,
  isSelected,
  onSelect,
  onRemove,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="button"
      accessibilityLabel={`Open Hadith ${itemIndex + 1}: ${item.source}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isSelected
            ? theme.colors.secondaryTint
            : theme.colors.surface,
          borderColor: isSelected
            ? theme.colors.primary
            : theme.colors.border,
        },
        pressed && { opacity: 0.85 },
      ]}
    >
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View style={styles.tagGroup}>
          {/* Index Pill */}
          <View
            style={[
              styles.indexPill,
              {
                backgroundColor: theme.colors.accentTint,
                borderColor: theme.colors.accent,
              },
            ]}
          >
            <AppText variant="caption" color={theme.colors.warning} style={styles.indexText}>
              #{itemIndex + 1}
            </AppText>
          </View>

          {/* Topic Badge */}
          <View
            style={[
              styles.badgePill,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <AppText
              variant="caption"
              color={theme.colors.text}
              style={styles.badgeText}
              numberOfLines={1}
            >
              {item.badge}
            </AppText>
          </View>
        </View>

        {/* Unbookmark Button */}
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Remove from saved bookmarks"
          style={({ pressed }) => [
            styles.removeBtn,
            {
              backgroundColor: theme.colors.accentTint,
              borderColor: theme.colors.accent,
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z"
              fill={theme.colors.accent}
              stroke={theme.colors.accent}
              strokeWidth="2"
            />
          </Svg>
        </Pressable>
      </View>

      {/* Arabic Calligraphy Snippet */}
      <AppText
        variant="bodyMedium"
        color={theme.colors.text}
        style={styles.arabicText}
        numberOfLines={2}
      >
        {item.arabic}
      </AppText>

      {/* English Wisdom Snippet */}
      <AppText
        variant="bodySmall"
        color={theme.colors.textSecondary}
        style={styles.englishText}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        "{item.english}"
      </AppText>

      {/* Footer Row */}
      <View style={[styles.footerRow, { borderTopColor: theme.colors.border }]}>
        <AppText variant="caption" color={theme.colors.primary} style={styles.sourceText}>
          {item.source} • {item.reference}
        </AppText>

        <View style={styles.readHintRow}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.readHintText}>
            {t('tapToRead') || 'Tap to read'}
          </AppText>
          <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 18L15 12L9 6"
              stroke={theme.colors.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.xs + 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  indexPill: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  indexText: {
    fontWeight: '800',
    fontSize: 10,
  },
  badgePill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    flexShrink: 1,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicText: {
    textAlign: 'right',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '600',
  },
  englishText: {
    lineHeight: 18,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs + 2,
    borderTopWidth: 1,
  },
  sourceText: {
    fontWeight: '700',
    fontSize: 11,
  },
  readHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readHintText: {
    fontWeight: '700',
    fontSize: 10,
  },
});
