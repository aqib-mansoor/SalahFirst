import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface DhikrPhase {
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
}

const DHIKR_PHASES: DhikrPhase[] = [
  {
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    target: 33,
  },
  {
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah',
    target: 33,
  },
  {
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    target: 34,
  },
];

export const TasbihCounter3D: React.FC = () => {
  const theme = useTheme();
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const currentPhase = DHIKR_PHASES[phaseIndex];

  const handleIncrement = () => {
    if (count + 1 >= currentPhase.target) {
      if (phaseIndex + 1 < DHIKR_PHASES.length) {
        setPhaseIndex(phaseIndex + 1);
        setCount(0);
      } else {
        // Finished full 100 cycle
        setPhaseIndex(0);
        setCount(0);
      }
    } else {
      setCount((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCount(0);
    setPhaseIndex(0);
  };

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
      {/* Header & 3D Misbaha Beads Illustration */}
      <View style={styles.topRow}>
        <View style={styles.beadsSvgWrapper}>
          <Svg width={80} height={70} viewBox="0 0 80 70">
            <Defs>
              <RadialGradient id="jadeBead" cx="35%" cy="35%" r="65%">
                <Stop offset="0%" stopColor="#2CD194" />
                <Stop offset="50%" stopColor="#114B36" />
                <Stop offset="100%" stopColor="#08291D" />
              </RadialGradient>
              <RadialGradient id="goldBead" cx="30%" cy="30%" r="70%">
                <Stop offset="0%" stopColor="#FFF2D6" />
                <Stop offset="50%" stopColor="#CCA15F" />
                <Stop offset="100%" stopColor="#8A642B" />
              </RadialGradient>
              <LinearGradient id="tasselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#CCA15F" />
                <Stop offset="100%" stopColor="#78531D" />
              </LinearGradient>
            </Defs>

            {/* Loop of 3D Isometric Spherical Beads */}
            <Circle cx="16" cy="30" r="6.5" fill="url(#jadeBead)" />
            <Circle cx="26" cy="18" r="6.5" fill="url(#jadeBead)" />
            <Circle cx="40" cy="14" r="7.5" fill="url(#goldBead)" />
            <Circle cx="54" cy="18" r="6.5" fill="url(#jadeBead)" />
            <Circle cx="64" cy="30" r="6.5" fill="url(#jadeBead)" />
            <Circle cx="58" cy="44" r="6.5" fill="url(#jadeBead)" />
            <Circle cx="22" cy="44" r="6.5" fill="url(#jadeBead)" />

            {/* Minaret Head (Imam) & Silk Tassel */}
            <Path d="M 38 46 L 42 46 L 44 54 L 36 54 Z" fill="url(#goldBead)" />
            <Circle cx="40" cy="45" r="2.5" fill="#FFF2D6" />
            <Path d="M 36 54 C 34 64, 46 64, 44 54 Z" fill="url(#tasselGrad)" />
            <Path d="M 38 60 L 34 68 M 40 60 L 40 69 M 42 60 L 46 68" stroke="#CCA15F" strokeWidth="1" />
          </Svg>
        </View>

        <View style={styles.headerInfo}>
          <View style={[styles.badgePill, { backgroundColor: theme.colors.mintTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
              AFTER-SALAH TASBIH
            </AppText>
          </View>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.cycleLabel}>
            Step {phaseIndex + 1} of 3 • {currentPhase.transliteration}
          </AppText>
        </View>

        <Pressable onPress={handleReset} hitSlop={8} style={styles.resetBtn}>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.resetText}>
            ↺ Reset
          </AppText>
        </Pressable>
      </View>

      {/* Main Dhikr Calligraphy & Meaning */}
      <View style={styles.dhikrContent}>
        <AppText variant="arabicMotto" color={theme.colors.text} style={styles.arabicDhikr}>
          {currentPhase.arabic}
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.translationText}>
          {currentPhase.transliteration} — "{currentPhase.translation}"
        </AppText>
      </View>

      {/* Big Interactive Tap Button */}
      <Pressable
        onPress={handleIncrement}
        style={({ pressed }) => [
          styles.tapButton,
          {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.accent,
          },
          pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
        ]}
      >
        <View style={styles.tapButtonContent}>
          <AppText variant="titleLarge" color={theme.colors.textInverse} style={styles.countText}>
            {count} / {currentPhase.target}
          </AppText>
          <AppText variant="caption" color={theme.colors.accentLight} style={styles.tapHint}>
            Tap to count Dhikr
          </AppText>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.md + 2,
    borderRadius: RADIUS.xxl,
    borderWidth: 1.5,
    gap: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  beadsSvgWrapper: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 3,
    marginLeft: SPACING.xs,
  },
  badgePill: {
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
  cycleLabel: {
    fontWeight: '600',
    fontSize: 11,
  },
  resetBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetText: {
    fontWeight: '700',
    fontSize: 11,
  },
  dhikrContent: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: SPACING.xs,
  },
  arabicDhikr: {
    fontSize: 26,
    lineHeight: 38,
    fontWeight: '700',
  },
  translationText: {
    fontWeight: '500',
    fontSize: 12,
  },
  tapButton: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tapButtonContent: {
    alignItems: 'center',
    gap: 2,
  },
  countText: {
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: 1,
  },
  tapHint: {
    fontWeight: '600',
    fontSize: 11,
  },
});

