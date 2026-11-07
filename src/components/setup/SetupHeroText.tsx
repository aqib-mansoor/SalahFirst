import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export const SetupHeroText: React.FC = () => {
  const theme = useTheme('light');

  return (
    <View style={styles.container}>
      <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
        Make Salah a priority.
      </AppText>

      <AppText variant="bodyLarge" color={theme.colors.textMuted} style={styles.subtitle}>
        Stay consistent with accurate Azan times, Qibla direction, distraction-free Prayer
        Focus, and daily Hadith—stored privately on your phone with no sign-up or cloud
        account.
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
    gap: SPACING.sm,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    lineHeight: 22,
    letterSpacing: 0.1,
  },
});

