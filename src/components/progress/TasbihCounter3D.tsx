import React from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { MisbahaBeadsSvg } from './MisbahaBeadsSvg';
import { DHIKR_PHASES, DhikrPhase } from '@/data/tasbihData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { incrementTasbih, resetAllTasbih } from '@/store/slices/tasbihSlice';

export { DhikrPhase };

export const TasbihCounter3D: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { count, phaseIndex, totalCycles } = useAppSelector((state) => state.tasbih);

  const currentPhase = DHIKR_PHASES[phaseIndex] || DHIKR_PHASES[0];

  const handleIncrement = () => {
    dispatch(incrementTasbih());
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
          onPress: () => {
            dispatch(resetAllTasbih());
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
            {t('step')} {phaseIndex + 1} {t('of')} {DHIKR_PHASES.length} • {currentPhase.transliteration}
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
