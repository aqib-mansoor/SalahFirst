import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { HadithItem } from '@/data/hadiths';
import { HadithTranslationMode } from '@/hooks/useHadithCollection';
import { HadithTranslationSelector } from './HadithTranslationSelector';
import { HadithCardFooterActions } from './HadithCardFooterActions';
import { HadithRubElHizbWatermark } from './HadithRubElHizbWatermark';
import { HadithCardBody } from './HadithCardBody';

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
  const { t } = useTranslation();

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
      <HadithRubElHizbWatermark />

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
          #{currentIndex + 1} {t('of')} {totalHadiths}
        </AppText>
      </View>

      {/* Sleek Translation Mode Segmented Track */}
      <HadithTranslationSelector
        translationMode={translationMode}
        onSelectTranslationMode={onSelectTranslationMode}
      />

      {/* Decomposed Stable Content Block */}
      <HadithCardBody
        hadith={hadith}
        currentIndex={currentIndex}
        translationMode={translationMode}
      />

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
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
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

