import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText, IslamicMihrabCanvas } from '@/components/common';

export const TrackerWisdomBanner: React.FC = () => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <IslamicMihrabCanvas goldColor={theme.colors.accent} opacity={0.08} />

      <View style={styles.contentRow}>
        {/* Gold Emblem */}
        <View style={[styles.emblemBadge, { backgroundColor: theme.colors.accentTint }]}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
              stroke={theme.colors.accent}
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        </View>

        {/* Wisdom Text */}
        <View style={styles.textCol}>
          <AppText variant="caption" color={theme.colors.accent} style={styles.wisdomTag}>
            SACRED REFLECTION
          </AppText>
          <AppText variant="bodySmall" color={theme.colors.text} style={styles.quoteText}>
            “The first matter that the slave will be brought to account for on the Day of Judgment is prayer.”
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted} style={styles.sourceText}>
            Sunan an-Nasa'i • 465
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm + 2,
    zIndex: 2,
  },
  emblemBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  wisdomTag: {
    fontWeight: '800',
    fontSize: 9.5,
    letterSpacing: 0.8,
  },
  quoteText: {
    fontWeight: '500',
    fontSize: 11.5,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  sourceText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});

