import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { useHijriDate } from '@/hooks/useHijriDate';
import { triggerHaptic } from '@/utils/haptics';
import { HomeHeaderActionDock } from './HomeHeaderActionDock';

export interface HomeHeaderProps {
  cityName: string;
  countryName?: string;
  streakCount: number;
  onOpenSettings?: () => void;
  onOpenStreaks?: () => void;
  onSelectCity?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = React.memo(({
  cityName,
  countryName,
  streakCount,
  onOpenSettings,
  onOpenStreaks,
  onSelectCity,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { hijriDateFormatted } = useHijriDate(countryName);

  const handleCityPress = () => {
    triggerHaptic('light');
    onSelectCity?.();
  };

  return (
    <View style={styles.container}>
      {/* Left: Professional Islamic Greeting & Location Telemetry */}
      <View style={styles.leftSection}>
        {/* Sleek Islamic Greeting */}
        <AppText
          variant="titleLarge"
          color={theme.colors.textPrimary}
          style={styles.greetingTitle}
          numberOfLines={1}
        >
          {t('assalamuAlaikum')}
        </AppText>

        {/* Sleek Tappable Location & Hijri Date Capsule */}
        <Pressable
          onPress={handleCityPress}
          disabled={!onSelectCity}
          accessibilityRole={onSelectCity ? 'button' : undefined}
          accessibilityLabel={`Location: ${cityName}, Date: ${hijriDateFormatted}`}
          hitSlop={8}
          style={({ pressed }) => [
            styles.locationPill,
            {
              backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
              borderColor: theme.colors.border,
            },
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          {/* Emerald Location Pin */}
          <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
              stroke={theme.colors.primary}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="9" r="2.5" stroke={theme.colors.primary} strokeWidth="2.2" />
          </Svg>

          <AppText
            variant="caption"
            color={theme.colors.textSecondary}
            style={styles.locationText}
            numberOfLines={1}
          >
            {cityName} • {hijriDateFormatted}
          </AppText>

          {/* Micro Chevron Indicator */}
          {onSelectCity && (
            <Svg width={9} height={9} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18L15 12L9 6"
                stroke={theme.colors.textSecondary}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </Pressable>
      </View>

      {/* Right: Decomposed Elevated Action Dock */}
      <HomeHeaderActionDock
        streakCount={streakCount}
        onOpenStreaks={onOpenStreaks}
        onOpenSettings={onOpenSettings}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    gap: 3,
    paddingRight: SPACING.sm,
  },
  greetingTitle: {
    fontWeight: '800',
    letterSpacing: -0.5,
    fontSize: 22,
    lineHeight: 28,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

