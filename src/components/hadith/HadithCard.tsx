import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { HadithItem } from '@/data/hadiths';
import { HadithTranslationMode } from '@/hooks/useHadithCollection';

export interface HadithCardProps {
  hadith: HadithItem;
  currentIndex: number;
  totalHadiths: number;
  translationMode: HadithTranslationMode;
  onSelectTranslationMode: (mode: HadithTranslationMode) => void;
}

const TRANSLATION_OPTIONS: { id: HadithTranslationMode; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ur', label: 'اردو' },
  { id: 'both', label: 'Both' },
];

export const HadithCard: React.FC<HadithCardProps> = ({
  hadith,
  currentIndex,
  totalHadiths,
  translationMode,
  onSelectTranslationMode,
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
      {/* Background Rub el Hizb Watermark */}
      <View style={styles.watermarkLayer}>
        <Svg width={110} height={110} viewBox="0 0 110 110">
          <G transform="translate(55, 55)">
            <Rect
              x="-36"
              y="-36"
              width="72"
              height="72"
              stroke={theme.colors.mintTintPressed}
              strokeWidth="1.2"
              fill="none"
            />
            <Rect
              x="-36"
              y="-36"
              width="72"
              height="72"
              stroke={theme.colors.mintTintPressed}
              strokeWidth="1.2"
              fill="none"
              transform="rotate(45)"
            />
          </G>
        </Svg>
      </View>

      {/* Top Header Row: Category Badge & Index Counter */}
      <View style={styles.topRow}>
        <View style={[styles.badgePill, { backgroundColor: theme.colors.secondaryTint }]}>
          <AppText
            variant="caption"
            color={theme.colors.primary}
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
      <View
        style={[
          styles.translationTrack,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {TRANSLATION_OPTIONS.map((opt) => {
          const active = translationMode === opt.id;
          const displayLabel = opt.id === 'both' ? (t('translationBoth') || 'Both') : opt.label;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelectTranslationMode(opt.id)}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${displayLabel} translation`}
              style={[
                styles.segment,
                active && [
                  styles.activeSegment,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.primary,
                  },
                ],
              ]}
            >
              <AppText
                variant="caption"
                color={active ? theme.colors.primary : theme.colors.textMuted}
                style={[styles.segmentLabel, active && styles.activeSegmentLabel]}
              >
                {displayLabel}
              </AppText>
            </Pressable>
          );
        })}
      </View>

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

      {/* Source Citation Footer */}
      <View style={styles.footerRow}>
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
    opacity: 0.5,
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
  translationTrack: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegment: {
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentLabel: {
    fontWeight: '600',
    fontSize: 11,
  },
  activeSegmentLabel: {
    fontWeight: '700',
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
  },
  sourceText: {
    fontWeight: '800',
  },
  referenceText: {
    fontWeight: '600',
  },
});
