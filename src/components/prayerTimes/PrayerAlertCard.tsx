import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { NotificationMode } from '@/types';

export interface PrayerAlertCardProps {
  name: string;
  time: string;
  currentMode: NotificationMode;
  onSelectMode: (mode: NotificationMode) => void;
}

const ALERT_MODES: { id: NotificationMode; label: string }[] = [
  { id: 'AZAN', label: 'Full\nAzan' },
  { id: 'TONE', label: 'Tone' },
  { id: 'VIBRATE', label: 'Vibrate' },
  { id: 'SILENT', label: 'Silent' },
];

export const PrayerAlertCard: React.FC<PrayerAlertCardProps> = ({
  name,
  time,
  currentMode,
  onSelectMode,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.header}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
          {name} ({time})
        </AppText>
        <AppText variant="caption" color={theme.colors.primary} style={styles.boldText}>
          {currentMode}
        </AppText>
      </View>

      <View style={styles.modesRow}>
        {ALERT_MODES.map((mode) => {
          const active = currentMode === mode.id;
          return (
            <Pressable
              key={mode.id}
              onPress={() => onSelectMode(mode.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${name} alert mode ${mode.label.replace('\n', ' ')}`}
              style={[
                styles.modePill,
                {
                  backgroundColor: active ? theme.colors.primary : theme.colors.surfaceElevated,
                },
              ]}
            >
              <AppText
                variant="caption"
                color={active ? theme.colors.surface : theme.colors.text}
                align="center"
                style={styles.modePillText}
              >
                {mode.label}
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
  },
  modesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  modePill: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  modePillText: {
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 14,
  },
});

