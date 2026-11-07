import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, AppButton } from '@/components/common';

export interface FocusCompletionModalProps {
  visible: boolean;
  prayerName: string;
  onConfirmPrayed: () => void;
  onNotYet: () => void;
}

export const FocusCompletionModal: React.FC<FocusCompletionModalProps> = ({
  visible,
  prayerName,
  onConfirmPrayed,
  onNotYet,
}) => {
  const theme = useTheme('dark');

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.badgePill, { backgroundColor: theme.colors.mintTint }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
            FOCUS SESSION FINISHED
          </AppText>
        </View>

        <AppText variant="titleMedium" color={theme.colors.text} align="center" style={styles.title}>
          Did you complete your prayer?
        </AppText>

        <AppText variant="bodySmall" color={theme.colors.textMuted} align="center" style={styles.subtitle}>
          {prayerName} • May Allah accept your worship and bless your focus.
        </AppText>

        <View style={styles.actions}>
          <AppButton
            label="Yes, I prayed"
            onPress={onConfirmPrayed}
            size="md"
            style={[styles.completeBtn, { backgroundColor: theme.colors.primary }]}
          />

          <Pressable onPress={onNotYet} hitSlop={12} style={styles.notYetBtn}>
            <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.notYetText}>
              Not yet
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
