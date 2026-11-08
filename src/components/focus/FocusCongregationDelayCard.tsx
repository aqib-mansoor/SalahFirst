import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface FocusCongregationDelayCardProps {
  prayerName: string;
  selectedDelayMinutes: number;
  rawAzanDate?: Date;
  onSelectDelay: (minutes: number) => void;
}

const DELAY_OPTIONS = [0, 15, 20, 30, 45, 60];

export const FocusCongregationDelayCard: React.FC<FocusCongregationDelayCardProps> = ({
  prayerName,
  selectedDelayMinutes,
  rawAzanDate,
  onSelectDelay,
}) => {
  const theme = useTheme();

  // Compute live focus start time preview
  const previewTimeText = React.useMemo(() => {
    if (!rawAzanDate || isNaN(rawAzanDate.getTime())) {
      return selectedDelayMinutes === 0 ? 'Starts immediately at Azan' : `Starts ${selectedDelayMinutes}m after Azan`;
    }
    const azanHours = rawAzanDate.getHours();
    const azanMins = rawAzanDate.getMinutes();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const azanStr = `${pad(azanHours)}:${pad(azanMins)}`;

    const focusDate = new Date(rawAzanDate.getTime() + selectedDelayMinutes * 60 * 1000);
    const focusHours = focusDate.getHours();
    const focusMins = focusDate.getMinutes();
    const focusStr = `${pad(focusHours)}:${pad(focusMins)}`;

    return selectedDelayMinutes === 0
      ? `Azan ${azanStr} • Starts immediately`
      : `Azan ${azanStr} → Focus at ${focusStr} (+${selectedDelayMinutes}m)`;
  }, [rawAzanDate, selectedDelayMinutes]);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
            Congregation Delay ({prayerName === 'All' ? 'Default' : prayerName})
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
            Delay focus until local prayer or Iqamah starts
          </AppText>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {DELAY_OPTIONS.map((mins) => {
          const isSelected = selectedDelayMinutes === mins;
          const label = mins === 0 ? '0m (Azan)' : `+${mins}m`;

          return (
            <Pressable
              key={mins}
              onPress={() => onSelectDelay(mins)}
              accessibilityRole="button"
              accessibilityLabel={`${label} delay`}
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.delayPill,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceSubtle,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <AppText
                variant="caption"
                color={isSelected ? theme.colors.textOnPrimary : theme.colors.text}
                style={styles.pillText}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Live Preview Box */}
      <View
        style={[
          styles.previewBox,
          { backgroundColor: theme.colors.mintTint, borderColor: theme.colors.border },
        ]}
      >
        <AppText variant="caption" color={theme.colors.primary} style={styles.previewText}>
          {previewTimeText}
        </AppText>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  delayPill: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontWeight: '700',
    fontSize: 12,
  },
  previewBox: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  previewText: {
    fontWeight: '600',
    fontSize: 12,
  },
});
