import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface AppearanceSettingsGroupProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenWallpaperGallery?: () => void;
}

export const AppearanceSettingsGroup: React.FC<AppearanceSettingsGroupProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenWallpaperGallery,
}) => {
  const theme = useTheme('light');

  const ChevronRight = (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={theme.colors.textSubtle} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.textSubtle} style={styles.sectionLabel}>
        APPEARANCE
      </AppText>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Row 1: Theme Mode */}
        <View style={styles.row}>
          <View style={styles.leftRow}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="5" stroke={theme.colors.primary} strokeWidth="2" />
              <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" />
            </Svg>

            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
                Theme Mode
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {isDarkMode ? 'Deep Islamic Dark' : 'Warm Off-White Light'}
              </AppText>
            </View>
          </View>

          <Pressable
            onPress={onToggleTheme}
            style={({ pressed }) => [
              styles.switchBtn,
              {
                borderColor: theme.colors.border,
                backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
              },
            ]}
          >
            <AppText variant="caption" color={theme.colors.text} style={styles.switchBtnText}>
              {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
            </AppText>
          </Pressable>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 2: Hadith Wallpaper Gallery */}
        <Pressable onPress={onOpenWallpaperGallery} style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
              Hadith Wallpaper Gallery
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              4 Islamic themes • High-resolution export
            </AppText>
          </View>
          {ChevronRight}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs + 2,
  },
  sectionLabel: {
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  textCol: {
    flex: 1,
    gap: 2,
    paddingRight: SPACING.sm,
  },
  rowTitle: {
    fontWeight: '700',
  },
  switchBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  switchBtnText: {
    fontWeight: '700',
    fontSize: 11,
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
