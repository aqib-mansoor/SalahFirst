import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export const SetupHeroText: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
        {t('makeSalahPriority')}
      </AppText>

      <AppText variant="bodyLarge" color={theme.colors.textMuted} style={styles.subtitle}>
        {t('setupHeroSubtitle')}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs + 2,
    gap: SPACING.xs,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  subtitle: {
    lineHeight: 21,
    letterSpacing: 0.1,
  },
});

