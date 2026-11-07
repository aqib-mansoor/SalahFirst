import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface FocusDistractionCardProps {
  blockSocial: boolean;
  blockShortVideos: boolean;
  blockGames: boolean;
  blockNews: boolean;
  onToggleSocial: () => void;
  onToggleShortVideos: () => void;
  onToggleGames: () => void;
  onToggleNews: () => void;
}

export const FocusDistractionCard: React.FC<FocusDistractionCardProps> = ({
  blockSocial,
  blockShortVideos,
  blockGames,
  blockNews,
  onToggleSocial,
  onToggleShortVideos,
  onToggleGames,
  onToggleNews,
}) => {
  const theme = useTheme('light');

  const categories = [
    {
      id: 'social',
      title: 'Social Feeds',
      apps: 'Insta, FB',
      active: blockSocial,
      onToggle: onToggleSocial,
    },
    {
      id: 'videos',
      title: 'Short Videos',
      apps: 'TikTok, Reels',
      active: blockShortVideos,
      onToggle: onToggleShortVideos,
    },
    {
      id: 'games',
      title: 'Mobile Games',
      apps: 'All Games',
      active: blockGames,
      onToggle: onToggleGames,
    },
    {
      id: 'news',
      title: 'News & Web',
      apps: 'Browsers',
      active: blockNews,
      onToggle: onToggleNews,
    },
  ];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      {/* Title & Badge */}
      <View style={styles.titleRow}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
          Pause Distracting Apps (Optional)
        </AppText>
        <View style={[styles.badge, { backgroundColor: theme.colors.mintTint }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
            Android DND / Usage Access
          </AppText>
        </View>
      </View>

      <AppText variant="caption" color={theme.colors.textMuted} style={styles.description}>
        Uses optional Android Do Not Disturb & gentle overlay reminders. Phone calls and emergency
        access always remain available.
      </AppText>

      {/* 2x2 Non-Overlapping Grid */}
      <View style={styles.grid}>
        <View style={styles.row}>
          {categories.slice(0, 2).map((item) => (
            <Pressable
              key={item.id}
              onPress={item.onToggle}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: item.active ? theme.colors.mintTint : theme.colors.surfaceElevated,
                  borderColor: item.active ? theme.colors.primary : theme.colors.border,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View style={styles.chipTextColumn}>
                <AppText variant="bodySmall" color={theme.colors.text} style={styles.chipTitle}>
                  {item.title}
                </AppText>
                <AppText variant="caption" color={theme.colors.textMuted} style={styles.appNames}>
                  {item.apps}
                </AppText>
              </View>

              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: item.active ? theme.colors.primary : 'transparent',
                    borderColor: item.active ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                {item.active && (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path d="M5 13l4 4L19 7" stroke={theme.colors.surface} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                )}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.row}>
          {categories.slice(2, 4).map((item) => (
            <Pressable
              key={item.id}
              onPress={item.onToggle}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: item.active ? theme.colors.mintTint : theme.colors.surfaceElevated,
                  borderColor: item.active ? theme.colors.primary : theme.colors.border,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View style={styles.chipTextColumn}>
                <AppText variant="bodySmall" color={theme.colors.text} style={styles.chipTitle}>
                  {item.title}
                </AppText>
                <AppText variant="caption" color={theme.colors.textMuted} style={styles.appNames}>
                  {item.apps}
                </AppText>
              </View>

              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: item.active ? theme.colors.primary : 'transparent',
                    borderColor: item.active ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                {item.active && (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path d="M5 13l4 4L19 7" stroke={theme.colors.surface} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  title: {
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
  },
  description: {
    lineHeight: 16,
    marginBottom: 4,
  },
  grid: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md - 2,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    minHeight: 52,
  },
  chipTextColumn: {
    flex: 1,
    gap: 1,
  },
  chipTitle: {
    fontWeight: '700',
    fontSize: 12,
  },
  appNames: {
    fontSize: 10,
    opacity: 0.8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});

