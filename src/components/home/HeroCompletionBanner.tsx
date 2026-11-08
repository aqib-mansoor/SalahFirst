import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SPACING, RADIUS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common';

export interface HeroCompletionBannerProps {
  message: string;
}

export const HeroCompletionBanner: React.FC<HeroCompletionBannerProps> = ({ message }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: 'rgba(0, 0, 0, 0.16)',
          borderColor: 'rgba(247, 207, 87, 0.35)',
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={message}
    >
      {/* Gold Circular Checkmark Icon */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: theme.colors.accent },
        ]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 6L9 17L4 12"
            stroke={theme.colors.buttonGoldText || '#071812'}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      <AppText
        variant="bodySmall"
        color={theme.colors.accentLight}
        numberOfLines={1}
        style={styles.bannerText}
      >
        {message}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm + 2,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
    flex: 1,
  },
});

