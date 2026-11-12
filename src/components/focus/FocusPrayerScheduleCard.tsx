import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, PrayerTimeIcon } from '@/components/common';
import { FocusDuration } from '@/types';
import { PrayerFocusOffsets, PrayerFocusDurations } from '@/utils/prayerFocusOffsets';

export interface FocusPrayerScheduleCardProps {
  offsets: PrayerFocusOffsets;
  durations: PrayerFocusDurations;
  rawPrayerDates?: Record<string, Date>;
  onUpdateDelay: (prayer: keyof PrayerFocusOffsets, mins: number) => void;
  onUpdateDuration: (prayer: keyof PrayerFocusDurations, mins: FocusDuration) => void;
}

const PRAYERS: { key: keyof PrayerFocusOffsets; name: string }[] = [
  { key: 'fajr', name: 'Fajr' },
  { key: 'dhuhr', name: 'Dhuhr' },
  { key: 'asr', name: 'Asr' },
  { key: 'maghrib', name: 'Maghrib' },
  { key: 'isha', name: 'Isha' },
];

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const FocusPrayerScheduleCard: React.FC<FocusPrayerScheduleCardProps> = ({
  offsets,
  durations,
  rawPrayerDates,
  onUpdateDelay,
  onUpdateDuration,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.titleColumn}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
          Prayer Focus Schedule
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
          Set congregation delay and focus duration per Salah
        </AppText>
      </View>

      <View style={styles.prayersList}>
        {PRAYERS.map((p, idx) => {
          const delay = offsets[p.key] ?? 20;
          const duration = durations[p.key] ?? 15;
          const azanDate = rawPrayerDates?.[p.key];

          let preview = delay === 0 ? 'Starts at Azan' : `+${delay}m after Azan`;
          if (azanDate && !isNaN(azanDate.getTime())) {
            const azanStr = `${pad(azanDate.getHours())}:${pad(azanDate.getMinutes())}`;
            const focusStart = new Date(azanDate.getTime() + delay * 60000);
            const focusEnd = new Date(focusStart.getTime() + duration * 60000);
            const startStr = `${pad(focusStart.getHours())}:${pad(focusStart.getMinutes())}`;
            const endStr = `${pad(focusEnd.getHours())}:${pad(focusEnd.getMinutes())}`;
            preview = `Azan ${azanStr} → Focus ${startStr}-${endStr}`;
          }

          return (
            <View
              key={p.key}
              style={[
                styles.prayerRow,
                idx < PRAYERS.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
              ]}
            >
              <View style={styles.topInfo}>
                <View style={styles.prayerTitleRow}>
                  <AppText variant="bodyMedium" color={theme.colors.text} style={styles.prayerName}>
                    {p.name}
                  </AppText>
                  <PrayerTimeIcon prayer={p.name} size={16} />
                </View>
                <AppText variant="caption" color={theme.colors.primary} style={styles.previewText}>
                  {preview}
                </AppText>
              </View>

              <View style={styles.controlsRow}>
                {/* Delay Stepper */}
                <View style={styles.stepperGroup}>
                  <AppText variant="caption" color={theme.colors.textMuted} style={styles.stepperLabel}>
                    Delay
                  </AppText>
                  <View style={[styles.stepper, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
                    <Pressable
                      onPress={() => onUpdateDelay(p.key, Math.max(0, delay - 5))}
                      hitSlop={6}
                      disabled={delay <= 0}
                      style={({ pressed }) => [styles.stepBtn, (delay <= 0 || pressed) && { opacity: 0.4 }]}
                    >
                      <AppText variant="bodyMedium" color={theme.colors.text} style={styles.btnText}>-</AppText>
                    </Pressable>
                    <AppText variant="caption" color={theme.colors.primary} style={styles.valueText}>
                      {delay === 0 ? '0m' : `+${delay}m`}
                    </AppText>
                    <Pressable
                      onPress={() => onUpdateDelay(p.key, Math.min(90, delay + 5))}
                      hitSlop={6}
                      disabled={delay >= 90}
                      style={({ pressed }) => [styles.stepBtn, (delay >= 90 || pressed) && { opacity: 0.4 }]}
                    >
                      <AppText variant="bodyMedium" color={theme.colors.text} style={styles.btnText}>+</AppText>
                    </Pressable>
                  </View>
                </View>

                {/* Duration Stepper */}
                <View style={styles.stepperGroup}>
                  <AppText variant="caption" color={theme.colors.textMuted} style={styles.stepperLabel}>
                    Focus
                  </AppText>
                  <View style={[styles.stepper, { backgroundColor: theme.colors.surfaceSubtle, borderColor: theme.colors.border }]}>
                    <Pressable
                      onPress={() => onUpdateDuration(p.key, Math.max(5, duration - 5) as FocusDuration)}
                      hitSlop={6}
                      disabled={duration <= 5}
                      style={({ pressed }) => [styles.stepBtn, (duration <= 5 || pressed) && { opacity: 0.4 }]}
                    >
                      <AppText variant="bodyMedium" color={theme.colors.text} style={styles.btnText}>-</AppText>
                    </Pressable>
                    <AppText variant="caption" color={theme.colors.text} style={styles.valueText}>
                      {duration}m
                    </AppText>
                    <Pressable
                      onPress={() => onUpdateDuration(p.key, Math.min(60, duration + 5) as FocusDuration)}
                      hitSlop={6}
                      disabled={duration >= 60}
                      style={({ pressed }) => [styles.stepBtn, (duration >= 60 || pressed) && { opacity: 0.4 }]}
                    >
                      <AppText variant="bodyMedium" color={theme.colors.text} style={styles.btnText}>+</AppText>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: SPACING.md, borderRadius: RADIUS.xl, borderWidth: 1, gap: SPACING.sm + 2 },
  titleColumn: { gap: 2 },
  title: { fontWeight: '700', fontSize: 14 },
  subtitle: { fontSize: 12 },
  prayersList: { gap: 2 },
  prayerRow: { paddingVertical: SPACING.sm + 2, gap: 6 },
  topInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prayerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  prayerName: { fontWeight: '700', fontSize: 14 },
  previewText: { fontSize: 11, fontWeight: '600' },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.md },
  stepperGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  stepperLabel: { fontSize: 11, fontWeight: '600' },
  stepper: { flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.full, borderWidth: 1, height: 32, paddingHorizontal: 4 },
  stepBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: '700', fontSize: 16, lineHeight: 18 },
  valueText: { minWidth: 38, textAlign: 'center', fontWeight: '700', fontSize: 12 },
});

