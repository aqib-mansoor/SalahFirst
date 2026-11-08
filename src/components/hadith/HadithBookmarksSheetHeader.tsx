import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface HadithBookmarksSheetHeaderProps {
  totalCount: number;
  onClose: () => void;
}

export const HadithBookmarksSheetHeader: React.FC<HadithBookmarksSheetHeaderProps> = ({
  totalCount,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      {/* Drag Handle */}
      <View style={styles.handleContainer}>
        <View style={[styles.handleBar, { backgroundColor: theme.colors.border }]} />
      </View>

      {/* Header Row */}
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
              {totalCount}
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
    </>
  );
};

const styles = StyleSheet.create({
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
});

