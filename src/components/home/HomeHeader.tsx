import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';
import { useHijriDate } from '@/hooks/useHijriDate';

export interface HomeHeaderProps {
  cityName: string;
  countryName?: string;
  streakCount: number;
  onOpenSettings?: () => void;
  onOpenStreaks?: () => void;
  onSelectCity?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
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

  return (
    <View style={styles.container}>
      {/* Left: Greeting & Tappable Location/Date Pill */}
      <View style={styles.leftSection}>
        {/* Greeting Title */}
        <AppText
          variant="titleLarge"
          color={theme.colors.textPrimary}
          style={styles.greeting}
          numberOfLines={1}
        >
          {t('assalamuAlaikum')}
        </AppText>

        {/* Sleek Tappable Hijri Date & City Pill */}
        <Pressable
          onPress={onSelectCity}
          disabled={!onSelectCity}
          accessibilityRole={onSelectCity ? 'button' : undefined}
          accessibilityLabel={`Date: ${hijriDateFormatted}, Location: ${cityName}`}
          hitSlop={8}
          style={({ pressed }) => [
            styles.locationPill,
            {
              backgroundColor: pressed ? theme.colors.surfaceSubtle : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {/* Emerald Location Pin */}
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="9" r="2.5" stroke={theme.colors.primary} strokeWidth="2" />
          </Svg>

          <AppText
            variant="caption"
            color={theme.colors.textSecondary}
            style={styles.locationText}
            numberOfLines={1}
          >
            {hijriDateFormatted} • {cityName}
          </AppText>

          {/* Micro Chevron Indicator */}
          {onSelectCity && (
            <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18L15 12L9 6"
                stroke={theme.colors.textSecondary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </Pressable>
      </View>

      {/* Right: Elevated Streak & Settings Action Buttons */}
      <View style={styles.rightSection}>
        {/* Streak Pill in Radiant Champagne Gold */}
        <Pressable
          onPress={onOpenStreaks}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Current streak: ${streakCount} days`}
          accessibilityHint="Navigates to progress and streak statistics"
          style={({ pressed }) => [
            styles.streakBadge,
            {
              backgroundColor: theme.colors.accentTint,
              borderColor: theme.colors.accent,
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Svg width={15} height={15} viewBox="0 0 24 24" fill={theme.colors.accent}>
            <Path d="M12 23C7.5 23 4 19.5 4 15C4 11.5 7 8 8.5 6C8.8 5.6 9.4 5.7 9.5 6.2C10 8 11.5 9.5 13 9.5C13.6 9.5 14 9.1 14 8.5C14 6.5 12.5 4 11 2.5C10.7 2.2 10.9 1.7 11.3 1.8C15 3 20 7.5 20 14C20 19 16.5 23 12 23Z" />
          </Svg>
          <AppText
            variant="caption"
            color={theme.colors.textPrimary}
            style={styles.streakText}
          >
            {streakCount}
          </AppText>
        </Pressable>

        {/* Polished Settings Circular Button */}
        <Pressable
          onPress={onOpenSettings}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          accessibilityHint="Navigates to settings and preferences"
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: pressed ? theme.colors.surfaceSubtle : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="3" stroke={theme.colors.textPrimary} strokeWidth="2" />
            <Path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke={theme.colors.textPrimary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm + 2,
    paddingBottom: SPACING.sm,
  },
  leftSection: {
    flex: 1,
    gap: 3,
    paddingRight: SPACING.sm,
  },
  greeting: {
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3.5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  streakText: {
    fontWeight: '800',
    fontSize: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});
