import React from 'react';
import { StyleSheet, View, Pressable, Share } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
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
  const dailyHadith = VERIFIED_HADITHS[getDayOfYearHadithIndex()];

  const arabicText = dailyHadith.arabic;
  const englishText = dailyHadith.english;
  const sourceText = `${dailyHadith.source} • ${dailyHadith.reference}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${arabicText}\n\n${englishText}\n\n— ${sourceText}\n(Shared via SalahFirst)`,
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
          accessibilityLabel="Read full Hadith"
        >
          <AppText variant="bodySmall" color={theme.colors.primary} style={styles.readFull}>
            Read Full ›
          </AppText>
        </Pressable>
      </View>

      {/* Hadith Card with Left Gold Accent */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={[styles.leftGoldAccent, { backgroundColor: theme.colors.accent }]} />

        <View style={styles.cardContent}>
          {/* Badge */}
          <View style={[styles.badgePill, { backgroundColor: theme.colors.surfaceElevated }]}>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.badgeText}>
              {dailyHadith.badge}
            </AppText>
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

          {/* English Translation */}
          <AppText variant="bodyMedium" color={theme.colors.textMuted} style={styles.englishText}>
            {englishText}
          </AppText>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Footer: Source + Action Buttons */}
          <View style={styles.footerRow}>
            <AppText variant="caption" color={theme.colors.textSubtle} style={styles.sourceText}>
              {sourceText}
            </AppText>

            <View style={styles.actionsRow}>
              {/* Wallpaper / Image button */}
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
                  <Rect x="3" y="3" width="18" height="18" rx="2" stroke={theme.colors.primary} strokeWidth="2" />
                  <Path d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21" stroke={theme.colors.primary} strokeWidth="2" />
                </Svg>
              </Pressable>

              {/* Share button */}
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
                  <Path
                    d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
                    stroke={theme.colors.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
  },
  readFull: {
    fontWeight: '700',
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
  },
  leftGoldAccent: {
    width: 4,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  badgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  arabicText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 32,
    marginVertical: 2,
  },
  englishText: {
    fontStyle: 'italic',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceText: {
    flex: 1,
    fontWeight: '500',
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

