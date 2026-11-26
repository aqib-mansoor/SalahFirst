import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, ThreeDTasbihIcon } from '@/components/common';
import { DHIKR_PHASES, DhikrPhase } from '@/data/tasbihData';
import { OrbitingMisbahaHalo } from './OrbitingMisbahaHalo';
import { TasbihResetModal } from './TasbihResetModal';
import { TasbihDhikrContent } from './TasbihDhikrContent';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { incrementTasbih, resetAllTasbih, selectTasbihPhase } from '@/store/slices/tasbihSlice';
import { useTranslation } from '@/context/LocalizationContext';
import { triggerHaptic } from '@/utils/haptics';

export const HomeTasbihWidget: React.FC = React.memo(() => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { count, phaseIndex, totalCycles } = useAppSelector((state) => state.tasbih);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const currentPhase: DhikrPhase = DHIKR_PHASES[phaseIndex] || DHIKR_PHASES[0];
  const progressPercent = Math.min(100, Math.max(0, (count / currentPhase.target) * 100));

  const handleIncrement = () => {
    const isPhaseComplete = count + 1 >= currentPhase.target;
    triggerHaptic(isPhaseComplete ? 'success' : 'light');
    dispatch(incrementTasbih());
  };

  const handleResetPress = () => {
    if (count === 0 && phaseIndex === 0) return;
    triggerHaptic('light');
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    triggerHaptic('medium');
    dispatch(resetAllTasbih());
    setShowResetModal(false);
  };

  const handleSelectPhase = useCallback(
    (index: number) => {
      dispatch(selectTasbihPhase(index));
    },
    [dispatch]
  );

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.title}>
            {t('postSalahTasbih')}
          </AppText>
          {totalCycles > 0 && (
            <View style={[styles.cyclesBadge, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
              <AppText variant="caption" color={theme.colors.textSecondary} style={styles.cyclesText}>
                {totalCycles} {totalCycles === 1 ? t('cycleSingular') : t('cyclesPlural')}
              </AppText>
            </View>
          )}
        </View>

        <Pressable
          onPress={handleResetPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('reset')}
          style={styles.resetButton}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
              stroke={theme.colors.textSecondary}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M3 3v5h5"
              stroke={theme.colors.textSecondary}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.resetText}>
            {t('reset')}
          </AppText>
        </Pressable>
      </View>

      {/* Crisp Surface Strip (Zero Container Fatigue) */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            shadowColor: '#000000',
          },
        ]}
      >
        <View style={styles.cardInner}>
          <TasbihDhikrContent
            currentPhase={currentPhase}
            phaseIndex={phaseIndex}
            count={count}
            progressPercent={progressPercent}
            theme={theme}
            onSelectPhase={handleSelectPhase}
          />

          {/* Right: Orbiting Misbaha Bead Step & Tactile Tap Jewel */}
          <OrbitingMisbahaHalo
            count={count}
            target={currentPhase.target}
            onPress={handleIncrement}
            theme={theme}
          />
        </View>
      </View>

      {/* Islamic Tasbih Reset Confirmation Modal */}
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
});

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cyclesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  cyclesText: {
    fontWeight: '700',
    fontSize: 10.5,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetText: {
    fontWeight: '600',
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md + 2,
    paddingLeft: SPACING.lg,
    gap: SPACING.md,
  },
});
