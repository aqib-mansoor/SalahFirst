import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface InspirationSettingsGroupProps {
  enabled: boolean;
  onToggleEnabled: (value: boolean) => void;
}

export const InspirationSettingsGroup: React.FC<InspirationSettingsGroupProps> = ({
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
        {t('dailyInspirationGroupTitle').toUpperCase()}
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
        <View style={styles.row}>
          <View style={styles.leftRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.colors.secondaryTint },
              ]}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
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
                {t('dailyInspirationToggleTitle')}
              </AppText>
              <AppText
                variant="caption"
                color={theme.colors.textSecondary}
                style={styles.rowDesc}
              >
                {t('dailyInspirationToggleDesc')}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  sectionLabel: {
    fontWeight: '800',
    letterSpacing: 1.2,
    fontSize: 11,
    marginLeft: SPACING.xs,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.sm,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  rowDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    width: '100%',
  },
});

