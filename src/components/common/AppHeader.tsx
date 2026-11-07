import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SPACING } from '@/constants/theme';
import { AppText } from './AppText';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {leftAction}
        <View style={styles.titleColumn}>
          <AppText variant="titleMedium">{title}</AppText>
          {subtitle && (
            <AppText variant="bodySmall" muted>
              {subtitle}
            </AppText>
          )}
        </View>
      </View>
      {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
});

