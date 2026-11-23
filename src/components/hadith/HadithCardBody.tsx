import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { HadithItem, getHadithReflection } from '@/data/hadiths';
import { HadithTranslationMode } from '@/hooks/useHadithCollection';

export interface HadithCardBodyProps {
  hadith: HadithItem;
  currentIndex: number;
  translationMode: HadithTranslationMode;
}

export const HadithCardBody: React.FC<HadithCardBodyProps> = ({
  hadith,
  currentIndex,
  translationMode,
}) => {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const takeawayText = getHadithReflection(hadith, currentIndex, language);

  return (
    <View style={styles.stableContentBlock}>
      {/* Arabic Calligraphy Content */}
      <View style={styles.arabicSection}>
        <AppText
          variant="arabicMotto"
          color={theme.colors.textPrimary}
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
          color={theme.colors.textPrimary}
          style={styles.englishText}
        >
          {hadith.english}
        </AppText>
      )}

      {translationMode === 'both' && (
        <View style={[styles.subtleDivider, { backgroundColor: theme.colors.border }]} />
      )}

      {/* Urdu Translation */}
      {(translationMode === 'ur' || translationMode === 'both') && (
        <AppText
          variant="bodyMedium"
          color={theme.colors.textSecondary}
          style={styles.urduText}
        >
          {hadith.urdu}
        </AppText>
      )}

      {/* Heart Takeaway / Actionable Reflection Box */}
      <View
        style={[
          styles.takeawayBox,
          {
            backgroundColor: theme.colors.secondaryTint,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <AppText variant="caption" color={theme.colors.primary} style={styles.takeawayLabel}>
          {t('hadithTakeawayLabel')}
        </AppText>
        <AppText
          variant="caption"
          color={theme.colors.textPrimary}
          style={[
            styles.takeawayText,
            language !== 'en' && styles.takeawayTextRtl,
          ]}
        >
          {takeawayText}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  subtleDivider: {
    height: 1,
    width: '40%',
    alignSelf: 'center',
    opacity: 0.65,
  },
  englishText: {
    lineHeight: 23,
    fontWeight: '500',
    textAlign: 'center',
  },
  urduText: {
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15.5,
  },
  takeawayBox: {
    marginTop: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 3,
  },
  takeawayLabel: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.6,
  },
  takeawayText: {
    fontSize: 12,
    lineHeight: 17.5,
    fontWeight: '600',
  },
  takeawayTextRtl: {
    lineHeight: 22,
    textAlign: 'right',
    fontSize: 12.5,
  },
});

