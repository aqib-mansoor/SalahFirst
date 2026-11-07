import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { APP_CONFIG } from '@/constants/config';
import { SPACING } from '@/constants/theme';
import { AppContainer, AppText, AppCard } from '@/components/common';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContainer>
        <View style={styles.centerContainer}>
          <AppCard padding="xl" style={styles.card}>
            <AppText variant="titleMedium" align="center">
              {APP_CONFIG.name}
            </AppText>
            <AppText variant="bodyMedium" muted align="center">
              {APP_CONFIG.tagline}
            </AppText>
            <AppText variant="caption" muted align="center" style={styles.status}>
              Project Initialized • Waiting for Screen 1
            </AppText>
          </AppCard>
        </View>
      </AppContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  status: {
    marginTop: SPACING.md,
  },
});
