import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { VERIFIED_HADITHS, getDayOfYearHadithIndex } from '@/data/hadiths';

export interface HomeDailyHadithProps {
  onReadFull?: () => void;
  onOpenWallpaper?: () => void;
}

export const HomeDailyHadith: React.FC<HomeDailyHadithProps> = ({ onReadFull, onOpenWallpaper }) => {
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

      {/* Sacred Parchment Card with Warm Gold Border & Left Accent */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: 'rgba(243, 196, 64, 0.40)' }]}>
        <View style={[styles.leftGoldAccent, { backgroundColor: theme.colors.accent }]} />

        <View style={styles.cardContent}>
          {/* Top Row: Badge + Language Toggle */}
          <View style={styles.topRow}>
            <View style={[styles.badgePill, { backgroundColor: theme.colors.accentTint, borderColor: theme.colors.accent }]}>
              <AppText variant="caption" color={theme.colors.textPrimary} style={styles.badgeText}>
                {dailyHadith.badge}
              </AppText>
            </View>

            {/* English / Urdu Segmented Toggle */}
            <View style={[styles.langToggleBox, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
              <Pressable
                onPress={() => setLanguage('en')}
                style={[
                  styles.langBtn,
                  language === 'en' && { backgroundColor: theme.colors.accent },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Switch to English translation"
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
                accessibilityLabel="Switch to Urdu translation"
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

          {/* Ornamental Quote & Arabic Calligraphy */}
          <View style={styles.arabicBlock}>
            <Svg width={20} height={16} viewBox="0 0 24 24" fill={theme.colors.accent} opacity={0.65} style={styles.quoteIcon}>
              <Path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </Svg>

            <AppText
              variant="arabicMotto"
              color={theme.colors.textPrimary}
              align="right"
              style={styles.arabicText}
            >
              {arabicText}
            </AppText>
          </View>

          {/* Active Translation */}
          {language === 'en' ? (
            <AppText color={theme.colors.textPrimary} style={styles.englishText}>
              "{englishText}"
            </AppText>
          ) : (
            <AppText color={theme.colors.textPrimary} align="right" style={styles.urduText}>
              {urduText}
            </AppText>
          )}

          {/* Fine Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Footer: Authentic Source Citation */}
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
    borderRadius: RADIUS.xl, borderWidth: 1.2, overflow: 'hidden', position: 'relative',
    shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  leftGoldAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3.5 },
  cardContent: { padding: SPACING.md + 2, paddingLeft: SPACING.lg, gap: SPACING.sm },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgePill: {
    paddingHorizontal: SPACING.sm + 2, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 1,
  },
  badgeText: { fontWeight: '800', letterSpacing: 0.8, fontSize: 10 },
  langToggleBox: {
    flexDirection: 'row', borderRadius: RADIUS.full, borderWidth: 1, padding: 2, gap: 2,
  },
  langBtn: {
    paddingHorizontal: SPACING.sm + 2, paddingVertical: 2.5, borderRadius: RADIUS.full,
  },
  langBtnText: { fontSize: 11, fontWeight: '700' },
  arabicBlock: { position: 'relative', paddingTop: 2 },
  quoteIcon: { position: 'absolute', left: 0, top: 0 },
  arabicText: { fontSize: 20, lineHeight: 34, fontWeight: '700', paddingLeft: 24 },
  urduText: { fontSize: 14.5, lineHeight: 25, fontWeight: '500' },
  englishText: { fontSize: 13.5, lineHeight: 21, fontStyle: 'italic' },
  divider: { height: 1, marginVertical: 2 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.sm },
  sourceWrapper: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  sourceText: { fontSize: 11.5, fontWeight: '600', flex: 1 },
});
