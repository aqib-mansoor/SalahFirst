import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface FocusSettingsCardProps {
  autoStartOnAzan: boolean;
  playAzanBefore: boolean;
  onToggleAutoStart: () => void;
  onTogglePlayAzan: () => void;
}

export const FocusSettingsCard: React.FC<FocusSettingsCardProps> = ({
  autoStartOnAzan,
  playAzanBefore,
  onToggleAutoStart,
  onTogglePlayAzan,
}) => {
  const theme = useTheme('light');

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      {/* Row 1: Auto-start */}
      <View style={styles.row}>
        <View style={styles.textColumn}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
            Auto-start at prayer time
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Prompt to begin Focus when Azan is called
          </AppText>
        </View>

        <Switch
          value={autoStartOnAzan}
          onValueChange={onToggleAutoStart}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.surface}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      {/* Row 2: Play Azan before */}
      <View style={styles.row}>
        <View style={styles.textColumn}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
            Play Azan before Focus session
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Recite soft Azan before starting countdown
          </AppText>
        </View>

        <Switch
          value={playAzanBefore}
          onValueChange={onTogglePlayAzan}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.surface}
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
    gap: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  textColumn: {
    flex: 1,
    gap: 2,
    paddingRight: SPACING.md,
  },
  rowTitle: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
});

