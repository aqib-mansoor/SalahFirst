import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { SPACING, RADIUS, PALETTE } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { getIslamicDateFormatted } from '@/utils/prayerTimes';

export interface HomeHeaderProps {
  cityName: string;
  streakCount: number;
  onOpenSettings?: () => void;
  onOpenStreaks?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  cityName,
  streakCount,
  onOpenSettings,
  onOpenStreaks,
}) => {
  const theme = useTheme();
  const hijriDate = getIslamicDateFormatted();

  return (
    <View style={styles.container}>
      {/* Left: Greeting & Location */}
      <View style={styles.leftSection}>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.greeting}>
          Assalamu Alaikum
        </AppText>

        <View style={styles.subtitleRow}>
          <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.dateText}>
            {hijriDate} • {cityName}
          </AppText>
          <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
              stroke={theme.colors.textMuted}
              strokeWidth="2"
            />
            <Circle cx="12" cy="9" r="2.5" stroke={theme.colors.textMuted} strokeWidth="2" />
          </Svg>
        </View>
      </View>

      {/* Right: Streak & Settings */}
      <View style={styles.rightSection}>
        {/* Streak Pill */}
        <Pressable
          onPress={onOpenStreaks}
          style={({ pressed }) => [
            styles.pillBadge,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            pressed && { opacity: 0.75 },
          ]}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill={PALETTE.streakOrange}>
            <Path d="M12 23C7.5 23 4 19.5 4 15C4 11.5 7 8 8.5 6C8.8 5.6 9.4 5.7 9.5 6.2C10 8 11.5 9.5 13 9.5C13.6 9.5 14 9.1 14 8.5C14 6.5 12.5 4 11 2.5C10.7 2.2 10.9 1.7 11.3 1.8C15 3 20 7.5 20 14C20 19 16.5 23 12 23Z" />
          </Svg>
          <AppText variant="titleSmall" color={theme.colors.text} style={styles.streakText}>
            {streakCount}
          </AppText>
        </Pressable>

        {/* Settings Button */}
        <Pressable
          onPress={onOpenSettings}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="3" stroke={theme.colors.text} strokeWidth="2" />
            <Path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke={theme.colors.text}
              strokeWidth="2"
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
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  leftSection: {
    gap: 2,
    flex: 1,
  },
  greeting: {
    fontWeight: '800',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  streakText: {
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

