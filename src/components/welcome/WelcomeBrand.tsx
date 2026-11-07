import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import { APP_CONFIG } from '@/constants/config';
import { SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { BrandLogo3D } from './BrandLogo3D';
import { useTranslation } from '@/context/LocalizationContext';

export const WelcomeBrand: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        },
      ]}
    >
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
        {t('tagline')}
      </AppText>
    </Animated.View>
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
