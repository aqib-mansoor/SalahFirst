import React from 'react';
import { StyleSheet, View } from 'react-native';
import { APP_CONFIG } from '@/constants/config';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export const WelcomeHeader: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <AppText
        variant="headerMotto"
        color={theme.colors.accentMuted}
        align="center"
        style={styles.text}
      >
        {APP_CONFIG.bismillah}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: 2.6,
    opacity: 0.9,
  },
});

