import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas } from '@/components/common';
import { DHIKR_PHASES, DhikrPhase } from '@/data/tasbihData';
import { OrbitingMisbahaHalo } from './OrbitingMisbahaHalo';
import { TasbihResetModal } from './TasbihResetModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { incrementTasbih, resetAllTasbih } from '@/store/slices/tasbihSlice';

export const HomeTasbihWidget: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { count, phaseIndex, totalCycles } = useAppSelector((state) => state.tasbih);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const currentPhase: DhikrPhase = DHIKR_PHASES[phaseIndex] || DHIKR_PHASES[0];
  const progressPercent = Math.min(100, Math.max(0, (count / currentPhase.target) * 100));

  const handleIncrement = () => {
    dispatch(incrementTasbih());
  };

  const handleResetPress = () => {
    if (count === 0 && phaseIndex === 0) return;
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    dispatch(resetAllTasbih());
    setShowResetModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
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

        <Pressable onPress={handleResetPress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Reset Tasbih" style={styles.resetButton}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke={theme.colors.textSecondary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3 3v5h5" stroke={theme.colors.textSecondary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.resetText}>
            Reset
          </AppText>
        </Pressable>
      </View>

      {/* Royal Emerald Jewel Card with Gold Mihrab Canvas */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.primaryHero,
            borderColor: 'rgba(243, 196, 64, 0.40)',
          },
        ]}
      >
        <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.15} />

        <View style={styles.cardInner}>
          {/* Left: Dhikr Info & Progress */}
          <View style={styles.leftCol}>
            <AppText variant="titleMedium" color="#FFFFFF" style={styles.arabicDhikr}>
              {currentPhase.arabic}
            </AppText>

            <AppText variant="bodySmall" color={theme.colors.accentLight} style={styles.translitText}>
              {currentPhase.transliteration} • <AppText color="rgba(255, 255, 255, 0.85)" style={styles.meaningText}>{currentPhase.translation}</AppText>
            </AppText>

            {/* Mini Progress Track */}
            <View style={styles.progressRow}>
              <View style={[styles.progressTrack, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <View style={[styles.progressFill, { backgroundColor: theme.colors.accent, width: `${progressPercent}%` }]} />
              </View>
              <AppText variant="caption" color={theme.colors.accentLight} style={styles.progressFraction}>
                {count}/{currentPhase.target}
              </AppText>
            </View>
          </View>

          {/* Right: Orbiting Misbaha Bead Step & Tactile Tap Button */}
          <OrbitingMisbahaHalo
            count={count}
            target={currentPhase.target}
            onPress={handleIncrement}
            theme={theme}
          />
        </View>
      </View>

      {/* Attractive Islamic Tasbih Reset Confirmation Modal */}
      <TasbihResetModal
        visible={showResetModal}
        count={count}
        target={currentPhase.target}
        dhikrName={currentPhase.transliteration}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />
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
    shadowColor: '#000000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 14, elevation: 4,
  },
  cardInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.md + 2, paddingLeft: SPACING.lg, gap: SPACING.md,
  },
  leftCol: { flex: 1, gap: 4 },
  arabicDhikr: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
  translitText: { fontSize: 12.5, fontWeight: '700' },
  meaningText: { fontWeight: '400' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 4 },
  progressTrack: { flex: 1, height: 5, borderRadius: RADIUS.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: RADIUS.full },
  progressFraction: { fontSize: 11, fontWeight: '800' },
});
