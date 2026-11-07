import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface HadithPaginationProps {
  onPrev: () => void;
  onNext: () => void;
}

export const HadithPagination: React.FC<HadithPaginationProps> = ({
  onPrev,
  onNext,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <Pressable
        onPress={onPrev}
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
          Previous Hadith
        </AppText>
      </Pressable>

      {/* Next Button */}
      <Pressable
        onPress={onNext}
        style={({ pressed }) => [
          styles.navButton,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          pressed && { opacity: 0.8 },
        ]}
      >
        <AppText variant="bodySmall" color={theme.colors.text} style={styles.navLabel}>
          Next Hadith
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
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  navLabel: {
    fontWeight: '700',
  },
});

