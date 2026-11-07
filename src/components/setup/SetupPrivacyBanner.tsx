import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export const SetupPrivacyBanner: React.FC = () => {
  const theme = useTheme('light');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.privacyBg }]}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="11" width="16" height="11" rx="2" stroke={theme.colors.primary} strokeWidth="2" />
        <Path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke={theme.colors.primary} strokeWidth="2" />
      </Svg>

      <AppText variant="bodySmall" color={theme.colors.privacyText} style={styles.text}>
        No login, registration, or internet required for daily use.
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    marginVertical: SPACING.md,
  },
  text: {
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
});

