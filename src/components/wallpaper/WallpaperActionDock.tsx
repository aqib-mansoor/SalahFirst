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
}

export const WallpaperActionDock: React.FC<WallpaperActionDockProps> = ({
  onSaveImage,
  onSetWallpaper,
  onShareStatus,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, SPACING.md) + SPACING.xs }]}>
      <View style={styles.dockSurface}>
        {/* 1. Save Image Button */}
        <Pressable
          onPress={onSaveImage}
          style={({ pressed }) => [
            styles.actionButton,
            styles.secondaryBtn,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
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
            Save Image
          </AppText>
        </Pressable>

        {/* 2. Set Wallpaper Button (Gold Focus) */}
        <Pressable
          onPress={onSetWallpaper}
          style={({ pressed }) => [
            styles.actionButton,
            styles.primaryBtn,
            { backgroundColor: theme.colors.buttonGold },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Rect x="5" y="2" width="14" height="20" rx="3" stroke="#114B36" strokeWidth="2" />
            <Path d="M12 18H12.01" stroke="#114B36" strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
          <AppText
            variant="caption"
            color="#114B36"
            style={[styles.btnLabel, styles.primaryBtnText]}
          >
            Set Wallpaper
          </AppText>
        </Pressable>

        {/* 3. Share to Status / Story Button */}
        <Pressable
          onPress={onShareStatus}
          style={({ pressed }) => [
            styles.actionButton,
            styles.secondaryBtn,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
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
            Status/Story
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: RADIUS.xxl,
    paddingVertical: SPACING.xs + 3,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xl,
    gap: 6,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  primaryBtn: {
    flex: 1.25,
  },
  btnLabel: {
    fontWeight: '700',
    fontSize: 11,
  },
  primaryBtnText: {
    fontWeight: '800',
    fontSize: 12,
  },
});

