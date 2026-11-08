import React from 'react';
import { StyleSheet, View, Pressable, Share } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { VERIFIED_HADITHS, getDayOfYearHadithIndex } from '@/data/hadiths';

export interface HomeDailyHadithProps {
  onReadFull?: () => void;
  onOpenWallpaper?: () => void;
}

export const HomeDailyHadith: React.FC<HomeDailyHadithProps> = ({ onReadFull, onOpenWallpaper }) => {
  const theme = useTheme();
  const dailyHadith = VERIFIED_HADITHS[getDayOfYearHadithIndex()];

  const arabicText = dailyHadith.arabic;
  const urduText = dailyHadith.urdu;
  const englishText = dailyHadith.english;
  const sourceText = `${dailyHadith.source} • ${dailyHadith.reference}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${arabicText}\n\n${urduText}\n\n"${englishText}"\n\n— ${sourceText}\n(Shared via SalahFirst)`,
      });
    } catch {}
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <AppText variant="titleMedium" color={theme.colors.text} style={styles.title}>
          Daily Hadith
        </AppText>
        <Pressable
          onPress={onReadFull}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Read full Hadith collection"
        >
          <AppText variant="bodySmall" color={PALETTE.emeraldDark} style={styles.readFull}>
            Read Full ›
          </AppText>
        </Pressable>
      </View>

      {/* Mature Hadith Card with Left Gold Accent Bar */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.leftGoldAccent} />

        <View style={styles.cardContent}>
          {/* Badge & Category */}
          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <AppText variant="caption" color={PALETTE.goldDark} style={styles.badgeText}>
                {dailyHadith.badge}
              </AppText>
            </View>
          </View>

          {/* Arabic Calligraphy */}
          <AppText
            variant="arabicMotto"
            color={theme.colors.text}
            align="right"
            style={styles.arabicText}
          >
            {arabicText}
          </AppText>

          {/* Urdu Translation */}
          <AppText color="#475569" align="right" style={styles.urduText}>
            {urduText}
          </AppText>

          {/* English Translation */}
          <AppText color="#334155" style={styles.englishText}>
            "{englishText}"
          </AppText>

          {/* Fine Divider */}
          <View style={styles.divider} />

          {/* Footer: Source + Action Buttons */}
          <View style={styles.footerRow}>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.sourceText}>
              {sourceText}
            </AppText>

            <View style={styles.actionsRow}>
              {/* Wallpaper Generator Button */}
              <Pressable
                onPress={onOpenWallpaper}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Generate Hadith Wallpaper"
                style={({ pressed }) => [
                  styles.actionBtn,
                  { backgroundColor: pressed ? theme.colors.mintTintPressed : theme.colors.mintTint },
                ]}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Rect x="3" y="3" width="18" height="18" rx="2" stroke={PALETTE.emeraldDark} strokeWidth="2" />
                  <Path d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21" stroke={PALETTE.emeraldDark} strokeWidth="2" />
                </Svg>
              </Pressable>

              {/* Share Button */}
              <Pressable
                onPress={handleShare}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Share Hadith"
                style={({ pressed }) => [
                  styles.actionBtn,
                  { backgroundColor: pressed ? theme.colors.mintTintPressed : theme.colors.mintTint },
                ]}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M4 12V20C4 20.55 4.45 21 5 21H19C19.55 21 20 20.55 20 20V12" stroke={PALETTE.emeraldDark} strokeWidth="2" strokeLinecap="round" />
                  <Path d="M16 6L12 2L8 6M12 2V15" stroke={PALETTE.emeraldDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  readFull: {
    fontWeight: '700',
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: '#E6EAE8',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  leftGoldAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: PALETTE.gold,
  },
  cardContent: {
    padding: SPACING.lg,
    paddingLeft: SPACING.lg + 4,
    gap: SPACING.sm,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badgePill: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: '#FBF8F2',
    borderWidth: 1,
    borderColor: '#EFE7DA',
  },
  badgeText: {
    fontWeight: '800',
    letterSpacing: 0.8,
    fontSize: 10,
  },
  arabicText: {
    fontSize: 20,
    lineHeight: 34,
    fontWeight: '700',
  },
  urduText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '500',
  },
  englishText: {
    fontSize: 13.5,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: SPACING.xs,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourceText: {
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
