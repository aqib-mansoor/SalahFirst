import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { AppText } from '@/components/common';
import { useTheme } from '@/hooks/useTheme';
import { WallpaperPreviewMode } from './WallpaperPhoneOverlay';

export interface WallpaperHeaderProps {
  themeName: string;
  currentIndex: number;
  totalThemes: number;
  previewMode: WallpaperPreviewMode;
  onTogglePreviewMode: () => void;
  onClose: () => void;
}

export const WallpaperHeader: React.FC<WallpaperHeaderProps> = ({
  themeName,
  currentIndex,
  totalThemes,
  previewMode,
  onTogglePreviewMode,
  onClose,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const previewLabel =
    previewMode === 'lockscreen'
      ? 'Lock'
      : previewMode === 'homescreen'
      ? 'Home'
      : 'Clean';

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.xs }]}>
      {/* Theme Name & Index Counter Glassmorphic Pill */}
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

      {/* Right Header Actions: Interactive Phone Preview Mode & Close */}
      <View style={styles.rightActionsRow}>
        {/* Preview Overlay Mode Toggle */}
        <Pressable
          onPress={onTogglePreviewMode}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Toggle preview mode. Current mode: ${previewLabel}`}
          style={({ pressed }) => [
            styles.previewToggleBtn,
            previewMode !== 'clean' && styles.previewToggleBtnActive,
            pressed && { opacity: 0.75 },
          ]}
        >
          {previewMode === 'lockscreen' ? (
            <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
              <Rect x="5" y="11" width="14" height="10" rx="2" stroke={theme.colors.accent} strokeWidth="2" />
              <Path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke={theme.colors.accent} strokeWidth="2" />
            </Svg>
          ) : previewMode === 'homescreen' ? (
            <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
              <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke={theme.colors.accent} strokeWidth="2" />
              <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke={theme.colors.accent} strokeWidth="2" />
              <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke={theme.colors.accent} strokeWidth="2" />
              <Rect x="14" y="14" width="7" height="7" rx="1.5" stroke={theme.colors.accent} strokeWidth="2" />
            </Svg>
          ) : (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="#FFFFFF" strokeWidth="2" />
              <Circle cx="12" cy="12" r="3" stroke="#FFFFFF" strokeWidth="2" />
            </Svg>
          )}

          <AppText
            variant="caption"
            color={previewMode !== 'clean' ? theme.colors.accent : '#FFFFFF'}
            style={styles.previewBtnLabel}
          >
            {previewLabel}
          </AppText>
        </Pressable>

        {/* Sleek Frosted Glass Close Button */}
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close wallpaper preview"
          style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7 }]}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6L6 18M6 6L18 18" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>
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
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    gap: 5,
  },
  previewToggleBtnActive: {
    borderColor: 'rgba(243, 196, 64, 0.4)',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  previewBtnLabel: {
    fontSize: 11,
    fontWeight: '700',
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
