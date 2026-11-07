import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { ReminderOffset } from '@/types';

export interface PrePrayerReminderCardProps {
  currentOffset: ReminderOffset;
  onSelectOffset: (offset: ReminderOffset) => void;
}

const REMINDER_OPTIONS: { id: ReminderOffset; label: string }[] = [
  { id: 'off', label: 'Off' },
  { id: '10m', label: '10m\nbefore' },
  { id: '15m', label: '15m\nbefore' },
  { id: '30m', label: '30m\nbefore' },
];

export const PrePrayerReminderCard: React.FC<PrePrayerReminderCardProps> = ({
  currentOffset,
  onSelectOffset,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
        Pre-Prayer Gentle Reminder
      </AppText>

      <View style={styles.reminderRow}>
        {REMINDER_OPTIONS.map((opt) => {
          const active = currentOffset === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelectOffset(opt.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Pre-prayer reminder ${opt.label.replace('\n', ' ')}`}
              style={[
                styles.reminderPill,
                {
                  backgroundColor: active ? theme.colors.primary : theme.colors.surfaceElevated,
                },
              ]}
            >
              <AppText
                variant="caption"
                color={active ? theme.colors.surface : theme.colors.text}
                align="center"
                style={{ fontWeight: active ? '700' : '500' }}
              >
                {opt.label}
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
    gap: SPACING.sm,
  },
  boldText: {
    fontWeight: '700',
  },
  reminderRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  reminderPill: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
});

