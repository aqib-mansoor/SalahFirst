import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { HadithItem } from '@/data/hadiths';
import { HadithTranslationMode } from '@/hooks/useHadithCollection';
import { HadithTranslationSelector } from './HadithTranslationSelector';
import { HadithCardFooterActions } from './HadithCardFooterActions';

export interface HadithCardProps {
  hadith: HadithItem;
  currentIndex: number;
  totalHadiths: number;
  translationMode?: HadithTranslationMode;
  isSaved?: boolean;
  onSelectTranslationMode?: (mode: HadithTranslationMode) => void;
  onWallpaperPress?: () => void;
  onSavePress?: () => void;
  onSharePress?: () => void;
}

export const HadithCard: React.FC<HadithCardProps> = ({
  hadith,
  currentIndex,
  totalHadiths,
  translationMode = 'both',
  isSaved = false,
  onSelectTranslationMode,
  onWallpaperPress,
  onSavePress,
  onSharePress,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* Background Sacred Gold Rub el Hizb Watermark */}
      <View style={styles.watermarkLayer}>
        <Svg width={110} height={110} viewBox="0 0 110 110">
          <G transform="translate(55, 55)">
            <Rect
              x="-36"
              y="-36"
              width="72"
              height="72"
              stroke={theme.colors.accent}
              strokeWidth="1.3"
              fill="none"
              opacity={0.4}
            />
            <Rect
              x="-36"
              y="-36"
              width="72"
              height="72"
              stroke={theme.colors.accent}
              strokeWidth="1.3"
              fill="none"
              transform="rotate(45)"
              opacity={0.4}
            />
          </G>
        </Svg>
      </View>

      {/* Top Header Row: Gold Category Badge & Index Counter */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.badgePill,
            {
              backgroundColor: theme.colors.accentTint,
              borderColor: theme.colors.accent,
            },
          ]}
        >
          <AppText
            variant="caption"
            color={theme.colors.warning}
            style={styles.badgeText}
            numberOfLines={1}
          >
            {hadith.badge}
          </AppText>
        </View>

        <AppText
          variant="titleSmall"
          color={theme.colors.accent}
          style={styles.counterText}
        >
          #{currentIndex + 1} of {totalHadiths}
        </AppText>
      </View>

      {/* Sleek Translation Mode Segmented Track */}
      <HadithTranslationSelector
        translationMode={translationMode}
        onSelectTranslationMode={onSelectTranslationMode}
      />

      {/* Stable Minimum-Height Content Block to Prevent Layout Jitter */}
      <View style={styles.stableContentBlock}>
        {/* Arabic Calligraphy Content */}
        <View style={styles.arabicSection}>
          <AppText
            variant="arabicMotto"
            color={theme.colors.text}
            style={styles.arabicText}
          >
            {hadith.arabic}
          </AppText>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* English Translation */}
        {(translationMode === 'en' || translationMode === 'both') && (
          <AppText
            variant="bodyMedium"
            color={theme.colors.text}
            style={styles.englishText}
          >
            {hadith.english}
          </AppText>
        )}

        {/* Urdu Translation */}
        {(translationMode === 'ur' || translationMode === 'both') && (
          <View style={[styles.urduBox, { backgroundColor: theme.colors.privacyBg }]}>
            <AppText
              variant="bodyMedium"
              color={theme.colors.privacyText}
              style={styles.urduText}
            >
              {hadith.urdu}
            </AppText>
          </View>
        )}
      </View>

      {/* Source Citation & Actions Footer */}
      <View style={styles.footerRow}>
        <View style={styles.citationCol}>
          <AppText
            variant="bodySmall"
            color={theme.colors.primary}
            style={styles.sourceText}
          >
            {hadith.source}
          </AppText>

          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            style={styles.referenceText}
          >
            {hadith.reference}
          </AppText>
        </View>

        {/* 36x36 Circular Action Icons */}
        <HadithCardFooterActions
          isSaved={isSaved}
          onWallpaperPress={onWallpaperPress}
          onSavePress={onSavePress}
          onSharePress={onSharePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    gap: SPACING.md,
  },
  watermarkLayer: {
    position: 'absolute',
    top: -15,
    left: -15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  badgePill: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    flexShrink: 1,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.4,
  },
  counterText: {
    fontWeight: '800',
    fontSize: 13,
  },
  stableContentBlock: {
    minHeight: 250,
    justifyContent: 'center',
    gap: SPACING.sm + 2,
  },
  arabicSection: {
    paddingVertical: SPACING.xs,
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 38,
    textAlign: 'center',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  englishText: {
    lineHeight: 22,
    fontWeight: '500',
  },
  urduBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  urduText: {
    lineHeight: 26,
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
    gap: SPACING.sm,
  },
  citationCol: {
    flex: 1,
    gap: 2,
  },
  sourceText: {
    fontWeight: '800',
  },
  referenceText: {
    fontWeight: '600',
  },
});
