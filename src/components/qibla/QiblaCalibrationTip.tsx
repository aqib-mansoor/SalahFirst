import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export const QiblaCalibrationTip: React.FC = () => {
  const theme = useTheme('light');

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
      <View style={[styles.iconWrapper, { backgroundColor: theme.colors.mintTint }]}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 4V9H4.582M20 20V15H19.418M19.938 9C19.488 5.61 16.592 3 13 3C9.134 3 6 6.134 6 10C6 11.5 6.47 12.89 7.276 14.04M4.062 15C4.512 18.39 7.408 21 11 21C14.866 21 18 17.866 18 14C18 12.5 17.53 11.11 16.724 9.96"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <AppText
        variant="bodySmall"
        color={theme.colors.textMuted}
        style={styles.tipText}
      >
        Move your phone in a gentle figure-8 motion away from magnetic cases to calibrate sensor accuracy.
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm + 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
});
