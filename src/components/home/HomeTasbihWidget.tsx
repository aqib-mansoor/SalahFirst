import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { storage } from '@/utils/storage';
import { DHIKR_PHASES, DhikrPhase } from '@/data/tasbihData';

const TASBIH_STORAGE_KEY = '@salahfirst_tasbih_state';

interface TasbihPersistedState {
  count: number;
  phaseIndex: number;
  totalCycles: number;
}

export const HomeTasbihWidget: React.FC = () => {
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
      await storage.set(TASBIH_STORAGE_KEY, { count: newCount, phaseIndex: newPhase, totalCycles: newCycles });
    },
    []
  );

  const currentPhase: DhikrPhase = DHIKR_PHASES[phaseIndex] || DHIKR_PHASES[0];
  const progressPercent = Math.min(100, Math.max(0, (count / currentPhase.target) * 100));

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
    Alert.alert('Reset Tasbih', 'Reset your current Dhikr counter to zero?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          setCount(0);
          setPhaseIndex(0);
          await persistState(0, 0, totalCycles);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.title}>
            Post-Salah Tasbih
          </AppText>
          {totalCycles > 0 && (
            <View style={[styles.cyclesBadge, { backgroundColor: theme.colors.accentTint, borderColor: theme.colors.accent }]}>
              <AppText variant="caption" color={theme.colors.textPrimary} style={styles.cyclesText}>
                {totalCycles} {totalCycles === 1 ? 'cycle' : 'cycles'}
              </AppText>
            </View>
          )}
        </View>

        <Pressable onPress={handleReset} hitSlop={8} accessibilityRole="button" accessibilityLabel="Reset Tasbih" style={styles.resetButton}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke={theme.colors.textSecondary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3 3v5h5" stroke={theme.colors.textSecondary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.resetText}>
            Reset
          </AppText>
        </Pressable>
      </View>

      {/* Interactive Card */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: 'rgba(243, 196, 64, 0.40)' }]}>
        <View style={[styles.leftAccentBar, { backgroundColor: theme.colors.accent }]} />

        <View style={styles.cardInner}>
          {/* Left: Dhikr Info */}
          <View style={styles.leftCol}>
            <View style={styles.phasePillRow}>
              <View style={[styles.phasePill, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.primary }]}>
                <AppText variant="caption" color={theme.colors.primary} style={styles.phaseText}>
                  Phase {phaseIndex + 1} of 3
                </AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.targetCountText}>
                Goal: {currentPhase.target}
              </AppText>
            </View>

            <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.arabicDhikr}>
              {currentPhase.arabic}
            </AppText>

            <AppText variant="bodySmall" color={theme.colors.textSecondary} style={styles.translitText}>
              {currentPhase.transliteration} • <AppText color={theme.colors.textSecondary} style={styles.meaningText}>{currentPhase.translation}</AppText>
            </AppText>

            {/* Progress */}
            <View style={styles.progressRow}>
              <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
                <View style={[styles.progressFill, { backgroundColor: theme.colors.accent, width: `${progressPercent}%` }]} />
              </View>
              <AppText variant="caption" color={theme.colors.primary} style={styles.progressFraction}>
                {count}/{currentPhase.target}
              </AppText>
            </View>
          </View>

          {/* Right: Tactile Circular Tap Button */}
          <Pressable
            onPress={handleIncrement}
            accessibilityRole="button"
            accessibilityLabel={`Count ${count} of ${currentPhase.target}`}
            style={({ pressed }) => [
              styles.tapButton,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.accent,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
          >
            <AppText style={styles.tapCountNumber}>{count}</AppText>
            <AppText variant="caption" color={theme.colors.accent} style={styles.tapSubLabel}>TAP</AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: SPACING.xs + 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleWithBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  title: { fontWeight: '800', letterSpacing: -0.2 },
  cyclesBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full, borderWidth: 1 },
  cyclesText: { fontWeight: '700', fontSize: 10.5 },
  resetButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resetText: { fontWeight: '600' },
  card: {
    borderRadius: RADIUS.xl, borderWidth: 1.2, overflow: 'hidden', position: 'relative',
    shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  leftAccentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3.5 },
  cardInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.md + 2, paddingLeft: SPACING.lg, gap: SPACING.md,
  },
  leftCol: { flex: 1, gap: 4 },
  phasePillRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  phasePill: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full, borderWidth: 1 },
  phaseText: { fontWeight: '700', fontSize: 10 },
  targetCountText: { fontSize: 11, fontWeight: '500' },
  arabicDhikr: { fontSize: 19, fontWeight: '700', lineHeight: 28 },
  translitText: { fontSize: 12, fontWeight: '700' },
  meaningText: { fontWeight: '400' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 4 },
  progressTrack: { flex: 1, height: 5, borderRadius: RADIUS.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: RADIUS.full },
  progressFraction: { fontSize: 11, fontWeight: '700' },
  tapButton: {
    width: 74, height: 74, borderRadius: 37, borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#072418', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  tapCountNumber: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', lineHeight: 30, fontVariant: ['tabular-nums'] },
  tapSubLabel: { fontSize: 9.5, fontWeight: '800', letterSpacing: 1 },
});
