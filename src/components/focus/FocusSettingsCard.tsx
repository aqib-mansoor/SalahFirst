import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface FocusSettingsCardProps {
  autoStartOnAzan: boolean;
  onToggleAutoStart: () => void;
}

export const FocusSettingsCard: React.FC<FocusSettingsCardProps> = ({
  autoStartOnAzan,
  onToggleAutoStart,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.textColumn}>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.rowTitle}>
            Auto-start Focus at Namaz time
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.rowSubtitle}>
            Automatically turns on prayer focus after congregation delay
          </AppText>
        </View>

        <Switch
          value={autoStartOnAzan}
          onValueChange={onToggleAutoStart}
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
    fontSize: 13.5,
  },
  rowSubtitle: {
    fontSize: 11.5,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
});
