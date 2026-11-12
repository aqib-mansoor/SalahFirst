import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface NotificationPreferencesCardProps {
  missedPrayersEnabled: boolean;
  onToggleMissedPrayers: () => void;
  streakEncouragementEnabled: boolean;
  onToggleStreakEncouragement: () => void;
}

export const NotificationPreferencesCard: React.FC<NotificationPreferencesCardProps> = ({
  missedPrayersEnabled,
  onToggleMissedPrayers,
  streakEncouragementEnabled,
  onToggleStreakEncouragement,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const renderToggleRow = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: () => void,
    isLast: boolean = false
  ) => (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
      ]}
    >
      <View style={styles.textContainer}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
          {title}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted} style={styles.description}>
          {description}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.surfaceElevated,
          true: theme.colors.primary,
        }}
        thumbColor={value ? theme.colors.surface : theme.colors.textSubtle}
      />
    </View>
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      {renderToggleRow(
        t('missedPrayersTitle'),
        t('missedPrayersDesc'),
        missedPrayersEnabled,
        onToggleMissedPrayers
      )}
      {renderToggleRow(
        t('streakEncouragementTitle'),
        t('streakEncouragementDesc'),
        streakEncouragementEnabled,
        onToggleStreakEncouragement,
        true
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '700',
  },
  description: {
    lineHeight: 16,
  },
});

