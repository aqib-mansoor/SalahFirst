import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { AppText } from '@/components/common';
import { useTheme } from '@/hooks/useTheme';

export interface WallpaperHeaderProps {
  themeName: string;
  currentIndex: number;
  totalThemes: number;
  onClose: () => void;
}

export const WallpaperHeader: React.FC<WallpaperHeaderProps> = ({
  themeName,
  currentIndex,
  totalThemes,
  onClose,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.xs }]}>
      {/* Modern Theme Name & Index Glassmorphic Pill */}
      <View style={styles.headerPill}>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
            fill={theme.colors.accent}
          />
        </Svg>
        <AppText variant="bodySmall" color="#FFFFFF" style={styles.themeNameText}>
          {themeName}
        </AppText>
        <View style={styles.counterBadge}>
          <AppText variant="caption" color={theme.colors.accent} style={styles.counterText}>
            {currentIndex + 1}/{totalThemes}
          </AppText>
        </View>
      </View>

      {/* Sleek Frosted Glass Close Button */}
      <Pressable
        onPress={onClose}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Close wallpaper preview"
        style={({ pressed }) => [
          styles.closeButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 6L6 18M6 6L18 18"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    zIndex: 20,
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingLeft: SPACING.sm + 2,
    paddingRight: SPACING.xs + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    gap: 6,
  },
  themeNameText: {
    fontWeight: '700',
    fontSize: 12,
  },
  counterBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  counterText: {
    fontWeight: '800',
    fontSize: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
});
