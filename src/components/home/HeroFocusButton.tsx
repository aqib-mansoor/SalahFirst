import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface HeroFocusButtonProps {
  onPress?: () => void;
  prayerName?: string;
  durationMinutes?: number;
}

export const HeroFocusButton: React.FC<HeroFocusButtonProps> = ({
  onPress,
  prayerName,
  durationMinutes = 15,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const label = prayerName
    ? `${t('startPrayerFocus')} • ${prayerName}`
    : (t('startPrayerFocus') as string);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${durationMinutes} min`}
      accessibilityHint="Opens full-screen quiet focus mode for prayer"
      style={({ pressed }) => [
        styles.focusButton,
        {
          backgroundColor: pressed ? theme.colors.buttonGoldPressed : theme.colors.buttonGold,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      <Svg width={17} height={17} viewBox="0 0 24 24" fill={theme.colors.textOnAccent}>
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </Svg>
      <AppText variant="titleSmall" color={theme.colors.textOnAccent} style={styles.focusButtonText}>
        {label}
      </AppText>
      <AppText variant="caption" color={theme.colors.textOnAccent} style={styles.focusDurationText}>
        {durationMinutes} min
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  focusButtonText: {
    fontWeight: '700',
    fontSize: 13.5,
  },
  focusDurationText: {
    opacity: 0.9,
    fontSize: 12,
    fontWeight: '600',
  },
});
