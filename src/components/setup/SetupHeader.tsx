import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { APP_CONFIG } from '@/constants/config';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

const MINI_LOGO = require('../../../assets/icons/app-logo-tight.png');

export const SetupHeader: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Brand Identity: Mini 3D Crescent & App Name */}
      <View style={styles.brandRow}>
        <View style={styles.logoWrapper}>
          <Image source={MINI_LOGO} style={styles.logoImage} resizeMode="contain" />
        </View>

        <Text style={styles.brandTitle}>
          <Text style={[styles.brandWord, { color: theme.colors.text }]}>
            {APP_CONFIG.nameFirst}
          </Text>
          <Text style={[styles.brandWord, { color: theme.colors.accent }]}>
            {APP_CONFIG.nameSecond}
          </Text>
        </Text>
      </View>

      {/* Golden Arabic Bismillah Pill */}
      <View
        style={[
          styles.bismillahPill,
          {
            backgroundColor: theme.colors.accentTint,
            borderColor: theme.colors.accent,
          },
        ]}
      >
        <AppText variant="caption" color={theme.colors.textPrimary} style={styles.bismillahText}>
          {APP_CONFIG.bismillah}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandWord: {
    fontWeight: '800',
  },
  bismillahPill: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  bismillahText: {
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

