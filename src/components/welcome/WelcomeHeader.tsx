import React from 'react';
import { StyleSheet, View } from 'react-native';
import { APP_CONFIG } from '@/constants/config';
import { SPACING, WELCOME_THEME } from '@/constants/theme';
import { AppText } from '@/components/common';

export const WelcomeHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <AppText
        variant="arabicMotto"
        color={WELCOME_THEME.bismillah}
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
    opacity: 0.95,
  },
});
