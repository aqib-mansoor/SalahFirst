import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { storage } from '@/utils/storage';
import { MisbahaBeadsSvg } from './MisbahaBeadsSvg';

const TASBIH_STORAGE_KEY = '@salahfirst_tasbih_state';

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

interface TasbihPersistedState {
  count: number;
  phaseIndex: number;
  totalCycles: number;
}

export const TasbihCounter3D: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [totalCycles, setTotalCycles] = useState<number>(0);

  useEffect(() => {
    const loadState = async () => {
      const saved = await storage.get<TasbihPersistedState | null>(TASBIH_STORAGE_KEY, null);
      if (saved) {
        setCount(saved.count ?? 0);
        setPhaseIndex(saved.phaseIndex ?? 0);
        setTotalCycles(saved.totalCycles ?? 0);
      }
    };
    loadState();
  }, []);

  const persistState = useCallback(
    async (newCount: number, newPhase: number, newCycles: number) => {
      await storage.set(TASBIH_STORAGE_KEY, {
        count: newCount,
        phaseIndex: newPhase,
        totalCycles: newCycles,
      });
    },
    []
  );

  const currentPhase = DHIKR_PHASES[phaseIndex];

  const handleIncrement = () => {
    if (count + 1 >= currentPhase.target) {
      if (phaseIndex + 1 < DHIKR_PHASES.length) {
        const nextPhase = phaseIndex + 1;
        setPhaseIndex(nextPhase);
        setCount(0);
        persistState(0, nextPhase, totalCycles);
      } else {
        const nextCycles = totalCycles + 1;
        setPhaseIndex(0);
        setCount(0);
        setTotalCycles(nextCycles);
        persistState(0, 0, nextCycles);
      }
    } else {
      const nextCount = count + 1;
      setCount(nextCount);
      persistState(nextCount, phaseIndex, totalCycles);
    }
  };

  const handleReset = () => {
    if (count === 0 && phaseIndex === 0) return;

    Alert.alert(
      t('resetTasbihTitle'),
      t('resetTasbihConfirm'),
      [
        { text: t('keepCounting'), style: 'cancel' },
        {
          text: t('reset'),
          style: 'destructive',
          onPress: async () => {
            setCount(0);
            setPhaseIndex(0);
            await persistState(0, 0, totalCycles);
          },
        },
      ]
    );
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
      {/* Header & Misbaha Beads */}
      <View style={styles.topRow}>
        <MisbahaBeadsSvg />

        <View style={styles.headerInfo}>
          <View style={[styles.badgePill, { backgroundColor: theme.colors.mintTint }]}>
            <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
              {t('afterSalahTasbih')}
            </AppText>
          </View>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.cycleLabel}>
            {t('step')} {phaseIndex + 1} {t('of')} 3 • {currentPhase.transliteration}
            {totalCycles > 0 ? ` (${totalCycles} ${t('completedSuffix')})` : ''}
          </AppText>
        </View>

        <Pressable
          onPress={handleReset}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Reset Tasbih counter"
          style={styles.resetBtn}
        >
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.resetText}>
            ↺ {t('reset')}
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

      {/* Interactive Tap Button */}
      <Pressable
        onPress={handleIncrement}
        accessibilityRole="button"
        accessibilityLabel={`${currentPhase.transliteration}, ${count} of ${currentPhase.target}`}
        accessibilityHint="Tap to increment Dhikr count"
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
            {t('tapToCount')}
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
