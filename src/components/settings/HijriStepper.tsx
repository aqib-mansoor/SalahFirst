import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface HijriStepperProps {
  adjustment: number;
  onUpdate: (newAdjustment: number) => void;
}

export const HijriStepper: React.FC<HijriStepperProps> = ({ adjustment, onUpdate }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onUpdate(adjustment - 1)}
        disabled={adjustment <= -2}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: theme.colors.surfaceSubtle,
            borderColor: theme.colors.border,
            opacity: adjustment <= -2 ? 0.35 : pressed ? 0.7 : 1,
          },
        ]}
        hitSlop={6}
      >
        <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.sign}>
          −
        </AppText>
      </Pressable>

      <View style={[styles.pill, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.primary }]}>
        <AppText variant="caption" color={theme.colors.primary} style={styles.text}>
          {adjustment > 0 ? `+${adjustment}` : adjustment}d
        </AppText>
      </View>

      <Pressable
        onPress={() => onUpdate(adjustment + 1)}
        disabled={adjustment >= 2}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: theme.colors.surfaceSubtle,
            borderColor: theme.colors.border,
            opacity: adjustment >= 2 ? 0.35 : pressed ? 0.7 : 1,
          },
        ]}
        hitSlop={6}
      >
        <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.sign}>
          +
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  btn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sign: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '600',
  },
  pill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    minWidth: 38,
    alignItems: 'center',
  },
  text: {
    fontWeight: '800',
    fontSize: 11,
  },
});

