import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { SPACING, RADIUS } from '@/constants/theme';
import { ReleaseFeatureItem } from '@/types/appVersion';

interface ReleaseHighlightRowProps {
  item: string | ReleaseFeatureItem;
}

export const ReleaseHighlightRow: React.FC<ReleaseHighlightRowProps> = ({ item }) => {
  const theme = useTheme();

  const isStructured = typeof item === 'object' && item !== null;
  const tag = isStructured ? item.tag : 'UPDATE';
  const desc = isStructured ? item.description : item;

  const isNew = tag.toUpperCase() === 'NEW';
  const isFix = tag.toUpperCase() === 'FIX';

  const badgeBg = isNew
    ? theme.colors.mintTint
    : isFix
    ? theme.colors.warningBg
    : theme.isDark
    ? 'rgba(247, 207, 87, 0.15)'
    : theme.colors.accentTint;

  const badgeColor = isNew
    ? theme.colors.primary
    : isFix
    ? theme.colors.warning
    : theme.colors.accent;

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <AppText variant="caption" color={badgeColor} style={styles.badgeText}>
          {tag}
        </AppText>
      </View>
      <AppText
        variant="bodySmall"
        color={theme.colors.textSecondary}
        style={styles.desc}
      >
        {desc}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    width: '100%',
  },
  badge: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginTop: 1,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  desc: {
    flex: 1,
    lineHeight: 18,
  },
});

