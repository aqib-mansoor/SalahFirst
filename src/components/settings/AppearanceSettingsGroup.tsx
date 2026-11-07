import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { ThemeMode } from '@/types';
import { useTranslation } from '@/context/LocalizationContext';

export interface AppearanceSettingsGroupProps {
  themeMode: ThemeMode;
  onSelectThemeMode: (mode: ThemeMode) => void;
  onOpenWallpaperGallery?: () => void;
}

export const AppearanceSettingsGroup: React.FC<AppearanceSettingsGroupProps> = ({
  themeMode,
  onSelectThemeMode,
  onOpenWallpaperGallery,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const MODES: { id: ThemeMode; label: string }[] = [
    { id: 'light', label: t('themeLight') },
    { id: 'dark', label: t('themeDark') },
    { id: 'system', label: t('themeSystem') },
  ];

  const getSubtitle = () => {
    if (themeMode === 'dark') return t('themeDark');
    if (themeMode === 'light') return t('themeLight');
    return t('themeSystem');
  };

  const ChevronRight = (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={theme.colors.textSubtle}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.textSubtle} style={styles.sectionLabel}>
        {t('appearance').toUpperCase()}
      </AppText>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Row 1: Theme Mode Info + 3-way Segmented Control */}
        <View style={styles.themeRow}>
          <View style={styles.leftRow}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="5" stroke={theme.colors.primary} strokeWidth="2" />
              <Path
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                stroke={theme.colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>

            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
                {t('theme')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {getSubtitle()}
              </AppText>
            </View>
          </View>

          {/* 3-way Segmented Pill */}
          <View style={[styles.segmentTrack, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
            {MODES.map((mode) => {
              const isSelected = themeMode === mode.id;
              return (
                <Pressable
                  key={mode.id}
                  onPress={() => onSelectThemeMode(mode.id)}
                  style={({ pressed }) => [
                    styles.segmentItem,
                    isSelected && [styles.segmentSelected, { backgroundColor: theme.colors.primary }],
                    pressed && !isSelected && { opacity: 0.7 },
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={isSelected ? theme.colors.textInverse : theme.colors.textMuted}
                    style={[styles.segmentText, isSelected && styles.segmentTextSelected]}
                  >
                    {mode.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 2: Hadith Wallpaper Gallery */}
        <Pressable onPress={onOpenWallpaperGallery} style={styles.row}>
          <View style={styles.textCol}>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
              {t('hadithWallpaperGallery')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {t('wallpaperGallerySubtitle')}
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
  themeRow: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
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
  },
  textCol: {
    flex: 1,
    gap: 2,
    paddingRight: SPACING.sm,
  },
  rowTitle: {
    fontWeight: '700',
  },
  segmentTrack: {
    flexDirection: 'row',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm + 2,
  },
  segmentSelected: {
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  segmentTextSelected: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
