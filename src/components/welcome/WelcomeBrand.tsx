import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { APP_CONFIG } from '@/constants/config';
import { SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { BrandLogo3D } from './BrandLogo3D';

export const WelcomeBrand: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <BrandLogo3D size={110} style={styles.logo} />

      <Text style={styles.titleContainer}>
        <Text style={[styles.titleWord, { color: theme.colors.text }]}>
          {APP_CONFIG.nameFirst}
        </Text>
        <Text style={[styles.titleWord, { color: theme.colors.accent }]}>
          {APP_CONFIG.nameSecond}
        </Text>
      </Text>

      <AppText
        variant="bodyLarge"
        color={theme.colors.textMuted}
        align="center"
        style={styles.tagline}
      >
        {APP_CONFIG.tagline}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: SPACING.xxl,
  },
  titleContainer: {
    ...TYPOGRAPHY.brandTitle,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  titleWord: {
    fontWeight: '800',
  },
  tagline: {
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});

