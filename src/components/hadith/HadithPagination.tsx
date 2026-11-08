import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/context/LocalizationContext';
import { AppText } from '@/components/common';

export interface HadithPaginationProps {
  onPrev: () => void;
  onNext: () => void;
  onRandom: () => void;
}

export const HadithPagination: React.FC<HadithPaginationProps> = ({
  onPrev,
  onNext,
  onRandom,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <Pressable
        onPress={onPrev}
        accessibilityRole="button"
        accessibilityLabel={t('prevHadith')}
        hitSlop={8}
        style={({ pressed }) => [
          styles.navButton,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 18L9 12L15 6"
            stroke={theme.colors.text}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <AppText variant="bodySmall" color={theme.colors.text} style={styles.navLabel}>
          {t('prevHadith')}
        </AppText>
      </Pressable>

      {/* Sacred Gold Shuffle / Random Button */}
      <Pressable
        onPress={onRandom}
        accessibilityRole="button"
        accessibilityLabel={t('randomHadith') || 'Random Hadith'}
        hitSlop={8}
        style={({ pressed }) => [
          styles.randomButton,
          {
            backgroundColor: theme.colors.accentTint,
            borderColor: theme.colors.accent,
          },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
            stroke={theme.colors.warning}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <AppText variant="caption" color={theme.colors.warning} style={styles.randomLabel}>
          {t('randomHadith') || 'Random'}
        </AppText>
      </Pressable>

      {/* Next Button */}
      <Pressable
        onPress={onNext}
        accessibilityRole="button"
        accessibilityLabel={t('nextHadith')}
        hitSlop={8}
        style={({ pressed }) => [
          styles.navButton,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          pressed && { opacity: 0.8 },
        ]}
      >
        <AppText variant="bodySmall" color={theme.colors.text} style={styles.navLabel}>
          {t('nextHadith')}
        </AppText>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 18L15 12L9 6"
            stroke={theme.colors.text}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xs + 2,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  navLabel: {
    fontWeight: '700',
    fontSize: 12,
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 5,
  },
  randomLabel: {
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.3,
  },
});
