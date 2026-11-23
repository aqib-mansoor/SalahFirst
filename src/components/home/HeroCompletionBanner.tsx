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
          backgroundColor: 'rgba(0, 0, 0, 0.22)',
          borderColor: 'rgba(247, 207, 87, 0.38)',
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
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
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
        variant="caption"
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
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingVertical: 5,
    paddingHorizontal: SPACING.md + 2,
    gap: SPACING.xs + 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.2,
  },
});


