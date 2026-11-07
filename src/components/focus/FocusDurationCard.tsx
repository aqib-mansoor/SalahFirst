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
  const theme = useTheme('light');

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
        Focus Session Duration
      </AppText>

      <View style={styles.durationsRow}>
        {DURATIONS.map((dur) => {
          const isSelected = selectedDuration === dur;
          return (
            <Pressable
              key={dur}
              onPress={() => onSelectDuration(dur)}
              style={({ pressed }) => [
                styles.pill,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceElevated,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <AppText
                variant="titleSmall"
                color={isSelected ? theme.colors.surface : theme.colors.text}
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
    gap: SPACING.md,
  },
  title: {
    fontWeight: '700',
  },
  durationsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: SPACING.md - 2,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  pillText: {
    fontWeight: '700',
  },
});

