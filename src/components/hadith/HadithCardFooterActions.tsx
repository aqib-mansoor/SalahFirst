import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface HadithCardFooterActionsProps {
  isSaved?: boolean;
  onWallpaperPress?: () => void;
  onSavePress?: () => void;
  onSharePress?: () => void;
}

export const HadithCardFooterActions: React.FC<HadithCardFooterActionsProps> = ({
  isSaved = false,
  onWallpaperPress,
  onSavePress,
  onSharePress,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.actionsRow}>
      {/* 1. Wallpaper Action */}
      <Pressable
        onPress={onWallpaperPress}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Create Hadith Wallpaper"
        style={({ pressed }) => [
          styles.circleBtn,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
          },
          pressed && { opacity: 0.75 },
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={theme.colors.primary} strokeWidth="2" />
          <Path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5Z" fill={theme.colors.primary} />
          <Path d="M21 15L16 10L5 21" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>

      {/* 2. Bookmark Action */}
      <Pressable
        onPress={onSavePress}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={isSaved ? "Saved in bookmarks" : "Save to bookmarks"}
        style={({ pressed }) => [
          styles.circleBtn,
          {
            backgroundColor: isSaved ? theme.colors.secondaryTint : theme.colors.surfaceElevated,
            borderColor: isSaved ? theme.colors.primary : theme.colors.border,
          },
          pressed && { opacity: 0.75 },
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
      </Pressable>

      {/* 3. Share Action */}
      <Pressable
        onPress={onSharePress}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Share Hadith"
        style={({ pressed }) => [
          styles.circleBtn,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
          },
          pressed && { opacity: 0.75 },
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
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
