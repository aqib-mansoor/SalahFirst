import React from 'react';
import { StyleSheet, View, Switch, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { AutoSilenceConfig } from '@/utils/prayerFocusOffsets';
import { triggerHaptic } from '@/utils/haptics';

export interface FocusAutoSilenceCardProps {
  config: AutoSilenceConfig;
  onToggleMaster: (enabled: boolean) => void;
  onTogglePrayer: (prayer: keyof Omit<AutoSilenceConfig, 'enabled'>) => void;
}

const PRAYERS: { key: keyof Omit<AutoSilenceConfig, 'enabled'>; name: string }[] = [
  { key: 'fajr', name: 'Fajr' },
  { key: 'dhuhr', name: 'Dhuhr' },
  { key: 'asr', name: 'Asr' },
  { key: 'maghrib', name: 'Maghrib' },
  { key: 'isha', name: 'Isha' },
];

export const FocusAutoSilenceCard: React.FC<FocusAutoSilenceCardProps> = ({
  config,
  onToggleMaster,
  onTogglePrayer,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handlePrayerPress = (prayer: keyof Omit<AutoSilenceConfig, 'enabled'>) => {
    triggerHaptic();
    onTogglePrayer(prayer);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.masterRow}>
        <View style={styles.textColumn}>
          <View style={styles.titleWithIcon}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"
                stroke={theme.colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
              {t('autoSilenceTitle')}
            </AppText>
          </View>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
            {t('autoSilenceSub')}
          </AppText>
        </View>

        <Switch
          value={config.enabled}
          onValueChange={onToggleMaster}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.surface}
        />
      </View>

      {config.enabled && (
        <View style={styles.detailsSection}>
          <View style={styles.prayerChipsRow}>
            {PRAYERS.map((p) => {
              const isSelected = !!config[p.key];
              const localizedName = t(p.key as any) || p.name;
              return (
                <Pressable
                  key={p.key}
                  onPress={() => handlePrayerPress(p.key)}
                  hitSlop={4}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: isSelected ? theme.colors.secondaryTint : theme.colors.surfaceSubtle,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={isSelected ? theme.colors.primary : theme.colors.textMuted}
                    style={styles.chipText}
                  >
                    {localizedName}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.badge, { backgroundColor: theme.colors.surfaceSubtle }]}>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.badgeText}>
              {t('autoSilenceBadge')}
            </AppText>
          </View>
        </View>
      )}
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
  masterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
    paddingRight: SPACING.md,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  title: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  subtitle: {
    fontSize: 11.5,
    lineHeight: 15,
  },
  detailsSection: {
    gap: SPACING.sm,
    paddingTop: 2,
  },
  prayerChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs + 2,
  },
  chip: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: '600',
    fontSize: 11.5,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10.5,
  },
});
