import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { ReminderOffset } from '@/types';
import { useTranslation } from '@/context/LocalizationContext';

export interface PrePrayerReminderCardProps {
  currentOffset: ReminderOffset;
  onSelectOffset: (offset: ReminderOffset) => void;
}

const REMINDER_OPTIONS: { id: ReminderOffset; label: string }[] = [
  { id: 'off', label: 'Off' },
  { id: '10m', label: '10 min' },
  { id: '15m', label: '15 min' },
  { id: '30m', label: '30 min' },
];

export const PrePrayerReminderCard: React.FC<PrePrayerReminderCardProps> = ({
  currentOffset,
  onSelectOffset,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const getDisplayOffset = () => {
    if (currentOffset === 'off') return t('off');
    return `${currentOffset.replace('m', '')} min`;
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.header}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
          {t('prePrayerReminder')}
        </AppText>
        <View style={[styles.activeTag, { backgroundColor: theme.colors.secondaryTint }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.tagText}>
            {getDisplayOffset()}
          </AppText>
        </View>
      </View>

      {/* Single-line Unified Segmented Control Track */}
      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {REMINDER_OPTIONS.map((opt) => {
          const active = currentOffset === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelectOffset(opt.id)}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Reminder ${opt.label}`}
              style={[
                styles.segment,
                active && [
                  styles.activeSegment,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.primary,
                  },
                ],
              ]}
            >
              <AppText
                variant="caption"
                color={active ? theme.colors.primary : theme.colors.textMuted}
                align="center"
                numberOfLines={1}
                style={{ fontWeight: active ? '700' : '600', fontSize: 12 }}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '700',
    fontSize: 13,
  },
  activeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  track: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegment: {
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
