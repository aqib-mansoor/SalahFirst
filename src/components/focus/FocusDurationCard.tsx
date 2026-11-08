import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { FocusDuration } from '@/types';

export interface FocusDurationCardProps {
  selectedDuration: FocusDuration;
  onSelectDuration: (duration: FocusDuration) => void;
}

const DURATIONS: FocusDuration[] = [10, 15, 20, 30];

export const FocusDurationCard: React.FC<FocusDurationCardProps> = ({
  selectedDuration,
  onSelectDuration,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.titleColumn}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
          Focus Session Duration
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
          Shield notifications and distractions during Salah
        </AppText>
      </View>

      <View style={styles.durationsRow}>
        {DURATIONS.map((dur) => {
          const isSelected = selectedDuration === dur;
          return (
            <Pressable
              key={dur}
              onPress={() => onSelectDuration(dur)}
              accessibilityRole="button"
              accessibilityLabel={`${dur} minutes focus duration`}
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.pill,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceSubtle,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <AppText
                variant="bodyMedium"
                color={isSelected ? theme.colors.textOnPrimary : theme.colors.text}
                style={styles.pillText}
              >
                {dur}m
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm + 2,
  },
  titleColumn: {
    gap: 2,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
  },
  durationsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  pillText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
