import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface WallpaperActionDockProps {
  onSaveImage: () => void;
  onSetWallpaper: () => void;
  onShareStatus: () => void;
  isProcessing?: boolean;
}

export const WallpaperActionDock: React.FC<WallpaperActionDockProps> = ({
  onSaveImage,
  onSetWallpaper,
  onShareStatus,
  isProcessing = false,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, SPACING.sm) + SPACING.xs }]}>
      <View style={styles.dockSurface}>
        {/* 1. Save Image Button */}
        <Pressable
          onPress={onSaveImage}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel="Save wallpaper image to gallery"
          style={({ pressed }) => [
            styles.actionButton,
            styles.secondaryBtn,
            (pressed || isProcessing) && { opacity: 0.75 },
          ]}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M7 10L12 15L17 10"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path d="M12 15V3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </Svg>
          <AppText variant="caption" color="#FFFFFF" style={styles.btnLabel}>
            Save
          </AppText>
        </Pressable>

        {/* 2. Primary Set Wallpaper Button (Harmonized Sacred Gold) */}
        <Pressable
          onPress={onSetWallpaper}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel="Set wallpaper on device home or lock screen"
          style={({ pressed }) => [
            styles.actionButton,
            styles.primaryBtn,
            {
              backgroundColor: theme.colors.buttonGold,
              borderColor: theme.colors.buttonGoldPressed,
            },
            (pressed || isProcessing) && { opacity: 0.85 },
          ]}
        >
          <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
            <Rect x="5" y="2" width="14" height="20" rx="3" stroke={theme.colors.buttonGoldText} strokeWidth="2" />
            <Path d="M12 18H12.01" stroke={theme.colors.buttonGoldText} strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
          <AppText
            variant="caption"
            color={theme.colors.buttonGoldText}
            style={[styles.btnLabel, styles.primaryBtnText]}
          >
            Set Wallpaper
          </AppText>
        </Pressable>

        {/* 3. Share to Story / Status */}
        <Pressable
          onPress={onShareStatus}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel="Share wallpaper to WhatsApp or Instagram story"
          style={({ pressed }) => [
            styles.actionButton,
            styles.secondaryBtn,
            (pressed || isProcessing) && { opacity: 0.75 },
          ]}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <Path
              d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <Path
              d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <Path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="#FFFFFF" strokeWidth="2" />
          </Svg>
          <AppText variant="caption" color="#FFFFFF" style={styles.btnLabel}>
            Share
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    zIndex: 20,
  },
  dockSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(5, 20, 14, 0.88)',
    borderRadius: RADIUS.full,
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  primaryBtn: {
    flex: 1.45,
    borderWidth: 1,
  },
  btnLabel: {
    fontWeight: '700',
    fontSize: 11,
  },
  primaryBtnText: {
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
