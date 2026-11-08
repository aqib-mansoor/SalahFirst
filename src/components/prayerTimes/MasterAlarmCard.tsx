import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface MasterAlarmCardProps {
  enabled: boolean;
  activeCount: number;
  totalCount?: number;
  onToggle: () => void;
}

export const MasterAlarmCard: React.FC<MasterAlarmCardProps> = ({
  enabled,
  activeCount,
  totalCount = 5,
  onToggle,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const badgeText = enabled
    ? `${activeCount}/${totalCount} ${t('active') || 'Active'}`
    : (t('allAlarmsMuted') || 'All Muted');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: enabled
                  ? theme.colors.secondaryTint
                  : theme.colors.surfaceElevated,
              },
            ]}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                stroke={enabled ? theme.colors.primary : theme.colors.textMuted}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M13.73 21a2 2 0 0 1-3.46 0"
                stroke={enabled ? theme.colors.primary : theme.colors.textMuted}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View style={styles.textColumn}>
            <View style={styles.titleWithBadge}>
              <AppText variant="titleSmall" color={theme.colors.text} style={styles.boldText}>
                {t('localAlarmsEnabled')}
              </AppText>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: enabled
                      ? theme.colors.secondaryTint
                      : theme.colors.surfaceElevated,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={enabled ? theme.colors.primary : theme.colors.textMuted}
                  style={styles.badgeText}
                >
                  {badgeText}
                </AppText>
              </View>
            </View>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.subtitle}>
              {t('masterAlarmsSubtitle') || 'Schedules high-precision offline alerts for your location.'}
            </AppText>
          </View>
        </View>

        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor={enabled ? theme.colors.surface : theme.colors.textMuted}
          accessibilityRole="switch"
          accessibilityLabel={t('localAlarmsEnabled')}
          accessibilityState={{ checked: enabled }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  titleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  boldText: {
    fontWeight: '700',
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
});
