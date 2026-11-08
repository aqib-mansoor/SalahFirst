import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface HadithActionButtonsProps {
  isSaved: boolean;
  onWallpaperPress: () => void;
  onSavePress: () => void;
  onSharePress: () => void;
}

export const HadithActionButtons: React.FC<HadithActionButtonsProps> = ({
  isSaved,
  onWallpaperPress,
  onSavePress,
  onSharePress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* 1. Wallpaper Action */}
      <Pressable
        onPress={onWallpaperPress}
        accessibilityRole="button"
        accessibilityLabel="Create Hadith Wallpaper"
        accessibilityHint="Opens customizable HD wallpaper generator with this Hadith"
        hitSlop={4}
        style={({ pressed }) => [
          styles.actionPill,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={theme.colors.primary} strokeWidth="2" />
          <Path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5Z" fill={theme.colors.primary} />
          <Path d="M21 15L16 10L5 21" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <AppText variant="bodySmall" color={theme.colors.text} style={styles.actionLabel}>
          {t('wallpaper')}
        </AppText>
      </Pressable>

      {/* 2. Save / Saved Action */}
      <Pressable
        onPress={onSavePress}
        accessibilityRole="button"
        accessibilityLabel={isSaved ? "Saved to bookmarks" : "Save to bookmarks"}
        accessibilityHint="Toggles offline bookmark for this Hadith"
        hitSlop={4}
        style={({ pressed }) => [
          styles.actionPill,
          {
            backgroundColor: isSaved ? theme.colors.secondaryTint : theme.colors.surface,
            borderColor: isSaved ? theme.colors.primary : theme.colors.border,
          },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z"
            fill={isSaved ? theme.colors.primary : 'none'}
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <AppText
          variant="bodySmall"
          color={isSaved ? theme.colors.primary : theme.colors.text}
          style={[styles.actionLabel, isSaved && styles.actionLabelActive]}
        >
          {isSaved ? t('saved') : t('save')}
        </AppText>
      </Pressable>

      {/* 3. Share Action */}
      <Pressable
        onPress={onSharePress}
        accessibilityRole="button"
        accessibilityLabel="Share Hadith"
        accessibilityHint="Shares authentic Hadith text and translation"
        hitSlop={4}
        style={({ pressed }) => [
          styles.actionPill,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16 6L12 2L8 6"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 2V15"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <AppText variant="bodySmall" color={theme.colors.text} style={styles.actionLabel}>
          {t('share')}
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  actionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.xs,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 6,
  },
  actionLabel: {
    fontWeight: '600',
    fontSize: 12,
  },
  actionLabelActive: {
    fontWeight: '700',
  },
});
