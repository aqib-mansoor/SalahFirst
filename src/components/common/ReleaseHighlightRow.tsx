import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';
import { SPACING, RADIUS } from '@/constants/theme';
import { ReleaseFeatureItem } from '@/types/appVersion';
import Svg, { Path } from 'react-native-svg';

interface ReleaseHighlightRowProps {
  item: string | ReleaseFeatureItem;
}

export const ReleaseHighlightRow: React.FC<ReleaseHighlightRowProps> = ({ item }) => {
  const theme = useTheme();

  const isStructured = typeof item === 'object' && item !== null;
  const tag = (isStructured ? item.tag : 'UPDATE').toUpperCase();
  const desc = isStructured ? item.description : item;

  const isNew = tag === 'NEW';
  const isFix = tag === 'FIX';
  const isOptimized = tag === 'OPTIMIZED' || tag === 'SECURITY';

  const badgeBg = isNew
    ? theme.isDark ? 'rgba(16, 185, 129, 0.14)' : theme.colors.mintTint
    : isFix
    ? theme.isDark ? 'rgba(245, 158, 11, 0.14)' : theme.colors.warningBg
    : isOptimized
    ? theme.isDark ? 'rgba(52, 211, 153, 0.12)' : 'rgba(14, 116, 73, 0.08)'
    : theme.isDark ? 'rgba(247, 207, 87, 0.12)' : theme.colors.accentTint;

  const badgeColor = isNew
    ? theme.colors.primary
    : isFix
    ? theme.colors.warning
    : isOptimized
    ? theme.isDark ? theme.colors.secondary : theme.colors.primaryHero
    : theme.isDark ? theme.colors.accent : theme.colors.primaryHero;

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: badgeBg }]}>
        <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 6L9 17l-5-5"
            stroke={badgeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.inlineHeader}>
          <View style={[styles.pill, { backgroundColor: badgeBg }]}>
            <AppText variant="caption" color={badgeColor} style={styles.pillText}>
              {tag}
            </AppText>
          </View>
          <AppText
            variant="bodySmall"
            color={theme.colors.textPrimary}
            style={styles.desc}
            numberOfLines={2}
          >
            {desc}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
    width: '100%',
    paddingVertical: SPACING.xs,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  inlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs + 2,
  },
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  pillText: {
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  desc: {
    lineHeight: 18,
    fontSize: 12.5,
    flexShrink: 1,
  },
});
