import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface HeroFocusButtonProps {
  onPress?: () => void;
  onOpenSettings?: () => void;
  prayerName?: string;
  durationMinutes?: number;
}

export const HeroFocusButton: React.FC<HeroFocusButtonProps> = ({
  onPress,
  onOpenSettings,
  prayerName,
  durationMinutes = 15,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const label = prayerName
    ? `${t('startPrayerFocus')} • ${prayerName}`
    : (t('startPrayerFocus') as string);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${durationMinutes} min. Tap to immediately start focus mode.`}
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
          {durationMinutes}m
        </AppText>
      </Pressable>

      {onOpenSettings && (
        <Pressable
          onPress={onOpenSettings}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Prayer focus configuration and offsets"
          style={({ pressed }) => [
            styles.settingsBtn,
            {
              backgroundColor: pressed ? theme.colors.buttonGoldPressed : theme.colors.buttonGold,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
              stroke={theme.colors.textOnAccent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke={theme.colors.textOnAccent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  focusButton: {
    flex: 1,
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
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#202923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
