import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, ThreeDFlameIcon } from '@/components/common';
import { triggerHaptic } from '@/utils/haptics';

export interface HomeHeaderActionDockProps {
  streakCount: number;
  onOpenStreaks?: () => void;
  onOpenSettings?: () => void;
}

export const HomeHeaderActionDock: React.FC<HomeHeaderActionDockProps> = ({
  streakCount,
  onOpenStreaks,
  onOpenSettings,
}) => {
  const theme = useTheme();

  const handleStreakPress = () => {
    triggerHaptic('light');
    onOpenStreaks?.();
  };

  const handleSettingsPress = () => {
    triggerHaptic('light');
    onOpenSettings?.();
  };

  return (
    <View style={styles.rightSection}>
      {/* Streak Pill in Radiant Champagne Gold */}
      <Pressable
        onPress={handleStreakPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Current streak: ${streakCount} days`}
        style={({ pressed }) => [
          styles.streakBadge,
          {
            backgroundColor: theme.colors.accentTint,
            borderColor: theme.colors.accent,
          },
          pressed && { transform: [{ scale: 0.94 }], opacity: 0.88 },
        ]}
      >
        <View style={[styles.streakIconOrb, { backgroundColor: theme.colors.surface }]}>
          <ThreeDFlameIcon size={14} />
        </View>
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
        onPress={handleSettingsPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Open settings"
        style={({ pressed }) => [
          styles.iconButton,
          {
            backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.surface,
            borderColor: theme.colors.border,
          },
          pressed && { transform: [{ scale: 0.92 }] },
        ]}
      >
        <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
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
  );
};

const styles = StyleSheet.create({
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 4,
    paddingRight: SPACING.sm + 2,
    paddingVertical: 3.5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  streakIconOrb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    fontWeight: '800',
    fontSize: 12.5,
  },
  iconButton: {
    width: 38,
    height: 38,
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

