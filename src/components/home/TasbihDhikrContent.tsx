import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS, Theme } from '@/constants/theme';
import { AppText } from '@/components/common';
import { DHIKR_PHASES, DhikrPhase } from '@/data/tasbihData';
import { useTranslation } from '@/context/LocalizationContext';

export interface TasbihDhikrContentProps {
  currentPhase: DhikrPhase;
  phaseIndex: number;
  count: number;
  progressPercent: number;
  theme: Theme;
  onSelectPhase: (index: number) => void;
}

export const TasbihDhikrContent: React.FC<TasbihDhikrContentProps> = ({
  currentPhase,
  phaseIndex,
  count,
  progressPercent,
  theme,
  onSelectPhase,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.leftCol}>
      {/* Step Indicator + Phase Pills */}
      <View style={styles.stepHeaderRow}>
        <AppText variant="caption" color={theme.colors.textSecondary} style={styles.stepLabel}>
          {t('dhikrStepOf', { current: phaseIndex + 1, total: DHIKR_PHASES.length })}
        </AppText>
        <View style={styles.dotsRow}>
          {DHIKR_PHASES.map((phase, idx) => {
            const isActive = idx === phaseIndex;
            const isDone = idx < phaseIndex;
            return (
              <Pressable
                key={phase.transliteration}
                onPress={() => onSelectPhase(idx)}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`Switch to ${phase.transliteration}`}
                style={[
                  styles.stepDot,
                  isActive
                    ? { width: 14, backgroundColor: theme.colors.primary }
                    : isDone
                    ? { width: 6, backgroundColor: theme.colors.secondary }
                    : { width: 6, backgroundColor: theme.colors.border },
                ]}
              />
            );
          })}
        </View>
      </View>

      <AppText variant="titleMedium" color={theme.colors.textPrimary} style={styles.arabicDhikr}>
        {currentPhase.arabic}
      </AppText>

      <AppText variant="bodySmall" color={theme.colors.primary} style={styles.translitText}>
        {currentPhase.transliteration} •{' '}
        <AppText color={theme.colors.textSecondary} style={styles.meaningText}>
          {t(currentPhase.translationKey as any) || currentPhase.translation}
        </AppText>
      </AppText>

      {/* Mini Progress Track */}
      <View style={styles.progressRow}>
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceSubtle }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.colors.primary, width: `${progressPercent}%` },
            ]}
          />
        </View>
        <AppText variant="caption" color={theme.colors.textSecondary} style={styles.progressFraction}>
          {count}/{currentPhase.target}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftCol: {
    flex: 1,
    gap: 4,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 1,
  },
  stepLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    height: 5,
    borderRadius: 2.5,
  },
  arabicDhikr: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  translitText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  meaningText: {
    fontWeight: '400',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  progressFraction: {
    fontSize: 11,
    fontWeight: '700',
  },
});

