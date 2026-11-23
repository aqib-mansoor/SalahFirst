import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface HeroFocusButtonProps {
  onPress?: () => void;
  onOpenSettings?: () => void;
  prayerName?: string;
  durationMinutes?: number;
}

/**
 * HeroFocusButton
 * Standalone focus capsule button anchored underneath the twin hero cards.
 * Styled with a clean mint-tinted surface (secondaryTint), deep emerald typography,
 * and a subtle gold specular border.
 */
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
    <View
      style={[
        styles.capsule,
        {
          backgroundColor: theme.colors.secondaryTint,
          borderColor: theme.isDark ? 'rgba(247, 207, 87, 0.40)' : 'rgba(217, 164, 41, 0.35)',
        },
      ]}
    >
      {/* Primary Focus Action Segment */}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${durationMinutes} minutes focus mode`}
        style={({ pressed }) => [
          styles.actionArea,
          {
            backgroundColor: pressed
              ? theme.colors.mintTintPressed
              : 'transparent',
          },
        ]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill={theme.colors.primary}>
          <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </Svg>

        <AppText
          variant="titleSmall"
          color={theme.colors.primary}
          style={styles.actionText}
          numberOfLines={1}
        >
          {label}
        </AppText>

        <AppText color={theme.colors.textSecondary} style={styles.durationInline}>
          • {durationMinutes}m
        </AppText>
      </Pressable>

      {/* Hairline Divider & Settings Trigger */}
      {onOpenSettings && (
        <>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <Pressable
            onPress={onOpenSettings}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Prayer focus configuration and offsets"
            style={({ pressed }) => [
              styles.settingsArea,
              {
                backgroundColor: pressed
                  ? theme.colors.mintTintPressed
                  : 'transparent',
              },
            ]}
          >
            <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                stroke={theme.colors.primary}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                stroke={theme.colors.primary}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  capsule: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 0,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: SPACING.md,
    gap: 6,
  },
  actionText: {
    fontWeight: '800',
    fontSize: 12.5,
    letterSpacing: 0.2,
  },
  durationInline: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  divider: {
    width: 1,
    height: 20,
  },
  settingsArea: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
