import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export type FocusPrayerSelection = 'All' | 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface FocusPrayerSelectorProps {
  selectedPrayer: FocusPrayerSelection;
  targetAzanTime?: string;
  onSelectPrayer: (prayer: FocusPrayerSelection) => void;
}

const PRAYER_OPTIONS: FocusPrayerSelection[] = ['All', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const FocusPrayerSelector: React.FC<FocusPrayerSelectorProps> = ({
  selectedPrayer,
  targetAzanTime,
  onSelectPrayer,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.headerRow}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.cardTitle}>
          {t('selectPrayerForFocus')}
        </AppText>
        {selectedPrayer !== 'All' && targetAzanTime ? (
          <AppText variant="caption" color={theme.colors.accent} style={styles.timeTag}>
            Azan: {targetAzanTime}
          </AppText>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {PRAYER_OPTIONS.map((name) => {
          const isSelected = selectedPrayer === name;
          const label = name === 'All' ? 'All Prayers' : (t(name.toLowerCase() as any) as string) || name;

          return (
            <Pressable
              key={name}
              onPress={() => onSelectPrayer(name)}
              accessibilityRole="button"
              accessibilityLabel={`${label} prayer`}
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.prayerPill,
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
                style={styles.prayerPillText}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  timeTag: {
    fontWeight: '700',
    fontSize: 12,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  prayerPill: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerPillText: {
    fontWeight: '700',
    fontSize: 12,
  },
});

