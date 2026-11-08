import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface HeroFocusButtonProps {
  onPress?: () => void;
}

export const HeroFocusButton: React.FC<HeroFocusButtonProps> = ({ onPress }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${t('startPrayerFocus')}, 15 min`}
      accessibilityHint="Opens quiet focus mode for prayer"
      style={({ pressed }) => [
        styles.focusButton,
        {
          backgroundColor: pressed ? '#C5A359' : theme.colors.accent,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill={theme.colors.textOnAccent}>
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </Svg>
      <AppText variant="titleSmall" color={theme.colors.textOnAccent} style={styles.focusButtonText}>
        {t('startPrayerFocus')}
      </AppText>
      <AppText variant="caption" color={theme.colors.textOnAccent} style={styles.focusDurationText}>
        15 min
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  focusButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  focusDurationText: {
    opacity: 0.9,
    fontSize: 12.5,
    fontWeight: '600',
  },
});
