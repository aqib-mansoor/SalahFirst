import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppButton } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface FocusCompletionModalProps {
  visible: boolean;
  prayerName: string;
  breachCount?: number;
  onConfirmPrayed: () => void;
  onNotYet: () => void;
}

export const FocusCompletionModal: React.FC<FocusCompletionModalProps> = ({
  visible,
  prayerName,
  breachCount = 0,
  onConfirmPrayed,
  onNotYet,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View
          style={[
            styles.badgePill,
            {
              backgroundColor: breachCount === 0 ? theme.colors.mintTint : theme.colors.warningBg,
            },
          ]}
        >
          <AppText
            variant="caption"
            color={breachCount === 0 ? theme.colors.primary : theme.colors.warning}
            style={styles.badgeText}
          >
            {breachCount === 0
              ? '🛡️ ZERO DISTRACTIONS • FULL KHUSHU'
              : `⚠️ ${breachCount} DISTRACTION INTERRUPTION(S)`}
          </AppText>
        </View>

        <AppText variant="titleMedium" color={theme.colors.text} align="center" style={styles.title}>
          {t('didYouCompletePrayer')}
        </AppText>

        <AppText variant="bodySmall" color={theme.colors.textMuted} align="center" style={styles.subtitle}>
          {prayerName} • May Allah accept your worship and bless your focus.
        </AppText>

        <View style={styles.actions}>
          <AppButton
            label={t('yesPrayed')}
            onPress={onConfirmPrayed}
            size="md"
            style={[styles.completeBtn, { backgroundColor: theme.colors.primary }]}
          />

          <Pressable onPress={onNotYet} hitSlop={12} style={styles.notYetBtn}>
            <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.notYetText}>
              {t('notYet')}
            </AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    zIndex: 99,
  },
  card: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: RADIUS.xxl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  badgePill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  title: {
    fontWeight: '800',
    fontSize: 20,
  },
  subtitle: {
    lineHeight: 18,
  },
  actions: {
    width: '100%',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    alignItems: 'center',
  },
  completeBtn: {
    width: '100%',
  },
  notYetBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  notYetText: {
    fontWeight: '600',
  },
});
