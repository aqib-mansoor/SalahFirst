import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface ReengagementSettingsGroupProps {
  enabled: boolean;
  onToggleEnabled: (value: boolean) => void;
}

export const ReengagementSettingsGroup: React.FC<ReengagementSettingsGroupProps> = ({
  enabled,
  onToggleEnabled,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppText
        variant="caption"
        color={theme.colors.textSecondary}
        style={styles.sectionLabel}
      >
        {t('reengagementGroupTitle').toUpperCase()}
      </AppText>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* Row 1: Enable/Disable Switch */}
        <View style={styles.row}>
          <View style={styles.leftRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.primaryTint },
              ]}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            <View style={styles.textCol}>
              <AppText
                variant="titleSmall"
                color={theme.colors.textPrimary}
                style={styles.rowTitle}
              >
                {t('reengagementToggleTitle')}
              </AppText>
              <AppText
                variant="caption"
                color={theme.colors.textSecondary}
                style={styles.rowDesc}
              >
                {t('reengagementToggleDesc')}
              </AppText>
            </View>
          </View>

          <Switch
            value={enabled}
            onValueChange={onToggleEnabled}
            trackColor={{
              false: theme.colors.surfaceElevated,
              true: theme.colors.primary,
            }}
            thumbColor={enabled ? theme.colors.surface : theme.colors.textSubtle}
          />
        </View>

        {/* Row 2: Standby & Inactivity Info */}
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.row}>
          <View style={styles.leftRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.mintTint },
              ]}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke={theme.colors.mint}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            <View style={styles.textCol}>
              <AppText
                variant="labelSmall"
                color={theme.colors.textPrimary}
                style={styles.infoTitle}
              >
                {t('reengagementStandbyTitle')}
              </AppText>
              <AppText
                variant="caption"
                color={theme.colors.textSecondary}
                style={styles.infoDesc}
              >
                {t('reengagementStandbyDesc')}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  sectionLabel: {
    letterSpacing: 1.2,
    fontWeight: '700',
    paddingHorizontal: SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  rowTitle: {
    fontWeight: '600',
  },
  rowDesc: {
    marginTop: 2,
    lineHeight: 16,
  },
  infoTitle: {
    fontWeight: '600',
  },
  infoDesc: {
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 62,
  },
});
