import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';
import { useTranslation } from '@/context/LocalizationContext';

export interface HadithHeaderProps {
  savedCount: number;
}

export const HadithHeader: React.FC<HadithHeaderProps> = ({ savedCount }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.titleColumn}>
        <AppText variant="titleLarge" color={theme.colors.text} style={styles.title}>
          {t('dailyHadithTitle')}
        </AppText>
        <AppText variant="bodySmall" color={theme.colors.textMuted} style={styles.subtitle}>
          {t('dailyHadithWisdom')}
        </AppText>
      </View>

      {savedCount > 0 && (
        <View
          style={[
            styles.savedBadge,
            {
              backgroundColor: theme.colors.accentTint,
              borderColor: theme.colors.accent,
            },
          ]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z"
              fill={theme.colors.accent}
              stroke={theme.colors.accent}
              strokeWidth="2"
            />
          </Svg>
          <AppText variant="caption" color={theme.colors.warning} style={styles.savedBadgeText}>
            {savedCount}
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  titleColumn: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  savedBadgeText: {
    fontWeight: '800',
    fontSize: 12,
  },
});
