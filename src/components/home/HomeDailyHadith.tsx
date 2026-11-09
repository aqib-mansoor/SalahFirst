import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { VERIFIED_HADITHS, HadithItem, getDayOfYearHadithIndex } from '@/data/hadiths';

export interface HomeDailyHadithProps {
  onReadFull?: () => void;
  onOpenWallpaper?: (hadith?: HadithItem) => void;
}

export const HomeDailyHadith: React.FC<HomeDailyHadithProps> = ({ onReadFull }) => {
  const theme = useTheme();
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const dailyHadith = VERIFIED_HADITHS[getDayOfYearHadithIndex()];

  const arabicText = dailyHadith.arabic;
  const urduText = dailyHadith.urdu;
  const englishText = dailyHadith.english;
  const sourceText = `${dailyHadith.source} • ${dailyHadith.reference}`;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.title}>
          Daily Hadith
        </AppText>
        <Pressable
          onPress={onReadFull}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Read full Hadith collection"
        >
          <AppText variant="bodySmall" color={theme.colors.primary} style={styles.readFull}>
            Read Full ›
          </AppText>
        </Pressable>
      </View>

      {/* Clean Sacred Hadith Card */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Background Subtle Arabesque Watermark & Corner Ornaments */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%" viewBox="0 0 340 220" preserveAspectRatio="none">
            <G stroke={theme.colors.accent} strokeWidth="0.8" opacity={0.12} fill="none">
              {/* Top-Left Arabesque Corner */}
              <Path d="M 14 14 L 38 14 M 14 14 L 14 38 M 18 18 L 30 18 M 18 18 L 18 30" />
              <Path d="M 24 24 L 30 30 M 30 24 L 24 30" />

              {/* Top-Right Arabesque Corner */}
              <Path d="M 326 14 L 302 14 M 326 14 L 326 38 M 322 18 L 310 18 M 322 18 L 322 30" />
              <Path d="M 316 24 L 310 30 M 310 24 L 316 30" />

              {/* Center 8-Pointed Star Rosette Watermark */}
              <G transform="translate(170, 68)">
                <Rect x="-24" y="-24" width="48" height="48" strokeWidth="0.7" strokeDasharray="3 3" />
                <Rect x="-24" y="-24" width="48" height="48" strokeWidth="0.7" strokeDasharray="3 3" transform="rotate(45)" />
              </G>
            </G>
          </Svg>
        </View>

        <View style={styles.cardContent}>
          {/* Top Row: Category Badge & Authenticity Pill */}
          <View style={styles.topRow}>
            <View style={[styles.badgePill, { backgroundColor: theme.colors.accentTint, borderColor: theme.colors.accent }]}>
              <AppText variant="caption" color={theme.colors.textPrimary} style={styles.badgeText}>
                {dailyHadith.badge}
              </AppText>
            </View>

            <View style={[styles.verifiedPill, { backgroundColor: theme.colors.secondaryTint, borderColor: 'rgba(14, 116, 73, 0.25)' }]}>
              <AppText variant="caption" color={theme.colors.primary} style={styles.verifiedText}>
                Authentic • Sahih
              </AppText>
            </View>
          </View>

          {/* Centered Sacred Arabic Calligraphy with Brackets ﴿ ﴾ */}
          <View style={styles.arabicBlock}>
            <AppText
              variant="arabicMotto"
              color={theme.colors.textPrimary}
              align="center"
              style={styles.arabicText}
            >
              ﴿ {arabicText} ﴾
            </AppText>
          </View>

          {/* Inner Tinted Translation Panel */}
          <View style={[styles.translationPanel, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
            <View style={styles.panelHeader}>
              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.panelLabel}>
                Meaning & Reflection
              </AppText>

              {/* English / Urdu Segmented Toggle */}
              <View style={[styles.langToggleBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Pressable
                  onPress={() => setLanguage('en')}
                  style={[
                    styles.langBtn,
                    language === 'en' && { backgroundColor: theme.colors.accent },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Switch to English"
                >
                  <AppText
                    variant="caption"
                    color={language === 'en' ? theme.colors.textOnAccent : theme.colors.textSecondary}
                    style={styles.langBtnText}
                  >
                    English
                  </AppText>
                </Pressable>

                <Pressable
                  onPress={() => setLanguage('ur')}
                  style={[
                    styles.langBtn,
                    language === 'ur' && { backgroundColor: theme.colors.accent },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Switch to Urdu"
                >
                  <AppText
                    variant="caption"
                    color={language === 'ur' ? theme.colors.textOnAccent : theme.colors.textSecondary}
                    style={styles.langBtnText}
                  >
                    اردو
                  </AppText>
                </Pressable>
              </View>
            </View>

            {/* Translation Content */}
            {language === 'en' ? (
              <AppText color={theme.colors.textPrimary} style={styles.englishText}>
                "{englishText}"
              </AppText>
            ) : (
              <AppText color={theme.colors.textPrimary} align="right" style={styles.urduText}>
                {urduText}
              </AppText>
            )}
          </View>

          {/* Footer: Source Reference Citation */}
          <View style={styles.footerRow}>
            <View style={styles.sourceWrapper}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={theme.colors.accent} strokeWidth="2" strokeLinecap="round" />
                <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={theme.colors.accent} strokeWidth="2" />
              </Svg>
              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.sourceText} numberOfLines={1}>
                {sourceText}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: SPACING.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontWeight: '800', letterSpacing: -0.2 },
  readFull: { fontWeight: '700' },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    padding: SPACING.md,
    gap: SPACING.xs + 2,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgePill: {
    paddingHorizontal: SPACING.sm + 2, paddingVertical: 2.5, borderRadius: RADIUS.full, borderWidth: 1,
  },
  badgeText: { fontWeight: '800', letterSpacing: 0.8, fontSize: 9.5 },
  verifiedPill: {
    paddingHorizontal: SPACING.sm + 2, paddingVertical: 2, borderRadius: RADIUS.full, borderWidth: 1,
  },
  verifiedText: { fontSize: 10, fontWeight: '700' },
  arabicBlock: { paddingVertical: 2, paddingHorizontal: 2 },
  arabicText: { fontSize: 18.5, lineHeight: 31, fontWeight: '700' },
  translationPanel: {
    borderRadius: RADIUS.md, borderWidth: 1, paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.md, gap: SPACING.xs,
  },
  panelHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2,
  },
  panelLabel: { fontSize: 10.5, fontWeight: '600', letterSpacing: 0.2 },
  langToggleBox: {
    flexDirection: 'row', borderRadius: RADIUS.full, borderWidth: 1, padding: 1.5, gap: 2,
  },
  langBtn: {
    paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full,
  },
  langBtnText: { fontSize: 10.5, fontWeight: '700' },
  urduText: { fontSize: 13.5, lineHeight: 22, fontWeight: '500' },
  englishText: { fontSize: 12.8, lineHeight: 19, fontStyle: 'italic' },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  sourceWrapper: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  sourceText: { fontSize: 11, fontWeight: '600', flex: 1 },
});
