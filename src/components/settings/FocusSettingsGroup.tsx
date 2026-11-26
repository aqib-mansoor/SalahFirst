import React from 'react';
import { StyleSheet, View, Switch, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { triggerHaptic } from '@/utils/haptics';

export interface FocusSettingsGroupProps {
  autoSilenceEnabled: boolean;
  onToggleAutoSilence: (enabled: boolean) => void;
  activePrayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  onTogglePrayer: (prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => void;
  onOpenFocusConfig?: () => void;
}

const PRAYER_KEYS: ('fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha')[] = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

export const FocusSettingsGroup: React.FC<FocusSettingsGroupProps> = ({
  autoSilenceEnabled,
  onToggleAutoSilence,
  activePrayers,
  onTogglePrayer,
  onOpenFocusConfig,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const ChevronRight = (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={theme.colors.textSecondary}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.textSecondary} style={styles.sectionLabel}>
        {t('prayerFocusAndCongregation').toUpperCase()}
      </AppText>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {/* Row 1: Auto-Silence Master Toggle */}
        <View style={styles.row}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.border }]}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.textCol}>
              <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                {t('autoSilenceTitle')}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                {t('autoSilenceSub')}
              </AppText>
            </View>
          </View>

          <Switch
            value={autoSilenceEnabled}
            onValueChange={onToggleAutoSilence}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.textOnPrimary}
          />
        </View>

        {/* Row 2: 5 Prayer Chips (when enabled) */}
        {autoSilenceEnabled && (
          <View style={[styles.chipsContainer, { backgroundColor: theme.colors.surfaceSubtle }]}>
            <View style={styles.chipsRow}>
              {PRAYER_KEYS.map((key) => {
                const isActive = activePrayers[key];
                const displayName = t(key) || key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      triggerHaptic();
                      onTogglePrayer(key);
                    }}
                    hitSlop={4}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isActive ? theme.colors.secondaryTint : theme.colors.surface,
                        borderColor: isActive ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      color={isActive ? theme.colors.primary : theme.colors.textMuted}
                      style={[styles.chipText, isActive && styles.chipTextActive]}
                      numberOfLines={1}
                    >
                      {displayName}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Row 3: Silence Note Description */}
        <View style={styles.noteRow}>
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.noteText}>
            {t('autoSilenceBadge')}
          </AppText>
        </View>

        {onOpenFocusConfig && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            {/* Row 4: Deep Link to Congregation Delays & Duration Screen */}
            <Pressable onPress={onOpenFocusConfig} style={styles.row}>
              <View style={styles.leftRow}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryTint, borderColor: theme.colors.border }]}>
                  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      stroke={theme.colors.primary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <View style={styles.textCol}>
                  <AppText variant="titleSmall" color={theme.colors.textPrimary} style={styles.rowTitle}>
                    {t('prayerFocusAndCongregation')}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    {t('prayerFocusAndCongregationSub')}
                  </AppText>
                </View>
              </View>
              {ChevronRight}
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs + 2,
  },
  sectionLabel: {
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 4,
    flex: 1,
    paddingRight: SPACING.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontWeight: '700',
  },
  chipsContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  chip: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1.2,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    fontWeight: '800',
  },
  noteRow: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  noteText: {
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60,
  },
});
