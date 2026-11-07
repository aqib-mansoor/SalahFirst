import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export const QuranReflectionCard3D: React.FC = () => {
  const theme = useTheme('light');

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
      {/* 3D Isometric Quran on Wooden Rehal Stand */}
      <View style={styles.topIllustrationRow}>
        <View style={styles.rehalSvgWrapper}>
          <Svg width={110} height={70} viewBox="0 0 110 70">
            <Defs>
              <LinearGradient id="woodDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#2E1D11" />
                <Stop offset="100%" stopColor="#170D07" />
              </LinearGradient>
              <LinearGradient id="woodLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#4A311E" />
                <Stop offset="100%" stopColor="#2A190C" />
              </LinearGradient>
              <LinearGradient id="pageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#EAE5D8" />
                <Stop offset="50%" stopColor="#FFFDF9" />
                <Stop offset="100%" stopColor="#E0DACE" />
              </LinearGradient>
              <LinearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#E8CA94" />
                <Stop offset="100%" stopColor="#B58E50" />
              </LinearGradient>
            </Defs>

            {/* Drop Shadow */}
            <Circle cx="55" cy="58" r="32" fill="rgba(0,0,0,0.08)" />

            {/* Carved Rehal (Wooden X-Stand) Legs */}
            <Path d="M 25 56 L 55 40 L 85 56 L 78 62 L 55 48 L 32 62 Z" fill="url(#woodDark)" />
            <Path d="M 38 60 L 55 44 L 72 60 L 68 64 L 55 49 L 42 64 Z" fill="url(#woodLight)" />

            {/* 3D Quran Binding & Open Pages */}
            {/* Left Page (Curved depth) */}
            <Path d="M 55 36 C 42 33, 26 35, 18 39 L 20 46 C 28 42, 42 41, 55 44 Z" fill="#D6CFBF" />
            <Path d="M 55 32 C 42 29, 26 31, 18 35 L 20 42 C 28 38, 42 37, 55 40 Z" fill="url(#pageGrad)" />

            {/* Right Page (Curved depth) */}
            <Path d="M 55 36 C 68 33, 84 35, 92 39 L 90 46 C 82 42, 68 41, 55 44 Z" fill="#D6CFBF" />
            <Path d="M 55 32 C 68 29, 84 31, 92 35 L 90 42 C 82 38, 68 37, 55 40 Z" fill="url(#pageGrad)" />

            {/* Gold Gilded Edge Trim */}
            <Path d="M 18 35 L 20 42" stroke="url(#goldRibbon)" strokeWidth="1.5" />
            <Path d="M 92 35 L 90 42" stroke="url(#goldRibbon)" strokeWidth="1.5" />

            {/* Book Spine Center Pivot & Gold Ribbon Marker (Fasilah) */}
            <Path d="M 55 31 L 55 42" stroke="#2A190C" strokeWidth="2" />
            <Path d="M 55 40 C 56 46, 52 50, 56 56 L 58 55 C 54 49, 58 45, 55 40 Z" fill="url(#goldRibbon)" />

            {/* Subtle Calligraphy Lines on Open Pages */}
            <G opacity="0.3">
              <Path d="M 28 34 L 46 32 M 28 37 L 46 35 M 28 40 L 46 38" stroke="#333" strokeWidth="0.8" />
              <Path d="M 64 32 L 82 34 M 64 35 L 82 37 M 64 38 L 82 40" stroke="#333" strokeWidth="0.8" />
            </G>
          </Svg>
        </View>

        <View style={styles.badgeCol}>
          <View style={[styles.reflectionPill, { backgroundColor: theme.colors.mintTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
              DAILY QURAN REFLECTION
            </AppText>
          </View>
          <AppText variant="caption" color={theme.colors.accent} style={styles.surahTag}>
            Surah Al-Ankabut 29:45
          </AppText>
        </View>
      </View>

      {/* Arabic Ayah */}
      <AppText
        variant="arabicMotto"
        color={theme.colors.text}
        style={styles.arabicText}
      >
        وَأَقِمِ الصَّلَاةَ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ
      </AppText>

      {/* Translations */}
      <AppText variant="bodySmall" color={theme.colors.text} style={styles.englishText}>
        "And establish prayer. Indeed, prayer prohibits immorality and wrongdoing."
      </AppText>

      <View style={[styles.urduBox, { backgroundColor: theme.colors.privacyBg }]}>
        <AppText variant="bodySmall" color={theme.colors.privacyText} style={styles.urduText}>
          "اور نماز قائم کرو، بے شک نماز بے حیائی اور برائی سے روکتی ہے۔"
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.md + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    gap: SPACING.sm + 2,
  },
  topIllustrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rehalSvgWrapper: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCol: {
    flex: 1,
    gap: 3,
  },
  reflectionPill: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  surahTag: {
    fontWeight: '700',
    fontSize: 11,
  },
  arabicText: {
    fontSize: 20,
    lineHeight: 34,
    textAlign: 'center',
    fontWeight: '600',
    paddingVertical: 2,
  },
  englishText: {
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  urduBox: {
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
  },
  urduText: {
    lineHeight: 22,
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 13,
  },
});

