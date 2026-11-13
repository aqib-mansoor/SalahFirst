import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Share } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { VERIFIED_HADITHS, HadithItem, getDayOfYearHadithIndex } from '@/data/hadiths';

export interface HomeDailyHadithProps {
  onReadFull?: () => void;
  onOpenWallpaper?: (hadith?: HadithItem) => void;
}

export const HomeDailyHadith: React.FC<HomeDailyHadithProps> = React.memo(({ onReadFull, onOpenWallpaper }) => {
  const theme = useTheme();
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const dailyHadith = VERIFIED_HADITHS[getDayOfYearHadithIndex()];

  const arabicText = dailyHadith.arabic;
  const urduText = dailyHadith.urdu;
  const englishText = dailyHadith.english;
  const sourceText = `${dailyHadith.source} • ${dailyHadith.reference}`;

  const handleQuickShare = () => {
    const shareBody = `${dailyHadith.arabic}\n\n"${dailyHadith.english}"\n\n— ${sourceText}`;
    Share.share({ message: shareBody }).catch(() => {});
  };

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
              <Path d="M 14 14 L 38 14 M 14 14 L 14 38 M 18 18 L 30 18 M 18 18 L 18 30" />
              <Path d="M 326 14 L 302 14 M 326 14 L 326 38 M 322 18 L 310 18 M 322 18 L 322 30" />
              <G transform="translate(170, 68)">
                <Rect x="-24" y="-24" width="48" height="48" strokeWidth="0.7" strokeDasharray="3 3" />
                <Rect x="-24" y="-24" width="48" height="48" strokeWidth="0.7" strokeDasharray="3 3" transform="rotate(45)" />
              </G>
            </G>
          </Svg>
        </View>

        <View style={styles.cardContent}>
          {/* Top Row: Category Badge & Language Toggle */}
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
                  language === 'en' && { backgroundColor: theme.colors.primary },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Switch to English"
              >
                <AppText
                  variant="caption"
                  color={language === 'en' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                  style={styles.langBtnText}
                >
                  EN
                </AppText>
              </Pressable>

              <Pressable
                onPress={() => setLanguage('ur')}
                style={[
                  styles.langBtn,
                  language === 'ur' && { backgroundColor: theme.colors.primary },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Switch to Urdu"
              >
                <AppText
                  variant="caption"
                  color={language === 'ur' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                  style={styles.langBtnText}
                >
                  اردو
                </AppText>
              </Pressable>
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

          {/* Ornamental Gold Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            <View style={[styles.dividerDiamond, { backgroundColor: theme.colors.accent }]} />
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Editorial Translation Block */}
          <View style={styles.translationBlock}>
            {language === 'en' ? (
              <AppText color={theme.colors.textPrimary} style={styles.englishText}>
                “{englishText}”
              </AppText>
            ) : (
              <AppText color={theme.colors.textPrimary} align="right" style={styles.urduText}>
                {urduText}
              </AppText>
            )}
          </View>

          {/* Footer: Source Reference & Quick Actions */}
          <View style={[styles.footerRow, { borderTopColor: theme.colors.border }]}>
            <View style={styles.sourceWrapper}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={theme.colors.accent} strokeWidth="2" strokeLinecap="round" />
                <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={theme.colors.accent} strokeWidth="2" />
              </Svg>
              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.sourceText} numberOfLines={1}>
                {sourceText}
              </AppText>
            </View>

            <View style={styles.actionsRow}>
              {onOpenWallpaper && (
                <Pressable
                  onPress={() => onOpenWallpaper(dailyHadith)}
                  hitSlop={6}
                  style={[styles.actionBtn, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}
                >
                  <AppText variant="caption" color={theme.colors.primary} style={styles.actionBtnText}>
                    Wallpaper
                  </AppText>
                </Pressable>
              )}
              <Pressable
                onPress={handleQuickShare}
                hitSlop={6}
                style={[styles.actionBtn, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.primary }]}
              >
                <AppText variant="caption" color={theme.colors.primary} style={styles.actionBtnText}>
                  Share
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: SPACING.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontWeight: '800', letterSpacing: -0.2 },
  readFull: { fontWeight: '700' },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1.2,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    padding: SPACING.md + 2,
    gap: SPACING.sm,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgePill: {
    paddingHorizontal: SPACING.sm + 2, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 1,
  },
  badgeText: { fontWeight: '800', letterSpacing: 0.6, fontSize: 10 },
  langToggleBox: {
    flexDirection: 'row', borderRadius: RADIUS.full, borderWidth: 1, padding: 2, gap: 2,
  },
  langBtn: {
    paddingHorizontal: SPACING.sm + 2, paddingVertical: 2.5, borderRadius: RADIUS.full,
  },
  langBtnText: { fontSize: 10.5, fontWeight: '800' },
  arabicBlock: { paddingVertical: 4, paddingHorizontal: 4 },
  arabicText: { fontSize: 19, lineHeight: 32, fontWeight: '700' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerDiamond: {
    width: 5,
    height: 5,
    transform: [{ rotate: '45deg' }],
  },
  translationBlock: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  urduText: { fontSize: 14, lineHeight: 23, fontWeight: '600' },
  englishText: { fontSize: 13.5, lineHeight: 20, fontWeight: '500' },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  sourceWrapper: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  sourceText: { fontSize: 11, fontWeight: '700', flex: 1 },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
});
