import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
  const theme = useTheme();

  const categories = [
    { id: 'social', title: 'Social Feeds', apps: 'Insta, FB, X', active: blockSocial, onToggle: onToggleSocial },
    { id: 'videos', title: 'Short Videos', apps: 'TikTok, Reels', active: blockShortVideos, onToggle: onToggleShortVideos },
    { id: 'games', title: 'Mobile Games', apps: 'All Games', active: blockGames, onToggle: onToggleGames },
    { id: 'news', title: 'News & Web', apps: 'Browsers', active: blockNews, onToggle: onToggleNews },
  ];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.titleRow}>
        <AppText variant="titleSmall" color={theme.colors.text} style={styles.title}>
          Distraction Commitment
        </AppText>
        <View style={[styles.badge, { backgroundColor: theme.colors.mintTint }]}>
          <AppText variant="caption" color={theme.colors.primary} style={styles.badgeText}>
            Mindful Shield
          </AppText>
        </View>
      </View>

      <AppText variant="caption" color={theme.colors.textMuted} style={styles.description}>
        Step away from digital noise during prayer. Emergency calls and essential access remain available.
      </AppText>

      <View style={styles.grid}>
        {categories.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.active }}
            accessibilityLabel={`${item.title}, ${item.apps}`}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: item.active ? theme.colors.mintTint : theme.colors.surfaceSubtle,
                borderColor: item.active ? theme.colors.primary : theme.colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={styles.chipTextColumn}>
              <AppText variant="bodySmall" color={theme.colors.text} style={styles.chipTitle}>
                {item.title}
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted} style={styles.chipApps}>
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
                  <Path d="M20 6L9 17L4 12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: SPACING.sm + 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10.5,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  chipTextColumn: {
    flex: 1,
    gap: 1,
  },
  chipTitle: {
    fontWeight: '700',
    fontSize: 12.5,
  },
  chipApps: {
    fontSize: 10.5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
